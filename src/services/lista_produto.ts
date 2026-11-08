import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

export interface Produto {
  id: string;
  nome: string;
  preco: number;
}

const produtosRef = collection(db, "produtos");

export async function buscarProdutos(): Promise<Produto[]> {
  const querySnapshot = await getDocs(produtosRef);
  const lista: Produto[] = [];

  querySnapshot.forEach((doc) => {
    const dados = doc.data();
    lista.push({
      id: doc.id,
      nome: dados.nome,
      preco: dados.preco,
    });
  });

  return lista;
}