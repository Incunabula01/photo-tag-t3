import React from "react";
import { KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSignIn } from "@clerk/clerk-expo";

export default function SignInScreen() {
    const { signIn, setActive, isLoaded } = useSignIn();

    const [emailAddress, setEmailAddress] = React.useState("");
    const [password, setPassword] = React.useState("");

    const onSignInPress = async () => {
        if (!isLoaded) {
            return;
        }

        try {
            const completeSignIn = await signIn.create({
                identifier: emailAddress,
                password,
            });
            // This is an important step,
            // This indicates the user is signed in
            await setActive({ session: completeSignIn.createdSessionId });
        } catch (err: any) {
            console.log(err);
        }
    };
    return (
        // <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}>
        <View className="flex-1 justify-center items-center">
            <View className="w-full">
                <Text className="text-3xl font-bold mb-4">Sign In</Text>
                <View className="mb-4">
                    <TextInput
                        className="w-full px-4 py-3 rounded border border-gray-300"
                        autoCapitalize="none"
                        value={emailAddress}
                        placeholder="Email..."
                        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                    />
                </View>

                <View className="mb-4">
                    <TextInput
                        className="w-full px-4 py-3 rounded border border-gray-300"
                        value={password}
                        placeholder="Password..."
                        secureTextEntry={true}
                        autoComplete="current-password"
                        onChangeText={(password) => setPassword(password)}
                    />
                </View>

                <TouchableOpacity
                    className="bg-slate-500  py-3 rounded"
                    onPress={onSignInPress}>
                    <Text className="text-white text-center">Sign in</Text>
                </TouchableOpacity>
            </View>

        </View>
        // </KeyboardAvoidingView>

    );
}