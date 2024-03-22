import * as React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useState } from "react";

export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState("");

    // start the sign up process.
    const onSignUpPress = async () => {
        if (!isLoaded) {
            return;
        }

        try {
            await signUp.create({
                firstName,
                lastName,
                emailAddress,
                password,
            });

            // send the email.
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

            // change the UI to our pending section.
            setPendingVerification(true);
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
        }
    };

    // This verifies the user using email code that is delivered.
    const onPressVerify = async () => {
        if (!isLoaded) {
            return;
        }

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            });

            await setActive({ session: completeSignUp.createdSessionId });
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
        }
    };

    return (
        <View className="flex-1 justify-center items-center">
            {!pendingVerification && (
                <View className="w-full">
                    <Text className="text-3xl font-bold mb-4">Sign Up</Text>
                    <View className="mb-4">
                        <TextInput
                            className="w-full px-4 py-3 rounded border border-gray-300"
                            autoCapitalize="none"
                            value={firstName}
                            placeholder="First Name..."
                            onChangeText={setFirstName}
                        />
                    </View>
                    <View className="mb-4">
                        <TextInput
                            className="w-full px-4 py-3 rounded border border-gray-300"
                            autoCapitalize="none"
                            value={lastName}
                            placeholder="Last Name..."
                            onChangeText={setLastName}
                        />
                    </View>
                    <View className="mb-4">
                        <TextInput
                            className="w-full px-4 py-3 rounded border border-gray-300"
                            autoCapitalize="none"
                            value={emailAddress}
                            placeholder="Email..."
                            onChangeText={setEmailAddress}
                        />
                    </View>
                    <View className="mb-4">
                        <TextInput
                            className="w-full px-4 py-3 rounded border border-gray-300"
                            value={password}
                            placeholder="Password..."
                            placeholderTextColor="#000"
                            secureTextEntry={true}
                            autoComplete="new-password"
                            onChangeText={setPassword}
                        />
                    </View>
                    <TouchableOpacity
                        className="bg-slate-500  py-3 rounded"
                        onPress={onSignUpPress}
                    >
                        <Text className="text-white text-center">Create</Text>
                    </TouchableOpacity>
                </View>
            )}
            {pendingVerification && (
                <View className="w-4/5">
                    <View className="mb-4">
                        <TextInput
                            className="w-full px-4 py-3 rounded border border-gray-300"
                            value={code}
                            placeholder="Code..."
                            onChangeText={setCode}
                        />
                    </View>
                    <TouchableOpacity
                        className="bg-blue-500  py-3 rounded"
                        onPress={onPressVerify}
                    >
                        <Text className="text-white text-center">Verify Email</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>

    );
}