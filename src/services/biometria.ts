import * as LocalAuthentication from "expo-local-authentication";
// verifica se o aparelho possui um sensor biometrico
export async function verificarBiometria() {
  const temSensor = await LocalAuthentication.hasHardwareAsync();

  return temSensor;
}

//verifica se o usuario tem biometria ou rosto cadastrado 
export async function verificarBiometriaCadastrada() {
  const cadastrada = await LocalAuthentication.isEnrolledAsync();

  return cadastrada;
}

// solicita a autenticação tanto biometrica tanto facial
export async function autenticarBiometria() {
  const resultado = await LocalAuthentication.authenticateAsync({
    promptMessage: "Entre no Quarteto Choppastico",
    cancelLabel: "Cancelar",
    disableDeviceFallback: true,
  });

  return resultado.success;
}