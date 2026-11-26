import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View,} from 'react-native';
import { useComandas } from '../context/ComandasContext';
import { Ionicons } from '@expo/vector-icons';

export default function TelaInicial() {
  const router = useRouter();
  const { comandas } = useComandas();

  const handleSair = () => router.replace('/');

  return (
    <View style={styles.container}>

      {/* Cabeçalho com botão Sair */}
      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>
          Comandas Abertas
        </Text>

        <Pressable
          onPress={handleSair}
          style={({ pressed }) => [
            styles.botaoSair,
            pressed && styles.botaoPressionado,
          ]}
        >
          <Text style={styles.textoSair}>
            Sair
          </Text>
        </Pressable>
      </View>

      {/* Lista de comandas */}
      <FlatList
        data={comandas}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <View style={styles.listaVazia}>
            <Ionicons
              name="receipt-outline"
              size={48}
              color="#795024"
            />

            <Text style={styles.textoListaVazia}>
              Nenhuma comanda aberta.
            </Text>
          </View>
        }

        renderItem={({ item }) => {
          const total = item.itens.reduce(
            (soma, i) => soma + i.preco * i.quantidade,
            0
          );

          return (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/detalhes_comanda',
                  params: { id: item.id },
                })
              }
              style={({ pressed }) => [
                styles.cardComanda,
                pressed && styles.botaoPressionado,
              ]}
            >
              <View>
                <Text style={styles.textoMesa}>
                  Mesa {item.mesa}
                </Text>

                <Text style={styles.statusComanda}>
                  Comanda aberta
                </Text>
              </View>

              <View style={styles.containerTotal}>
                <View>
                  <Text style={styles.labelTotal}>
                    Total
                  </Text>

                  <Text style={styles.valorTotal}>
                    R$ {total.toFixed(2).replace('.', ',')}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={22}
                  color="#795024"
                />
              </View>
            </Pressable>
          );
        }}
      />

      {/* Botão Nova Comanda */}
      <Pressable
        onPress={() => router.push('/criar_comanda')}
        style={({ pressed }) => [
          styles.botaoNovaComanda,
          pressed && styles.botaoPressionado,
        ]}
      >
        <Text style={styles.textoNovaComanda}>
          + Nova Comanda
        </Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E7',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    gap: 10,
  },

  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#21170D',
    flex: 1,
  },

  botaoSair: {
    backgroundColor: '#795024',
    height: 52,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textoSair: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  cardComanda: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#795024',
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },

  textoMesa: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#21170D',
  },

  statusComanda: {
    fontSize: 12,
    color: '#795024',
    marginTop: 4,
  },

  containerTotal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  labelTotal: {
    fontSize: 12,
    color: '#795024',
    textAlign: 'right',
  },

  valorTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#795024',
    textAlign: 'right',
  },

  listaVazia: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    gap: 12,
  },

  textoListaVazia: {
    fontSize: 16,
    color: '#795024',
    textAlign: 'center',
  },

  botaoNovaComanda: {
    backgroundColor: '#D4AF37',
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 20,
  },

  textoNovaComanda: {
    color: '#21170D',
    fontSize: 16,
    fontWeight: 'bold',
  },

  botaoPressionado: {
    opacity: 0.75,
  },
});