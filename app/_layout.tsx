import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { StripeProvider } from "@stripe/stripe-react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "../global.css";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { CartProvider } from "@/hooks/useCart";
import { NotificationProvider } from "@/hooks/useNotification";

export const unstable_settings = {
  anchor: "(tabs)",
};

const STRIPE_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <NotificationProvider>
        <CartProvider>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen
                name="modal"
                options={{ presentation: "modal", title: "Modal" }}
              />
              <Stack.Screen name="SignIn" options={{ headerShown: false }} />
              <Stack.Screen name="SignUp" options={{ headerShown: false }} />
              <Stack.Screen
                name="EditProfile"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="PaymentMethods"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="HelpSupport"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="About" options={{ headerShown: false }} />
              <Stack.Screen
                name="DeliveryAddresses"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="checkout" options={{ headerShown: false }} />
              <Stack.Screen name="driver" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </CartProvider>
      </NotificationProvider>
    </StripeProvider>
  );
}
