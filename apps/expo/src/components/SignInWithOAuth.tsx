import { useOAuth } from "@clerk/clerk-expo";
import React, { useCallback } from "react";
import { Button, View } from "react-native";
import { useWarmUpBrowser } from "../hooks/useWarmUpBrowser";

const SignInWithOAuth = () => {

  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_facebook" });

  const handleFacebookSignin = useCallback(async () => {
    try {
      const { createdSessionId, setActive } =
        await startOAuthFlow();
      if (createdSessionId) {
        setActive?.({ session: createdSessionId });
      } else {
        // Modify this code to use signIn or signUp to set this missing requirements you set in your dashboard.
        throw new Error("There are unmet requirements, modifiy this else to handle them")

      }
    } catch (err) {
      console.log(JSON.stringify(err, null, 2));
      console.log("error signing in", err);
    }
  }, []);

  return (
    <View className="rounded-lg border-2 bg-[#1877F2] p-4">
      <Button
        title="Sign in with Facebook"
        color="white"
        onPress={handleFacebookSignin}
      />

    </View>
  );
}

export default SignInWithOAuth;
