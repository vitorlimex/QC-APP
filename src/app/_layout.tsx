import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="tela_login" />
        <Stack.Screen name="tela_inicial" />
        <Stack.Screen name="criar_comanda" />
        <Stack.Screen name="teste_produto" />
      </Stack>
    </ThemeProvider>
  );
}