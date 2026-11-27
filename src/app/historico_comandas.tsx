import { Ionicons } from '@expo/vector-icons';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { ComandaFechada, useComandas } from '../context/ComandasContext';

export default function HistoricoComandas() {
  const { historicoComandas } = useComandas();

  const formatarDataHora = (item: ComandaFechada) => {
    if (item.dataFechamento && item.horaFechamento) {
      return `${item.dataFechamento} às ${item.horaFechamento}`;
    }
    if (item.fechadaEm) {
      const data = new Date(item.fechadaEm);
      const dia = data.toLocaleDateString('pt-BR');
      const hora = data.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
      return `${dia} às ${hora}`;
    }
    return 'Data indisponível';
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={historicoComandas}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.listaVazia}>
            <Ionicons name="time-outline" size={48} color="#795024" />
            <Text style={styles.textoListaVazia}>
              Nenhuma comanda fechada no histórico.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const totalCalculado =
            item.valorTotal ??
            item.itens.reduce(
              (soma, i) => soma + i.preco * i.quantidade,
              0
            );

          return (
            <View style={styles.cardHistorico}>
              {/* Cabeçalho do card: Mesa e Data/Hora */}
              <View style={styles.cabecalhoCard}>
                <View>
                  <Text style={styles.textoMesa}>Mesa {item.mesa}</Text>
                  <View style={styles.linhaDataHora}>
                    <Ionicons
                      name="calendar-outline"
                      size={14}
                      color="#795024"
                    />
                    <Text style={styles.textoDataHora}>
                      Fechada em {formatarDataHora(item)}
                    </Text>
                  </View>
                </View>

                <View style={styles.badgeFechada}>
                  <Ionicons
                    name="checkmark-circle"
                    size={14}
                    color="#795024"
                  />
                  <Text style={styles.textoBadge}>Encerrada</Text>
                </View>
              </View>

              {/* Divisor */}
              <View style={styles.divisor} />

              {/* Lista de itens da comanda fechada */}
              <View style={styles.secaoItens}>
                <Text style={styles.tituloItens}>Itens consumidos:</Text>

                {item.itens && item.itens.length > 0 ? (
                  item.itens.map((prod, index) => (
                    <View
                      key={`${prod.produtoId}-${index}`}
                      style={styles.linhaItem}
                    >
                      <Text style={styles.quantidadeItem}>
                        {prod.quantidade}x
                      </Text>
                      <Text style={styles.nomeItem}>{prod.nome}</Text>
                      <Text style={styles.valorItem}>
                        R${' '}
                        {(prod.preco * prod.quantidade)
                          .toFixed(2)
                          .replace('.', ',')}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.semItens}>
                    Nenhum item registrado nesta comanda.
                  </Text>
                )}
              </View>

              <View style={styles.rodapeTotal}>
                <Text style={styles.labelTotal}>Valor Total</Text>
                <Text style={styles.valorTotal}>
                  R$ {totalCalculado.toFixed(2).replace('.', ',')}
                </Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  cardHistorico: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#795024',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    gap: 12,
  },

  cabecalhoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },

  textoMesa: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#21170D',
  },

  linhaDataHora: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },

  textoDataHora: {
    fontSize: 13,
    color: '#795024',
  },

  badgeFechada: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3E6CD',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },

  textoBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#795024',
  },

  divisor: {
    height: 1,
    backgroundColor: '#F3E6CD',
  },

  secaoItens: {
    gap: 6,
  },

  tituloItens: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#795024',
    marginBottom: 2,
  },

  linhaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  quantidadeItem: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#795024',
    minWidth: 26,
  },

  nomeItem: {
    flex: 1,
    fontSize: 14,
    color: '#21170D',
  },

  valorItem: {
    fontSize: 14,
    fontWeight: '600',
    color: '#21170D',
  },

  semItens: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#795024',
  },

  rodapeTotal: {
    backgroundColor: '#F3E6CD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  labelTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#795024',
  },

  valorTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#21170D',
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
});
