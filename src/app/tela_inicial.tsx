import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useComandas } from '../context/ComandasContext';
import HistoricoComandas from './historico_comandas';

export default function TelaInicial() {
  const router = useRouter();
  const { comandas } = useComandas();
  const [abaAtiva, setAbaAtiva] = useState<'comandas' | 'historico'>('comandas');

  const handleSair = () => router.replace('/');

  return (
    <View style={styles.container}>
      <View style={styles.conteudo}>
        {/* Cabeçalho com botão Sair */}
        <View style={styles.cabecalho}>
          <Text style={styles.titulo}>
            {abaAtiva === 'comandas'
              ? 'Comandas Abertas'
              : 'Histórico de Comandas'}
          </Text>

          <Pressable
            onPress={handleSair}
            style={({ pressed }) => [
              styles.botaoSair,
              pressed && styles.botaoPressionado,
            ]}
          >
            <Text style={styles.textoSair}>Sair</Text>
          </Pressable>
        </View>

        {abaAtiva === 'comandas' ? (
          <>
            {/* Lista de comandas abertas */}
            <FlatList
              data={comandas}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
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
                      <Text style={styles.textoMesa}>Mesa {item.mesa}</Text>

                      <Text style={styles.statusComanda}>
                        Comanda aberta
                      </Text>
                    </View>

                    <View style={styles.containerTotal}>
                      <View>
                        <Text style={styles.labelTotal}>Total</Text>

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
              <Text style={styles.textoNovaComanda}>+ Nova Comanda</Text>
            </Pressable>
          </>
        ) : (
          <HistoricoComandas />
        )}
      </View>

      {/* Tab Bar com 2 opções */}
      <View style={styles.tabBar}>
        <Pressable
          onPress={() => setAbaAtiva('comandas')}
          style={({ pressed }) => [
            styles.tabItem,
            abaAtiva === 'comandas' && styles.tabItemAtivo,
            pressed && styles.botaoPressionado,
          ]}
        >
          <Ionicons
            name={abaAtiva === 'comandas' ? 'receipt' : 'receipt-outline'}
            size={22}
            color={abaAtiva === 'comandas' ? '#21170D' : '#795024'}
          />
          <Text
            style={[
              styles.tabTexto,
              abaAtiva === 'comandas' && styles.tabTextoAtivo,
            ]}
          >
            Comandas
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setAbaAtiva('historico')}
          style={({ pressed }) => [
            styles.tabItem,
            abaAtiva === 'historico' && styles.tabItemAtivo,
            pressed && styles.botaoPressionado,
          ]}
        >
          <Ionicons
            name={abaAtiva === 'historico' ? 'time' : 'time-outline'}
            size={22}
            color={abaAtiva === 'historico' ? '#21170D' : '#795024'}
          />
          <Text
            style={[
              styles.tabTexto,
              abaAtiva === 'historico' && styles.tabTextoAtivo,
            ]}
          >
            Histórico
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
  },

  conteudo: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
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
    marginBottom: 16,
  },

  textoNovaComanda: {
    color: '#21170D',
    fontSize: 16,
    fontWeight: 'bold',
  },

  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F3E6CD',
    borderTopWidth: 1.5,
    borderTopColor: '#795024',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 24,
    gap: 12,
  },

  tabItem: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  tabItemAtivo: {
    backgroundColor: '#D4AF37',
  },

  tabTexto: {
    fontSize: 15,
    fontWeight: '600',
    color: '#795024',
  },

  tabTextoAtivo: {
    fontWeight: 'bold',
    color: '#21170D',
  },

  botaoPressionado: {
    opacity: 0.75,
  },
});
