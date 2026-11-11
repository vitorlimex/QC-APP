import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { ComandasProvider } from '../context/ComandasContext';

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <ComandasProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="selecionar_produtos"
            options={{ presentation: 'modal' }}
          />
        </Stack>
      </ComandasProvider>
    </ThemeProvider>
  );
}