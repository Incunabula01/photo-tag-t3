import { ExpoConfig, ConfigContext } from "@expo/config";

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
const EAS_APP_ID = process.env.EXPO_PUBLIC_EAS_APP_ID;

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
  scheme: "photo-tag",
});

export default defineConfig;
