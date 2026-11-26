import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  Alert,
} from "react-native";

import {
  verificarBiometria,
  verificarBiometriaCadastrada,
  autenticarBiometria,
} from "@/services/biometria";

import { Ionicons } from "@expo/vector-icons";
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
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  // Autenticação com Firebase
  async function handleLogin() {
    if (carregando) return;

    if (!email || !senha) {
      alert("Preencha e-mail e senha!");
      return;
    }

    try {
      setCarregando(true);

      await signInWithEmailAndPassword(auth, email, senha);

      onLogin();
    } catch (error) {
      console.error(error);

      Alert.alert(
        "Erro ao entrar",
        "E-mail ou senha inválidos."
      );
    } finally {
      setCarregando(false);
    }
  }

  // Teste de autenticação biométrica
  async function handleTesteBiometria() {
    const temSensor = await verificarBiometria();
    const cadastrada = await verificarBiometriaCadastrada();

    if (!temSensor || !cadastrada) {
      alert("Biometria não disponível ou não cadastrada!");
      return;
    }

    const sucesso = await autenticarBiometria();

    if (sucesso) {
      alert("Biometria reconhecida com sucesso!");
    } else {
      alert("Autenticação biométrica não concluída!");
    }
  }

  return (
    <View style={styles.container}>

      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <TextInput
        placeholder="Email"
        placeholderTextColor="#795024"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <View style={styles.containerSenha}>
        <TextInput
          placeholder="Senha"
          placeholderTextColor="#795024"
          style={[
            styles.input,
            { paddingRight: 50, width: "100%" },
          ]}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={!mostrarSenha}
        />

        <Pressable
          style={styles.botaoOlho}
          onPress={() => setMostrarSenha(!mostrarSenha)}
          accessibilityLabel={
            mostrarSenha ? "Ocultar senha" : "Mostrar senha"
          }
        >
          <Ionicons
            name={mostrarSenha ? "eye-off" : "eye"}
            size={24}
            color="#795024"
          />
        </Pressable>
      </View>

      <View style={styles.botoes}>

        {/* Botão Entrar */}
        <Pressable
          onPress={handleLogin}
          disabled={carregando}
          style={({ pressed }) => [
            styles.botao,
            styles.botaoEntrar,
            pressed && styles.botaoPressionado,
            carregando && styles.botaoDesabilitado,
          ]}
        >
          <Text style={styles.textoEntrar}>
            {carregando ? "Entrando..." : "Entrar"}
          </Text>
        </Pressable>

        {/* Botão Cadastro */}
        <Pressable
          onPress={onCadastro}
          disabled={carregando}
          style={({ pressed }) => [
            styles.botao,
            styles.botaoCadastro,
            pressed && styles.botaoPressionado,
            carregando && styles.botaoDesabilitado,
          ]}
        >
          <Text style={styles.textoCadastro}>
            Cadastro
          </Text>
        </Pressable>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E7",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },

  logo: {
    width: 300,
    height: 250,
    marginBottom: 10,
  },

  input: {
    borderWidth: 1.5,
    borderColor: "#795024",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    color: "#21170D",
    width: "90%",
    height: 52,
    paddingHorizontal: 15,
    fontSize: 16,
  },

  containerSenha: {
    position: "relative",
    width: "90%",
    justifyContent: "center",
  },

  botaoOlho: {
    position: "absolute",
    right: 15,
    padding: 4,
  },

  botoes: {
    width: "90%",
    gap: 12,
    marginTop: 10,
  },

  botao: {
    width: "100%",
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  botaoEntrar: {
    backgroundColor: "#D4AF37",
  },

  botaoCadastro: {
    backgroundColor: "#795024",
  },

  textoEntrar: {
    color: "#21170D",
    fontSize: 16,
    fontWeight: "bold",
  },

  textoCadastro: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  botaoPressionado: {
    opacity: 0.75,
  },

  botaoDesabilitado: {
    opacity: 0.5,
  },
});