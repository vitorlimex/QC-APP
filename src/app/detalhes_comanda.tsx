import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, FlatList, Pressable, StyleSheet, Text, View,} from 'react-native';
import { useComandas } from '../context/ComandasContext';
import { Ionicons } from '@expo/vector-icons';

export default function DetalhesComanda() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { comandas, removerComanda } = useComandas();

  const comanda = comandas.find(c => c.id === id);

  // Verifica se a comanda existe
  if (!comanda) {
    return (
      <View style={styles.containerNaoEncontrada}>

        <Ionicons
          name="receipt-outline"
          size={64}
          color="#795024"
        />

        <Text style={styles.tituloNaoEncontrada}>
          Comanda não encontrada
        </Text>

        <Text style={styles.textoNaoEncontrada}>
          Esta comanda pode ter sido encerrada.
        </Text>

        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.botao,
            styles.botaoVoltar,
            pressed && styles.botaoPressionado,
          ]}
        >
          <Ionicons
            name="arrow-back-outline"
            size={22}
            color="#795024"
          />

          <Text style={styles.textoVoltar}>
            Voltar
          </Text>
        </Pressable>

      </View>
    );
  }

  // Calcula o valor total da comanda
  const totalComanda = comanda.itens.reduce(
    (soma, item) => soma + item.preco * item.quantidade,
    0
  );

  // Solicita confirmação antes de encerrar a comanda
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
              Alert.alert(
                'Erro',
                'Não foi possível encerrar a comanda.'
              );
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>

      {/* Cabeçalho */}
      <View style={styles.cabecalho}>
        <View style={styles.infoCabecalho}>
          <Text style={styles.titulo}>
            Mesa {comanda.mesa}
          </Text>

          <Text style={styles.subtitulo}>
            Detalhes da comanda
          </Text>
        </View>

        <Ionicons
          name="receipt-outline"
          size={40}
          color="#795024"
        />
      </View>

      {/* Lista de produtos da comanda */}
      <FlatList
        data={comanda.itens}
        keyExtractor={item => item.produtoId}
        showsVerticalScrollIndicator={false}

        ListEmptyComponent={
          <Text style={styles.listaVazia}>
            Nenhum item adicionado.
          </Text>
        }

        renderItem={({ item }) => (
          <View style={styles.cardProduto}>

            {/* Quantidade do produto */}
            <View style={styles.containerQuantidade}>
              <Text style={styles.quantidade}>
                {item.quantidade}x
              </Text>
            </View>

            {/* Nome e preço unitário */}
            <View style={styles.infoProduto}>
              <Text style={styles.nomeProduto}>
                {item.nome}
              </Text>

              <Text style={styles.precoUnitario}>
                R$ {item.preco.toFixed(2).replace('.', ',')} / un.
              </Text>
            </View>

            {/* Valor total do produto */}
            <Text style={styles.valorProduto}>
              R$ {(item.preco * item.quantidade)
                .toFixed(2)
                .replace('.', ',')}
            </Text>

          </View>
        )}
      />

      {/* Valor total da comanda */}
      <View style={styles.resumo}>
        <Text style={styles.labelTotal}>
          Total da comanda
        </Text>

        <Text style={styles.valorTotal}>
          R$ {totalComanda.toFixed(2).replace('.', ',')}
        </Text>
      </View>

      <View style={styles.botoes}>

        {/* Botão Adicionar Item */}
        <Pressable
          onPress={() =>
            router.push({
              pathname: '/selecionar_produtos',
              params: { comandaId: comanda.id },
            })
          }
          style={({ pressed }) => [
            styles.botao,
            styles.botaoAdicionar,
            pressed && styles.botaoPressionado,
          ]}
        >
          <Ionicons
            name="add-circle-outline"
            size={22}
            color="#21170D"
          />

          <Text style={styles.textoAdicionar}>
            Adicionar Item
          </Text>
        </Pressable>

        {/* Botão Encerrar Comanda */}
        <Pressable
          onPress={encerrarComanda}
          style={({ pressed }) => [
            styles.botao,
            styles.botaoEncerrar,
            pressed && styles.botaoPressionado,
          ]}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={22}
            color="#FFFFFF"
          />

          <Text style={styles.textoEncerrar}>
            Encerrar Comanda
          </Text>
        </Pressable>

        {/* Botão Voltar */}
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.botao,
            styles.botaoVoltar,
            pressed && styles.botaoPressionado,
          ]}
        >
          <Ionicons
            name="arrow-back-outline"
            size={22}
            color="#795024"
          />

          <Text style={styles.textoVoltar}>
            Voltar
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

  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },

  infoCabecalho: {
    flex: 1,
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#21170D',
  },

  subtitulo: {
    fontSize: 14,
    color: '#795024',
    marginTop: 5,
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
    gap: 10,
  },

  containerQuantidade: {
    minWidth: 40,
    height: 40,
    paddingHorizontal: 6,
    backgroundColor: '#F3E6CD',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  quantidade: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#795024',
  },

  infoProduto: {
    flex: 1,
  },

  nomeProduto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#21170D',
  },

  precoUnitario: {
    fontSize: 12,
    color: '#795024',
    marginTop: 5,
  },

  valorProduto: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#21170D',
  },

  listaVazia: {
    fontSize: 16,
    color: '#795024',
    textAlign: 'center',
    marginTop: 30,
  },

  resumo: {
    backgroundColor: '#F3E6CD',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },

  labelTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#795024',
    flex: 1,
  },

  valorTotal: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#21170D',
  },

  botoes: {
    gap: 12,
    marginTop: 16,
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

  botaoAdicionar: {
    backgroundColor: '#D4AF37',
  },

  botaoEncerrar: {
    backgroundColor: '#A63232',
  },

  botaoVoltar: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#795024',
  },

  textoAdicionar: {
    color: '#21170D',
    fontSize: 16,
    fontWeight: 'bold',
  },

  textoEncerrar: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  textoVoltar: {
    color: '#795024',
    fontSize: 16,
    fontWeight: 'bold',
  },

  botaoPressionado: {
    opacity: 0.75,
  },

  containerNaoEncontrada: {
    flex: 1,
    backgroundColor: '#FFF8E7',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    gap: 16,
  },

  tituloNaoEncontrada: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#21170D',
    textAlign: 'center',
  },

  textoNaoEncontrada: {
    fontSize: 16,
    color: '#795024',
    textAlign: 'center',
    marginBottom: 10,
  },
});