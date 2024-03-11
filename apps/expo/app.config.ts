import { ExpoConfig, ConfigContext } from "@expo/config";

// const CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
// const EAS_APP_ID = process.env.NEXT_PUBLIC_EAS_APP_ID;
// Temp fix until dev is completed
const CLERK_PUBLISHABLE_KEY =
  "pk_test_cG9saXRlLWdydWJ3b3JtLTEwLmNsZXJrLmFjY291bnRzLmRldiQ";
const EAS_APP_ID = "ae2e68f7-2986-4014-bde7-1a0066f9467a";

const defineConfig = (_ctx: ConfigContext): ExpoConfig => ({
  name: "photo-tag",
  slug: "photo-tag",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/icon.png",
    resizeMode: "contain",
    backgroundColor: "#2e026d",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "photo.tag",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#2e026d",
    },
  },
  extra: {
    eas: {
      projectId: EAS_APP_ID,
    },
    clerkPublishableKey: CLERK_PUBLISHABLE_KEY,
  },
  plugins: [
    ["./expo-plugins/with-modify-gradle.js"],
    [
      "expo-camera",
      {
        cameraPermission: "Allow $(PRODUCT_NAME) to access your camera",
      },
    ],
  ],
});

export default defineConfig;
