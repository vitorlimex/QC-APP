import { useState } from "react";
import { Button, Image, StyleSheet, Text, TextInput, View } from "react-native";
import { verificarBiometria, verificarBiometriaCadastrada, autenticarBiometria } from "@/services/biometria";

export default function TelaLogin({
  onLogin,
  onCadastro,
}: {
  onLogin: () => void;
  onCadastro: () => void;
}) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function handleLogin() {
    // trocar esse trecho por uma validação real de login, (firebase ou supabase?)
    if (!email || !senha) {
      alert("Preencha e-mail e senha!");
      return;
    }

    // Chama a função que avisa o index.tsx para mudar de tela
    onLogin();
  }

  async function handleTesteBiometria() {
    const temSensor = await verificarBiometria();
    const cadastrada= await verificarBiometriaCadastrada();


    if (!temSensor || !cadastrada)
    {
      alert("Biometria não disponível ou não cadastrada!")
      return;
    }

    const sucesso = await autenticarBiometria();

    if (sucesso) 
    {
      alert("Biometria reconhecida com sucesso!")
    } 
    else 
    {
        alert("Autenticação biométrica não concluída!")
    }
  }




  return (
    <View style={styles.container}>
      
      <Image
        source={require("../../assets/images/logo.png")}
        style={{ width: 300, height: 250 }}
        resizeMode="contain"
      />

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Senha"
        style={styles.input}
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <View style={styles.botoes}>
        <Button title="Entrar" onPress={handleLogin} />
        <Button title="Cadastro" onPress={onCadastro} />
        <Button title="Testar Biometria" onPress={handleTesteBiometria} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 2,
    borderRadius: 8,
    width: "90%",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  botoes: { width: "90%", gap: 8, marginTop: 10 },
});
