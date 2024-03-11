import Head from "expo-router/head";
import { ResponsiveNavigator } from "@/components/navigator";

import * as Facebook from 'expo-facebook';

// Initialize Facebook SDK
Facebook.initializeAsync({
  appId: process.env.EXPO_PUBLIC_API_FACEBOOK_CLIENT_ID,
});


export default function Layout() {
  return (
    <>
      <Head>
        <title>Photo Tag</title>
        <meta
          name="description"
          content="Photo tag app"
        />
      </Head>
      <ResponsiveNavigator />
    </>
  );
}
