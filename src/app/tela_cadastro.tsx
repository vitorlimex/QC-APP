import { useState } from "react";
import {StyleSheet, Text, TextInput, View, Pressable,} from "react-native";

import { Ionicons } from "@expo/vector-icons";

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

  // Verifica se todos os campos foram preenchidos
  // e se as senhas são iguais
  function handleCadastro() {
    if (!nome || !email || !senha || !confirmarSenha) {
      alert("Preencha todos os campos!");
      return;
    }

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    alert("Senhas iguais!");
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

      <View style={styles.botoes}>

        <Pressable
          onPress={handleCadastro}
          style={({ pressed }) => [
            styles.botao,
            styles.botaoCadastrar,
            pressed && styles.botaoPressionado,
          ]}
        >
          <Text style={styles.textoCadastrar}>
            Cadastrar
          </Text>
        </Pressable>

        <Pressable
          onPress={onVoltar}
          style={({ pressed }) => [
            styles.botao,
            styles.botaoVoltar,
            pressed && styles.botaoPressionado,
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
});