import React, { useState } from "react";

import { View, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity, GestureResponderEvent, Text, Button } from "react-native";

import SignInWithOAuth from "../components/SignInWithOAuth";
import SignInWithAuth from "../components/SignInWithAuth";
import SignUpWithAuth from "../components/SignUpWithAuth";

export const SignInSignUpScreen = () => {
  const [viewState, setViewState] = useState<string>('');


  return (
    <SafeAreaView className="bg-white">
      <View className="h-full w-full p-4 flex justify-center items-center">
        {/* <View> */}
        {viewState === "" &&
          <>
            <View className="mb-4 w-full">
              <SignInWithOAuth />
            </View>
            <View className="mb-4 w-full">
              <View className="rounded-lg border-2 border-gray-500 p-4">
                <Button
                  title="Sign Up"
                  onPress={() => setViewState("signUp")}
                />

              </View>
            </View>



            <View className="mb-4 w-full">
              <View className="rounded-lg border-2 border-gray-500 p-4">
                <Button
                  title="Sign In"
                  onPress={() => setViewState("signIn")}
                />

              </View>
            </View>

          </>
        }
        {viewState === "signUp" &&

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
            style={{ flex: 1, width: '100%' }}
          >
            <SignUpWithAuth />
            <TouchableOpacity className="bg-slate-500  py-3 rounded"
              onPress={() => setViewState("")} >
              <Text className="text-white text-center">Back</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>


        }

        {viewState === "signIn" &&

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
            style={{ flex: 1, width: '100%' }}
          >
            <SignInWithAuth />
            <TouchableOpacity className="bg-slate-500  py-3 rounded"
              onPress={() => setViewState("")} >
              <Text className="text-white text-center">Back</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>


        }
      </View>
      {/* </View> */}
    </SafeAreaView>
  );
};
