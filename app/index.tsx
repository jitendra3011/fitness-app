import React from "react";
import { Redirect } from "expo-router";

export default function Index() {
  // Default route redirect karega activities page pe
  return <Redirect href="/activities" />;
}
