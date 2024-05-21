import Head from "expo-router/head";

import { NavigationContainer } from '@react-navigation/native';
import React from "react";
import AppNavigator from "../navigation/AppNavigator";



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
      <AppNavigator />
    </>
  );
}
