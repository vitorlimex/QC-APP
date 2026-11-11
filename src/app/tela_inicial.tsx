import { useRouter } from 'expo-router';
import { Button, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useComandas } from '../context/ComandasContext';

export default function TelaInicial() {
  const router = useRouter();
  const { comandas } = useComandas();

  const handleSair = () => router.replace('/');

  return (
    <View style={{ flex: 1, paddingTop: 50, paddingHorizontal: 20 }}>
      
      <View style={{ 
        flexDirection: 'row', justifyContent: 'space-between', 
        alignItems: 'center', marginBottom: 20 
      }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Comandas Abertas</Text>
        <Button title="Sair" color="red" onPress={handleSair} />
      </View>

      <FlatList
        data={comandas}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhuma comanda aberta.</Text>}
        renderItem={({ item }) => {
          const total = item.itens.reduce((soma, i) => soma + i.preco * i.quantidade, 0);
          
          return (
            <TouchableOpacity 
              onPress={() => router.push({ pathname: '/detalhes_comanda', params: { id: item.id } })}
              style={{ 
                width: '100%', borderWidth: 1, borderColor: '#000',
                padding: 20, marginBottom: 10, borderRadius: 8,
                flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
              }}
            >
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Mesa {item.mesa}</Text>
              <Text>Total: R$ {total.toFixed(2)}</Text>
            </TouchableOpacity>
          );
        }}
      />

      <Button 
        title="+ Nova Comanda" 
        onPress={() => router.push('/criar_comanda')} 
      />
    </View>
  );
}