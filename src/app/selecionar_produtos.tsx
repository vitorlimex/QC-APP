import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { ItemComanda, useComandas } from '../context/ComandasContext';
import { buscarProdutos, Produto } from '../services/lista_produto';

export default function SelecionarProdutos() {
  const { mesa, comandaId } = useLocalSearchParams<{ mesa?: string; comandaId?: string }>();
  const router = useRouter();
  const { comandas, adicionarComanda, atualizarComanda } = useComandas();

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [quantidades, setQuantidades] = useState<Record<string, number>>({});

  useEffect(() => {
    buscarProdutos()
      .then(setProdutos)
      .catch(e => console.error(e))
      .finally(() => setCarregando(false));
  }, []);

  const alterar = (id: string, delta: number) => {
    setQuantidades(prev => {
      const atual = prev[id] ?? 0;
      return { ...prev, [id]: Math.max(0, atual + delta) };
    });
  };

  const confirmar = async () => {
    const itensNovos: ItemComanda[] = produtos
      .filter(p => (quantidades[p.id] ?? 0) > 0)
      .map(p => ({
        produtoId: p.id,
        nome: p.nome,
        preco: p.preco,
        quantidade: quantidades[p.id],
      }));

    if (itensNovos.length === 0) {
      alert('Selecione pelo menos um produto!');
      return;
    }

    try {
      if (comandaId) {
        const comandaExistente = comandas.find(c => c.id === comandaId);
        if (!comandaExistente) throw new Error('Comanda não encontrada');

        const itensAtualizados = [...comandaExistente.itens];

        itensNovos.forEach(novoItem => {
          const index = itensAtualizados.findIndex(i => i.produtoId === novoItem.produtoId);
          if (index >= 0) {
            itensAtualizados[index].quantidade += novoItem.quantidade;
          } else {
            itensAtualizados.push(novoItem);
          }
        });

        await atualizarComanda(comandaId, itensAtualizados);
        router.back();
      } else {
        await adicionarComanda({
          mesa: mesa ?? '?',
          itens: itensNovos,
        });
        router.dismissTo('/tela_inicial');
      }
    } catch (erro) {
      console.error(erro);
      alert('Erro ao salvar comanda.');
    }
  };

  if (carregando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingTop: 60, paddingHorizontal: 20, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>
        {comandaId ? 'Adicionar Itens' : `Mesa ${mesa} — Produtos`}
      </Text>

      <FlatList
        data={produtos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={{
            flexDirection: 'row', alignItems: 'center',
            paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee',
          }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '600', fontSize: 16 }}>{item.nome}</Text>
              <Text style={{ color: 'green' }}>R$ {item.preco.toFixed(2)}</Text>
            </View>

            {/* Botão - */}
            <Pressable
              onPress={() => alterar(item.id, -1)}
              style={({ pressed }) => ({
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: pressed ? '#ccc' : '#e5e5e5',
                justifyContent: 'center',
                alignItems: 'center',
              })}
            >
              <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#333' }}>−</Text>
            </Pressable>

            <Text style={{ marginHorizontal: 12, fontSize: 18, minWidth: 24, textAlign: 'center' }}>
              {quantidades[item.id] ?? 0}
            </Text>

            {/* Botão + */}
            <Pressable
              onPress={() => alterar(item.id, 1)}
              style={({ pressed }) => ({
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: pressed ? '#005fcc' : '#007AFF',
                justifyContent: 'center',
                alignItems: 'center',
              })}
            >
              <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#fff' }}>+</Text>
            </Pressable>
          </View>
        )}
      />

      <View style={{ marginVertical: 20, gap: 10 }}>
        {/* Confirmar */}
        <Pressable
          onPress={confirmar}
          style={({ pressed }) => ({
            backgroundColor: pressed ? '#1e7e34' : '#28a745',
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
          })}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
            {comandaId ? 'Adicionar à Comanda' : 'Confirmar Comanda'}
          </Text>
        </Pressable>

        {/* Cancelar */}
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => ({
            backgroundColor: pressed ? '#a00' : 'red',
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
          })}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
            Cancelar
          </Text>
        </Pressable>
      </View>
    </View>
  );
}