import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View,} from 'react-native';
import { ItemComanda, useComandas } from '../context/ComandasContext';
import { buscarProdutos, Produto } from '../services/lista_produto';
import { Ionicons } from '@expo/vector-icons';

export default function SelecionarProdutos() {
  const { mesa, comandaId } = useLocalSearchParams<{
    mesa?: string;
    comandaId?: string;
  }>();

  const router = useRouter();

  const { comandas, adicionarComanda, atualizarComanda } =
    useComandas();

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [quantidades, setQuantidades] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    buscarProdutos()
      .then(setProdutos)
      .catch(e => console.error(e))
      .finally(() => setCarregando(false));
  }, []);

  const alterar = (id: string, delta: number) => {
    setQuantidades(prev => {
      const atual = prev[id] ?? 0;

      return {
        ...prev,
        [id]: Math.max(0, atual + delta),
      };
    });
  };

  // Calcula o subtotal dos produtos selecionados
  const subtotal = produtos.reduce(
    (soma, produto) =>
      soma + produto.preco * (quantidades[produto.id] ?? 0),
    0
  );

  // Calcula a quantidade total de itens selecionados
  const totalItens = Object.values(quantidades).reduce(
    (soma, quantidade) => soma + quantidade,
    0
  );

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
        const comandaExistente = comandas.find(
          c => c.id === comandaId
        );

        if (!comandaExistente) {
          throw new Error('Comanda não encontrada');
        }

        const itensAtualizados = [...comandaExistente.itens];

        itensNovos.forEach(novoItem => {
          const index = itensAtualizados.findIndex(
            i => i.produtoId === novoItem.produtoId
          );

          if (index >= 0) {
            itensAtualizados[index].quantidade +=
              novoItem.quantidade;
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

  // Tela de carregamento
  if (carregando) {
    return (
      <View style={styles.containerCarregamento}>
        <ActivityIndicator
          size="large"
          color="#795024"
        />

        <Text style={styles.textoCarregamento}>
          Carregando produtos...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>
        {comandaId
          ? 'Adicionar Itens'
          : `Mesa ${mesa} — Produtos`}
      </Text>

      <Text style={styles.subtitulo}>
        Selecione os produtos e suas quantidades
      </Text>

      {/* Lista de produtos */}
      <FlatList
        data={produtos}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}

        ListEmptyComponent={
          <Text style={styles.listaVazia}>
            Nenhum produto disponível.
          </Text>
        }

        renderItem={({ item }) => (
          <View style={styles.cardProduto}>

            <View style={styles.infoProduto}>
              <Text style={styles.nomeProduto}>
                {item.nome}
              </Text>

              <Text style={styles.precoProduto}>
                R$ {item.preco.toFixed(2).replace('.', ',')}
              </Text>
            </View>

            {/* Botão diminuir quantidade */}
            <Pressable
              onPress={() => alterar(item.id, -1)}
              accessibilityLabel={`Remover uma unidade de ${item.nome}`}
              style={({ pressed }) => [
                styles.botaoQuantidade,
                styles.botaoDiminuir,
                pressed && styles.botaoPressionado,
              ]}
            >
              <Ionicons
                name="remove"
                size={24}
                color="#795024"
              />
            </Pressable>

            <Text style={styles.quantidade}>
              {quantidades[item.id] ?? 0}
            </Text>

            {/* Botão aumentar quantidade */}
            <Pressable
              onPress={() => alterar(item.id, 1)}
              accessibilityLabel={`Adicionar uma unidade de ${item.nome}`}
              style={({ pressed }) => [
                styles.botaoQuantidade,
                styles.botaoAumentar,
                pressed && styles.botaoPressionado,
              ]}
            >
              <Ionicons
                name="add"
                size={24}
                color="#21170D"
              />
            </Pressable>

          </View>
        )}
      />

      {/* Resumo dos produtos selecionados */}
      <View style={styles.resumo}>

        <View>
          <Text style={styles.labelResumo}>
            Itens selecionados
          </Text>

          <Text style={styles.valorResumo}>
            {totalItens}
          </Text>
        </View>

        <View>
          <Text style={styles.labelSubtotal}>
            Subtotal
          </Text>

          <Text style={styles.valorSubtotal}>
            R$ {subtotal.toFixed(2).replace('.', ',')}
          </Text>
        </View>

      </View>

      <View style={styles.botoes}>

        {/* Botão Confirmar */}
        <Pressable
          onPress={confirmar}
          style={({ pressed }) => [
            styles.botao,
            styles.botaoConfirmar,
            pressed && styles.botaoPressionado,
          ]}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={22}
            color="#21170D"
          />

          <Text style={styles.textoConfirmar}>
            {comandaId
              ? 'Adicionar à Comanda'
              : 'Confirmar Comanda'}
          </Text>
        </Pressable>

        {/* Botão Cancelar */}
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.botao,
            styles.botaoCancelar,
            pressed && styles.botaoPressionado,
          ]}
        >
          <Ionicons
            name="close-circle-outline"
            size={22}
            color="#795024"
          />

          <Text style={styles.textoCancelar}>
            Cancelar
          </Text>
        </Pressable>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E7',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#21170D',
    marginBottom: 8,
  },

  subtitulo: {
    fontSize: 14,
    color: '#795024',
    marginBottom: 20,
  },

  cardProduto: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#795024',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoProduto: {
    flex: 1,
    marginRight: 10,
  },

  nomeProduto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#21170D',
  },

  precoProduto: {
    fontSize: 14,
    color: '#795024',
    marginTop: 5,
    fontWeight: '600',
  },

  botaoQuantidade: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  botaoDiminuir: {
    backgroundColor: '#F3E6CD',
  },

  botaoAumentar: {
    backgroundColor: '#D4AF37',
  },

  quantidade: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#21170D',
    minWidth: 28,
    textAlign: 'center',
    marginHorizontal: 8,
  },

  resumo: {
    backgroundColor: '#F3E6CD',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  labelResumo: {
    fontSize: 12,
    color: '#795024',
  },

  valorResumo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#21170D',
    marginTop: 4,
  },

  labelSubtotal: {
    fontSize: 12,
    color: '#795024',
    textAlign: 'right',
  },

  valorSubtotal: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#21170D',
    marginTop: 4,
    textAlign: 'right',
  },

  botoes: {
    marginTop: 16,
    gap: 12,
  },

  botao: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  botaoConfirmar: {
    backgroundColor: '#D4AF37',
  },

  botaoCancelar: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#795024',
  },

  textoConfirmar: {
    color: '#21170D',
    fontSize: 16,
    fontWeight: 'bold',
  },

  textoCancelar: {
    color: '#795024',
    fontSize: 16,
    fontWeight: 'bold',
  },

  botaoPressionado: {
    opacity: 0.75,
  },

  containerCarregamento: {
    flex: 1,
    backgroundColor: '#FFF8E7',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },

  textoCarregamento: {
    color: '#795024',
    fontSize: 16,
  },

  listaVazia: {
    color: '#795024',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
  },
});