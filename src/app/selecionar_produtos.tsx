import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, FlatList, Text, View } from 'react-native';
import { ItemComanda, useComandas } from '../context/ComandasContext';
import { buscarProdutos, Produto } from '../services/lista_produto';

export default function SelecionarProdutos() {
  // Recebe a mesa (para nova comanda) OU o comandaId (para adicionar itens)
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
        // MODO: Adicionar itens a uma comanda existente
        const comandaExistente = comandas.find(c => c.id === comandaId);
        if (!comandaExistente) throw new Error('Comanda não encontrada');

        // Mescla os itens novos com os antigos
        const itensAtualizados = [...comandaExistente.itens];
        
        itensNovos.forEach(novoItem => {
          const index = itensAtualizados.findIndex(i => i.produtoId === novoItem.produtoId);
          if (index >= 0) {
            itensAtualizados[index].quantidade += novoItem.quantidade; // Se já existe, soma a quantidade
          } else {
            itensAtualizados.push(novoItem); // Se não existe, adiciona
          }
        });

        await atualizarComanda(comandaId, itensAtualizados);
        router.back(); // Fecha o modal
      } else {
        // MODO: Criar nova comanda
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
            <Button title="-" onPress={() => alterar(item.id, -1)} />
            <Text style={{ marginHorizontal: 12, fontSize: 18 }}>{quantidades[item.id] ?? 0}</Text>
            <Button title="+" onPress={() => alterar(item.id, 1)} />
          </View>
        )}
      />

      <View style={{ marginVertical: 20, gap: 10 }}>
        <Button title={comandaId ? "Adicionar à Comanda" : "Confirmar Comanda"} onPress={confirmar} />
        <Button title="Cancelar" color="red" onPress={() => router.back()} />
      </View>
    </View>
  );
}