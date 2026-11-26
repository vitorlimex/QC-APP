import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import { auth } from "../services/firebaseConfig";

export default function TelaCadastro({
  onVoltar,
}: {
  onVoltar: () => void;
}) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(""); // <--- Estado de erro na tela

  // Validação dos campos e cadastro no Firebase
  async function handleCadastro() {
    if (carregando) return;
    setErro(""); // Limpa o erro anterior

    if (!nome || !email || !senha || !confirmarSenha) {
      setErro("Preencha todos os campos!");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem!");
      return;
    }

    try {
      setCarregando(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      );

      // Salva o nome do usuário no perfil do Firebase
      await updateProfile(userCredential.user, {
        displayName: nome,
      });

      Alert.alert("Sucesso!", "Conta criada com sucesso!");

      onVoltar();

    } catch (error: any) {
      // Ussei console.log para poder evitar aquela caixinha vermelha de error da expo
      console.log(error);

      let mensagemErro = "Não foi possível realizar o cadastro.";
      const errorCode = error?.code;

      if (errorCode === "auth/email-already-in-use") {
        mensagemErro = "Este e-mail já está em uso por outra conta.";
      } else if (errorCode === "auth/weak-password") {
        mensagemErro = "A senha deve ter pelo menos 6 caracteres.";
      } else if (errorCode === "auth/invalid-email") {
        mensagemErro = "O formato do e-mail digitado é inválido.";
      } else if (errorCode === "auth/network-request-failed") {
        mensagemErro = "Falha na conexão. Verifique sua internet.";
      }

      setErro(mensagemErro); // aviso de error mais amigavel 

    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>
        Criar conta
      </Text>

      <Text style={styles.subtitulo}>
        Preencha seus dados para começar
      </Text>

      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
        placeholderTextColor="#795024"
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        placeholderTextColor="#795024"
      />

      {/* Campo de senha */}
      <View style={styles.containerSenha}>
        <TextInput
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={!mostrarSenha}
          style={[
            styles.input,
            { paddingRight: 50, width: "100%" },
          ]}
          placeholderTextColor="#795024"
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

      {/* Campo de confirmação de senha */}
      <View style={styles.containerSenha}>
        <TextInput
          placeholder="Confirmar senha"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry={!mostrarConfirmarSenha}
          style={[
            styles.input,
            { paddingRight: 50, width: "100%" },
          ]}
          placeholderTextColor="#795024"
        />

        <Pressable
          style={styles.botaoOlho}
          onPress={() =>
            setMostrarConfirmarSenha(!mostrarConfirmarSenha)
          }
          accessibilityLabel={
            mostrarConfirmarSenha
              ? "Ocultar confirmação de senha"
              : "Mostrar confirmação de senha"
          }
        >
          <Ionicons
            name={mostrarConfirmarSenha ? "eye-off" : "eye"}
            size={24}
            color="#795024"
          />
        </Pressable>
      </View>

      {/* exibe o erro na tela se ele existir */}
      {erro ? <Text style={styles.textoErro}>{erro}</Text> : null}

      <View style={styles.botoes}>

        {/* Botão Cadastrar */}
        <Pressable
          onPress={handleCadastro}
          disabled={carregando}
          style={({ pressed }) => [
            styles.botao,
            styles.botaoCadastrar,
            pressed && styles.botaoPressionado,
            carregando && styles.botaoDesabilitado,
          ]}
        >
          <Text style={styles.textoCadastrar}>
            {carregando ? "Cadastrando..." : "Cadastrar"}
          </Text>
        </Pressable>

        {/* Botão Voltar */}
        <Pressable
          onPress={onVoltar}
          disabled={carregando}
          style={({ pressed }) => [
            styles.botao,
            styles.botaoVoltar,
            pressed && styles.botaoPressionado,
            carregando && styles.botaoDesabilitado,
          ]}
        >
          <Text style={styles.textoVoltar}>
            Voltar
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
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },

  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#21170D",
    textAlign: "center",
  },

  subtitulo: {
    fontSize: 14,
    color: "#795024",
    marginBottom: 15,
    textAlign: "center",
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

  textoErro: {
    color: "#B71C1C",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 5,
    fontWeight: "600",
    width: "90%",
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

  botaoCadastrar: {
    backgroundColor: "#D4AF37",
  },

  botaoVoltar: {
    backgroundColor: "#795024",
  },

  textoCadastrar: {
    color: "#21170D",
    fontSize: 16,
    fontWeight: "bold",
  },

  textoVoltar: {
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