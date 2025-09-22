"use client";

import { useState } from "react";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  TextInput,
  Button,
  Alert,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function SignupPage() {
  const router = useRouter();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    console.log("Signup button clicked");  // 👈 add this
    if (!fullname || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const BASE_URL = "http://192.168.43.125:3002";

    try {
      const res = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, email, password }),
      });
// read response as text first
  const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);// try parse JSON
       } catch {
    data = { message: text }; // fallback to raw text
  }
      if (!res.ok) {
        throw new Error(data.message || "Failed to create account");
      }

      // try {
      //   // Replace with your backend URL
      //   // const res = await fetch("http://192.168.43.125:3002/api/auth/signup", {
      //   const BASE_URL = "https://rare-plants-stick.loca.lt";

      //   const res = await fetch(`${BASE_URL}/api/auth/signup`, {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({ fullname, email, password }),
      //   });


      //   if (!res.ok) {
      //     const data = await res.json();
      //     throw new Error(data.message || "Failed to create account");
      //   }

      Alert.alert("Success", "Account created!");
      router.push("/login"); // Redirect to login page after signup
    } catch (err: any) {
      Alert.alert("Error", err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedView style={styles.container}>
          <ThemedText type="title">Sign Up</ThemedText>

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#888"
            value={fullname}
            onChangeText={setFullname}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#888"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          {loading ? (
            <ActivityIndicator size="large" />
          ) : (
            <Button title="Sign Up" onPress={handleSignup} />
          )}

          <View style={styles.loginTextContainer}>
            <ThemedText type="default">
              Already have an account?{" "}
              <ThemedText
                type="link"
                onPress={() => router.push("/login")} // Go to login page
                style={{ color: "blue" }}
              >
                Login
              </ThemedText>
            </ThemedText>
          </View>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    fontSize: 16,
    marginBottom: 10,
  },
  loginTextContainer: {
    marginTop: 16,
    alignItems: "center",
  },
});
