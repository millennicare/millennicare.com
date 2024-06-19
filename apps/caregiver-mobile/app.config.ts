import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "MillenniCare Caregiver",
  slug: "millennicare-caregiver",
  scheme: "millennicare",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/millennicare_logo.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/millennicare_splash_logo.png",
    resizeMode: "contain",
    backgroundColor: "#FDF9F2",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    bundleIdentifier: "your.bundle.identifier",
    supportsTablet: true,
    config: {
      usesNonExemptEncryption: false,
    },
  },
  android: {
    package: "your.bundle.identifier",
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#1F104A",
    },
  },
  extra: {
    eas: {
      projectId: "5a666684-3639-423a-acae-648da79bf224",
    },
  },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  plugins: [
    "expo-router",
    [
      "expo-secure-store",
      {
        faceIDPermission:
          "Allow MillenniCare to access your Face ID biometric data.",
      },
    ],
    [
      "expo-font",
      {
        fonts: [
          "node_modules/@expo-google-fonts/montserrat/Montserrat_400Regular.ttf",
          "node_modules/@expo-google-fonts/quicksand/Quicksand_400Regular.ttf",
        ],
      },
    ],
  ],
});
