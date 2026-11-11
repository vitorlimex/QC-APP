import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { buscarProdutos, Produto } from "../services/lista_produto";

export default function ListaProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);

  useEffect(() => {
    async function carregar() {
      try {
        const lista = await buscarProdutos();
        setProdutos(lista);
      } catch (erro) {
        console.error("Erro ao buscar dados:", erro);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" />
        <Text>Buscando itens no Firebase...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de Produtos</Text>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.textoNome}>{item.nome}</Text>
            <Text style={styles.textoPreco}>R$ {item.preco}</Text>
            <Text style={styles.textoId}>ID: {item.id}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  centro: { flex: 1, justifyContent: "center", alignItems: "center" },
  titulo: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  item: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#ccc" },
  textoNome: { fontSize: 16, fontWeight: "600" },
  textoPreco: { fontSize: 14, color: "green" },
  textoId: { fontSize: 12, color: "#666" },
});