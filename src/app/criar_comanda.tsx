import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useComandas } from '../context/ComandasContext';

export default function CriarComanda() {
  const router = useRouter();
  const { comandas } = useComandas();
  const [mesa, setMesa] = useState('');

  const abrirModal = () => {
    if (!mesa.trim()) {
      alert('Informe o número da mesa!');
      return;
    }

    const mesaJaOcupada = comandas.some(
      (comanda) => comanda.mesa === mesa.trim()
    );

    if (mesaJaOcupada) {
      alert(`A mesa ${mesa} já possui uma comanda aberta!`);
      return;
    }

    router.push({ pathname: '/selecionar_produtos', params: { mesa: mesa.trim() } });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',   // ⬅️ centraliza verticalmente
          paddingHorizontal: 20,
          paddingBottom: 40,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
          Qual o número da mesa?
        </Text>

        <TextInput
          placeholder="Ex: 01"
          keyboardType="numeric"
          value={mesa}
          onChangeText={setMesa}
          style={{
            borderWidth: 1,
            padding: 15,
            fontSize: 18,
            marginBottom: 20,
            borderRadius: 8,
          }}
        />

        <Pressable
          onPress={abrirModal}
          style={({ pressed }) => ({
            backgroundColor: pressed ? '#005fcc' : '#007AFF',
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
            marginBottom: 12,
          })}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
            Selecionar Produtos
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => ({
            backgroundColor: pressed ? '#555' : '#888',
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
          })}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
            Voltar para a Lista
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}