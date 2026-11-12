import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import { useComandas } from '../context/ComandasContext';

export default function DetalhesComanda() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { comandas, removerComanda } = useComandas();

  const comanda = comandas.find(c => c.id === id);

  if (!comanda) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 20 }}>
          Comanda não encontrada (pode ter sido encerrada).
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => ({
            backgroundColor: pressed ? '#555' : '#888',
            paddingVertical: 14,
            paddingHorizontal: 32,
            borderRadius: 12,
            alignItems: 'center',
          })}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  const totalComanda = comanda.itens.reduce(
    (soma, item) => soma + item.preco * item.quantidade,
    0
  );

  const encerrarComanda = () => {
    Alert.alert(
      'Encerrar Comanda',
      `Tem certeza que deseja encerrar a mesa ${comanda.mesa}?`,
      [
        { text: 'NÃO', style: 'cancel' },
        {
          text: 'SIM',
          style: 'destructive',
          onPress: async () => {
            try {
              await removerComanda(comanda.id);
              router.back();
            } catch (erro) {
              console.error(erro);
              Alert.alert('Erro', 'Não foi possível encerrar a comanda.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, paddingTop: 60, paddingHorizontal: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Mesa {comanda.mesa}
      </Text>

      <FlatList
        data={comanda.itens}
        keyExtractor={item => item.produtoId}
        ListEmptyComponent={<Text>Nenhum item adicionado.</Text>}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 10,
              borderBottomWidth: 1,
              borderBottomColor: '#eee',
            }}
          >
            <Text style={{ fontSize: 16 }}>
              {item.quantidade}x {item.nome}
            </Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
              R$ {(item.preco * item.quantidade).toFixed(2)}
            </Text>
          </View>
        )}
      />

      <View
        style={{
          borderTopWidth: 2,
          borderTopColor: '#000',
          paddingVertical: 15,
          marginTop: 10,
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'right' }}>
          Total: R$ {totalComanda.toFixed(2)}
        </Text>
      </View>

      <View style={{ gap: 10, marginTop: 10, marginBottom: 20 }}>
        {/* Adicionar Item — azul (ação principal) */}
        <Pressable
          onPress={() =>
            router.push({
              pathname: '/selecionar_produtos',
              params: { comandaId: comanda.id },
            })
          }
          style={({ pressed }) => ({
            backgroundColor: pressed ? '#005fcc' : '#007AFF',
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
          })}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
            + Adicionar Item
          </Text>
        </Pressable>

        <Pressable
          onPress={encerrarComanda}
          style={({ pressed }) => ({
            backgroundColor: pressed ? '#a00' : 'red',
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
          })}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
            Encerrar Comanda
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
            Voltar
          </Text>
        </Pressable>
      </View>
    </View>
  );
}