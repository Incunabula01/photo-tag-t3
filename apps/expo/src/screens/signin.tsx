import React from "react";

import { View, SafeAreaView } from "react-native";

import SignInWithOAuth from "../components/SignInWithOAuth";
import SignInWithAuth from "../components/SignInWithAuth";
import SignUpWithAuth from "../components/SignUpWithAuth";

export const SignInSignUpScreen = () => {
  return (
    <SafeAreaView className="bg-white">
      <View className="h-full w-full p-4 flex justify-center items-center">
        <View>
          <SignInWithOAuth />
          <SignUpWithAuth />
          <SignInWithAuth />
        </View>
      </View>
    </SafeAreaView>
  );
};
