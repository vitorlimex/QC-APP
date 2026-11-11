import {
    addDoc,
    collection,
    deleteDoc, doc,
    onSnapshot,
    updateDoc
} from 'firebase/firestore';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { db } from '../services/firebaseConfig';

export type ItemComanda = {
  produtoId: string;
  nome: string;
  preco: number;
  quantidade: number;
};

export type Comanda = {
  id: string;
  mesa: string;
  itens: ItemComanda[];
};

type ComandasContextType = {
  comandas: Comanda[];
  adicionarComanda: (comanda: Omit<Comanda, 'id'>) => Promise<void>;
  atualizarComanda: (id: string, itens: ItemComanda[]) => Promise<void>; // NOVO
  removerComanda: (id: string) => Promise<void>;
};

const ComandasContext = createContext<ComandasContextType | null>(null);

export function ComandasProvider({ children }: { children: ReactNode }) {
  const [comandas, setComandas] = useState<Comanda[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'comandas'), (snapshot) => {
      const lista: Comanda[] = [];
      snapshot.forEach((d) => {
        lista.push({ id: d.id, ...(d.data() as Omit<Comanda, 'id'>) });
      });
      setComandas(lista);
    });
    return () => unsubscribe();
  }, []);

  const adicionarComanda = async (comanda: Omit<Comanda, 'id'>) => {
    await addDoc(collection(db, 'comandas'), comanda);
  };

  // NOVO: Atualiza apenas o array de itens
  const atualizarComanda = async (id: string, itens: ItemComanda[]) => {
    const comandaRef = doc(db, 'comandas', id);
    await updateDoc(comandaRef, { itens });
  };

  const removerComanda = async (id: string) => {
    await deleteDoc(doc(db, 'comandas', id));
  };

  return (
    <ComandasContext.Provider value={{ comandas, adicionarComanda, atualizarComanda, removerComanda }}>
      {children}
    </ComandasContext.Provider>
  );
}

export function useComandas() {
  const ctx = useContext(ComandasContext);
  if (!ctx) throw new Error('useComandas deve ser usado dentro de ComandasProvider');
  return ctx;
}