import { useAuth } from "@clerk/clerk-expo";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function ProfileScreen() {
  const { signOut } = useAuth();
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Modify app/profile.tsx</Text>
        <View className="rounded-lg border-2 border-gray-500 p-4">
          <Button
            title="Sign Out"
            onPress={() => {
              signOut();
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});
