import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Button, FlatList, Text, View } from 'react-native';
import { useComandas } from '../context/ComandasContext';

export default function DetalhesComanda() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { comandas, removerComanda } = useComandas();

  // Encontra a comanda pelo ID
  const comanda = comandas.find(c => c.id === id);

  if (!comanda) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Comanda não encontrada (pode ter sido encerrada).</Text>
        <Button title="Voltar" onPress={() => router.back()} />
      </View>
    );
  }

  const totalComanda = comanda.itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0);

  const encerrarComanda = () => {
  Alert.alert(
    'Encerrar Comanda',
    `Tem certeza que deseja encerrar a mesa ${comanda.mesa}?`,
    [
      {
        text: 'NÃO',
        style: 'cancel', // O botão fica com estilo de cancelar
      },
      {
        text: 'SIM',
        style: 'destructive', // O botão fica vermelho (no iOS) indicando perigo
        onPress: async () => {
          try {
            await removerComanda(comanda.id);
            router.back(); // Volta para a tela inicial
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
          <View style={{ 
            flexDirection: 'row', justifyContent: 'space-between', 
            paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' 
          }}>
            <Text style={{ fontSize: 16 }}>
              {item.quantidade}x {item.nome}
            </Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
              R$ {(item.preco * item.quantidade).toFixed(2)}
            </Text>
          </View>
        )}
      />

      <View style={{ borderTopWidth: 2, borderTopColor: '#000', paddingVertical: 15, marginTop: 10 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'right' }}>
          Total: R$ {totalComanda.toFixed(2)}
        </Text>
      </View>

      <View style={{ gap: 10, marginTop: 10 }}>
        <Button 
          title="+ Adicionar Item" 
          onPress={() => router.push({ pathname: '/selecionar_produtos', params: { comandaId: comanda.id } })} 
        />
        <Button 
          title="Encerrar Comanda" 
          color="red" 
          onPress={encerrarComanda} 
        />
        <Button 
          title="Voltar" 
          color="gray" 
          onPress={() => router.back()} 
        />
      </View>
    </View>
  );
}