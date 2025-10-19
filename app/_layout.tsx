
import { WidgetProvider } from '@/contexts/WidgetContext';
import { CustomerProvider } from '@/contexts/CustomerContext';
import { useColorScheme, Alert } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { SystemBars } from 'react-native-edge-to-edge';
import { Stack, router } from 'expo-router';
import { Button } from '@/components/button';
import { useNetworkState } from 'expo-network';
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from '@react-navigation/native';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isConnected } = useNetworkState();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <SystemBars style="auto" />
        <StatusBar style="auto" />
        <WidgetProvider>
          <CustomerProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
              <Stack.Screen
                name="formsheet"
                options={{
                  presentation: 'formSheet',
                  sheetAllowedDetents: [0.5, 1],
                  sheetLargestUndimmedDetent: 0.5,
                  sheetGrabberVisible: true,
                }}
              />
              <Stack.Screen
                name="transparent-modal"
                options={{
                  presentation: 'transparentModal',
                  animation: 'fade',
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="customer/create"
                options={{
                  presentation: 'modal',
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="customer/search"
                options={{
                  presentation: 'modal',
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="customer/[id]"
                options={{
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="customer/edit/[id]"
                options={{
                  presentation: 'modal',
                  headerShown: true,
                }}
              />
            </Stack>
          </CustomerProvider>
        </WidgetProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
