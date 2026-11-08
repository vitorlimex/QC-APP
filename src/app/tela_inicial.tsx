import { useRouter } from 'expo-router';
import { Button, FlatList, Text, View } from 'react-native';

const COMANDAS_MOCK = [
  { id: '1', total: 45.50 },
  { id: '2', total: 0 },
];

export default function TelaInicial({ onSair }: { onSair: () => void }) {
  const router = useRouter();

  return (
    <View style={{ flex: 1, paddingTop: 50, paddingHorizontal: 20 }}>
      
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 20 
      }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
          Comandas Abertas
        </Text>
        
        <Button title="Sair" color="red" onPress={onSair} />
      </View>

      <FlatList
        data={COMANDAS_MOCK}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ 
            width: '100%', borderWidth: 1, borderColor: '#000',
            padding: 20, marginBottom: 10, borderRadius: 8,
            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Mesa {item.id}</Text>
            <Text>Total: R$ {item.total.toFixed(2)}</Text>
          </View>
        )}
      />

      <Button 
        title="+ Nova Comanda" 
        onPress={() => router.push('/testefirebase')} 
      />
    </View>
  );
}