import { useRouter } from 'expo-router';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useComandas } from '../context/ComandasContext';

export default function TelaInicial() {
  const router = useRouter();
  const { comandas } = useComandas();

  const handleSair = () => router.replace('/');

  return (
    <View style={{ flex: 1, paddingTop: 50, paddingHorizontal: 20, paddingBottom: 40 }}>

      {/* Cabeçalho com botão Sair */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Comandas Abertas</Text>

        <Pressable
          onPress={handleSair}
          style={({ pressed }) => ({
            backgroundColor: pressed ? '#a00' : 'red',
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 8,
          })}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Sair</Text>
        </Pressable>
      </View>

      <FlatList
        data={comandas}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhuma comanda aberta.</Text>}
        renderItem={({ item }) => {
          const total = item.itens.reduce((soma, i) => soma + i.preco * i.quantidade, 0);
          return (
            <Pressable
              onPress={() => router.push({ pathname: '/detalhes_comanda', params: { id: item.id } })}
              style={({ pressed }) => ({
                width: '100%',
                borderWidth: 1,
                borderColor: '#000',
                padding: 20,
                marginBottom: 10,
                borderRadius: 8,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: pressed ? '#eee' : '#fff',
              })}
            >
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Mesa {item.mesa}</Text>
              <Text>Total: R$ {total.toFixed(2)}</Text>
            </Pressable>
          );
        }}
      />

      {/* Botão Nova Comanda */}
      <Pressable
        onPress={() => router.push('/criar_comanda')}
        style={({ pressed }) => ({
          backgroundColor: pressed ? '#8f8400' : '#b8a900',
          paddingVertical: 18,
          borderRadius: 12,
          alignItems: 'center',
          marginTop: 16,
          marginBottom: 20,
        })}
      >
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>+ Nova Comanda</Text>
      </Pressable>

    </View>
  );
}