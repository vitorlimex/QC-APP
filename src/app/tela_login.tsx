import { useState } from "react";
import { Button, Image, StyleSheet, Text, TextInput, View, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebaseConfig";

export default function TelaLogin({
  onLogin,
  onCadastro,
}: {
  onLogin: () => void;
  onCadastro: () => void;
}) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleLogin() {
    if (!email || !senha) {
      alert("Preencha e-mail e senha!");
      return;
    }

    try {
      setCarregando(true);
      await signInWithEmailAndPassword(auth, email, senha);
      onLogin(); 
    } catch (error: any) {
      console.error(error);
      Alert.alert("Erro ao entrar", "E-mail ou senha inválidos.");
    } finally {
      setCarregando(false);
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
        placeholderTextColor="#777"
      />

      <TextInput
        placeholder="Senha"
        style={styles.input}
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        placeholderTextColor="#777"
      />

      <View style={styles.botoes}>
        <Button 
          title={carregando ? "Entrando..." : "Entrar"} 
          onPress={handleLogin} 
          disabled={carregando} 
        />
        <Button title="Cadastro" onPress={onCadastro} />
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
  input: {
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 8,
    width: "90%",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  botoes: { width: "90%", gap: 8, marginTop: 10 },
});