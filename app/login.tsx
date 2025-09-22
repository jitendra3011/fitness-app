"use client";

import { useState } from "react";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

 const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert("Error", "Please fill all fields");
    return;
  }

  setLoading(true);
  try {
    const res = await fetch("http://192.168.43.130:3002/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Login failed");

    Alert.alert("Success", "Logged in successfully!");
    router.push("/(tabs)");
  } catch (err: any) {
    Alert.alert("Error", err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.innerContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Fitness Illustration */}

          <ThemedText type="title" style={styles.title}>
            Welcome Back!
          </ThemedText>
          <ThemedText type="default" style={styles.subtitle}>
            Ready to crush your workout today?
          </ThemedText>

          {/* Email Input */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#888"
          />

          {/* Password Input */}
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#888"
          />

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotPassword}>
            <ThemedText type="default" style={styles.forgotText}>
              Forgot Password?
            </ThemedText>
          </TouchableOpacity>

          {/* Login Button */}
          {loading ? (
            <ActivityIndicator size="large" color="#ffffff" style={{ marginTop: 20 }} />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <ThemedText type="default" style={styles.buttonText}>
                Login
              </ThemedText>
            </TouchableOpacity>
          )}

          {/* Signup Link */}
          <View style={styles.signupContainer}>
            <ThemedText type="default">New here? </ThemedText>
            <TouchableOpacity onPress={() => router.push("/signup")}>
              <ThemedText type="default" style={styles.signupText}>
                Join Now
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    textAlign: "center",
    marginBottom: 5,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 25,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 15,
    marginVertical: 10,
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotText: {
    textDecorationLine: "underline",
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#32afdcff",
    padding: 12,
    borderRadius: 20,
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#1b1919ff",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  signupText: {
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
});
