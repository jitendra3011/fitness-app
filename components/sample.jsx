// File: app/screens/FirestoreTestScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, Button, TextInput, FlatList } from "react-native";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase"; // your firebase.js file

export default function FirestoreTestScreen() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [users, setUsers] = useState([]);

  // Function to add a document
  const addUser = async () => {
    if (!name || !age) return;
    try {
      await addDoc(collection(db, "users"), {
        name,
        age: Number(age),
      });
      console.log("✅ User added!");
      setName("");
      setAge("");
      fetchUsers(); // refresh list
    } catch (e) {
      console.error("❌ Error adding user: ", e);
    }
  };

  // Function to fetch all users
  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const list = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(list);
    } catch (e) {
      console.error("❌ Error fetching users: ", e);
    }
  };

  useEffect(() => {
    fetchUsers(); // load users on screen mount
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <TextInput
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <Button title="Add User" onPress={addUser} />

      <Text style={{ marginVertical: 20, fontWeight: "bold" }}>Users:</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text>
            {item.name} — {item.age}
          </Text>
        )}
      />
    </View>
  );
}