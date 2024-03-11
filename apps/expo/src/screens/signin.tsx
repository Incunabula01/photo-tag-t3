import React from "react";

import { View, SafeAreaView } from "react-native";

import SignInWithOAuth from "../components/SignInWithOAuth";

export const SignInSignUpScreen = () => {
  return (
    <SafeAreaView className="bg-white">
      <View className="h-full w-full p-4 flex justify-center items-center">
        <View>
          <SignInWithOAuth />
        </View>
      </View>
    </SafeAreaView>
  );
};
