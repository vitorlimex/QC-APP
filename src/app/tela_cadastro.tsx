import { useState } from "react";
import { Button, Text, TextInput, View, Alert } from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../services/firebaseConfig";

export default function TelaCadastro({ onVoltar }: { onVoltar: () => void }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleCadastro() {
    if (!nome || !email || !senha || !confirmarSenha) {
      alert("Preencha todos os campos!");
      return;
    }
    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      setCarregando(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      
      // salva o nome do usuario no perfil do firebase
      await updateProfile(userCredential.user, {
        displayName: nome,
      });

      Alert.alert("Sucesso!", "Conta criada com sucesso!");
      onVoltar(); // retorna para a tela de login
    } catch (error: any) {
      console.error(error);
      let mensagemErro = "Não foi possível realizar o cadastro.";
      if (error.code === 'auth/email-already-in-use') {
        mensagemErro = "Este e-mail já está em uso.";
      } else if (error.code === 'auth/weak-password') {
        mensagemErro = "A senha deve ter pelo menos 6 caracteres.";
      }
      Alert.alert("Erro no Cadastro", mensagemErro);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 12, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 28, fontWeight: "bold", color: "#222", marginBottom: 8 }}>
        Criar conta
      </Text>
      <Text style={{ fontSize: 14, color: "#777", marginBottom: 15 }}>
        Preencha seus dados para começar
      </Text>

      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        style={{ borderWidth: 2, borderColor: "#ccc", borderRadius: 8, width: "90%", padding: 10 }}
        placeholderTextColor="#777"
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ borderWidth: 2, borderColor: "#ccc", borderRadius: 8, width: "90%", padding: 10 }}
        placeholderTextColor="#777"
      />
      <TextInput
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry={true}
        style={{ borderWidth: 2, borderColor: "#ccc", borderRadius: 8, width: "90%", padding: 10 }}
        placeholderTextColor="#777"
      />
      <TextInput
        placeholder="Confirmar senha"
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        secureTextEntry={true}
        style={{ borderWidth: 2, borderColor: "#ccc", borderRadius: 8, width: "90%", padding: 10 }}
        placeholderTextColor="#777"
      />

      <View style={{ width: "90%", gap: 8, marginTop: 10 }}>
        <Button 
          title={carregando ? "Cadastrando..." : "Cadastrar"} 
          onPress={handleCadastro} 
          disabled={carregando} 
        />
        <Button title="Voltar" onPress={onVoltar} />
      </View>
    </View>
  );
}