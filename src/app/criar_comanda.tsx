import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { useComandas } from '../context/ComandasContext'; // Importação adicionada

export default function CriarComanda() {
  const router = useRouter();
  const { comandas } = useComandas(); // Pega a lista de comandas ativas
  const [mesa, setMesa] = useState('');

  const abrirModal = () => {
    if (!mesa.trim()) {
      alert('Informe o número da mesa!');
      return;
    }

    // Verifica se a mesa já está na lista de comandas abertas
    const mesaJaOcupada = comandas.some(
      (comanda) => comanda.mesa === mesa.trim()
    );

    if (mesaJaOcupada) {
      alert(`A mesa ${mesa} já possui uma comanda aberta!`);
      return; // Impede que o modal abra
    }

    // Se estiver livre, abre o modal passando a mesa
    router.push({ pathname: '/selecionar_produtos', params: { mesa: mesa.trim() } });
  };

  return (
    <View style={{ flex: 1, paddingTop: 60, paddingHorizontal: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
        Qual o número da mesa?
      </Text>

      <TextInput
        placeholder="Ex: 01"
        keyboardType="numeric"
        value={mesa}
        onChangeText={setMesa}
        style={{
          borderWidth: 1, padding: 15, fontSize: 18,
          marginBottom: 20, borderRadius: 8,
        }}
      />

      <Button title="Selecionar Produtos" onPress={abrirModal} />
      <View style={{ height: 12 }} />
      <Button title="Voltar para a Lista" color="gray" onPress={() => router.back()} />
    </View>
  );
}