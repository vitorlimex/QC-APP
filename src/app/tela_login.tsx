import { useState } from "react";
import { Button, Image, StyleSheet, Text, TextInput, View, Pressable } from "react-native";
import { verificarBiometria, verificarBiometriaCadastrada, autenticarBiometria } from "@/services/biometria";
import { Ionicons } from '@expo/vector-icons';
export default function TelaLogin({
  onLogin,
  onCadastro,
}: {
  onLogin: () => void;
  onCadastro: () => void;
}) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

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
        placeholderTextColor={"#000000"}
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

    <View style={styles.containerSenha}>
      <TextInput
        placeholder="Senha"
        placeholderTextColor={"#000000"}
        style={[styles.input, {paddingRight: 45, width: '100%'}]}
        value={senha}
        onChangeText={setSenha}
        secureTextEntry={!mostrarSenha}
      />

      <Pressable 
      style={styles.botaoOlho}
      onPress={() => setMostrarSenha(!mostrarSenha)}>
      <Ionicons
        name={mostrarSenha ? "eye-off" : "eye"}
        size={24}
        color="#000"
        />
      </Pressable>
      </View>

      <View style={styles.botoes}>
        <Button title="Entrar" onPress={handleLogin} />
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

  containerSenha: {
    position: 'relative',
    width: '90%',
    justifyContent: 'center',
  },

  botaoOlho: {
    position: 'absolute',
    right: 15,
  },

});
