import { onAuthStateChanged } from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { auth, db } from '../services/firebaseConfig';

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
  fechada?: boolean;
};

export type ComandaFechada = {
  id: string;
  mesa: string;
  itens: ItemComanda[];
  valorTotal: number;
  dataFechamento: string;
  horaFechamento: string;
  fechadaEm: string;
  fechada: boolean;
};

type ComandasContextType = {
  comandas: Comanda[];
  historicoComandas: ComandaFechada[];
  adicionarComanda: (comanda: Omit<Comanda, 'id'>) => Promise<void>;
  atualizarComanda: (id: string, itens: ItemComanda[]) => Promise<void>;
  removerComanda: (id: string) => Promise<void>;
  fecharComanda: (comanda: Comanda) => Promise<void>;
};

const ComandasContext = createContext<ComandasContextType | null>(null);

export function ComandasProvider({ children }: { children: ReactNode }) {
  const [comandas, setComandas] = useState<Comanda[]>([]);
  const [historicoComandas, setHistoricoComandas] = useState<ComandaFechada[]>([]);
  const [usuarioLogado, setUsuarioLogado] = useState(auth.currentUser);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setUsuarioLogado(user);
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'comandas'),
      (snapshot) => {
        const abertas: Comanda[] = [];
        const fechadas: ComandaFechada[] = [];

        snapshot.forEach((d) => {
          const dados = d.data() as any;

          if (dados.fechada) {
            fechadas.push({
              id: d.id,
              mesa: dados.mesa ?? '?',
              itens: dados.itens ?? [],
              valorTotal:
                dados.valorTotal ??
                (dados.itens ?? []).reduce(
                  (soma: number, i: ItemComanda) =>
                    soma + i.preco * i.quantidade,
                  0
                ),
              dataFechamento: dados.dataFechamento ?? '',
              horaFechamento: dados.horaFechamento ?? '',
              fechadaEm: dados.fechadaEm ?? '',
              fechada: true,
            });
          } else {
            abertas.push({
              id: d.id,
              mesa: dados.mesa,
              itens: dados.itens ?? [],
            });
          }
        });

        fechadas.sort((a, b) =>
          (b.fechadaEm ?? '').localeCompare(a.fechadaEm ?? '')
        );

        setComandas(abertas);
        setHistoricoComandas(fechadas);
      },
      (erro) => {
        // Evita Uncaught Error caso o listener rode antes do login ou sem permissão
        console.log('Aguardando autenticação para sincronizar comandas:', erro.code);
      }
    );

    return () => unsubscribe();
  }, [usuarioLogado]);

  const adicionarComanda = async (comanda: Omit<Comanda, 'id'>) => {
    await addDoc(collection(db, 'comandas'), {
      ...comanda,
      fechada: false,
    });
  };

  // Atualiza apenas o array de itens
  const atualizarComanda = async (id: string, itens: ItemComanda[]) => {
    const comandaRef = doc(db, 'comandas', id);
    await updateDoc(comandaRef, { itens });
  };

  const removerComanda = async (id: string) => {
    await deleteDoc(doc(db, 'comandas', id));
  };

  // Registra o fechamento da comanda no Firebase (data, hora, valor e itens)
  const fecharComanda = async (comanda: Comanda) => {
    const agora = new Date();
    const valorTotal = comanda.itens.reduce(
      (soma, item) => soma + item.preco * item.quantidade,
      0
    );

    const comandaRef = doc(db, 'comandas', comanda.id);
    await updateDoc(comandaRef, {
      fechada: true,
      valorTotal,
      dataFechamento: agora.toLocaleDateString('pt-BR'),
      horaFechamento: agora.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      fechadaEm: agora.toISOString(),
    });
  };

  return (
    <ComandasContext.Provider
      value={{
        comandas,
        historicoComandas,
        adicionarComanda,
        atualizarComanda,
        removerComanda,
        fecharComanda,
      }}
    >
      {children}
    </ComandasContext.Provider>
  );
}

export function useComandas() {
  const ctx = useContext(ComandasContext);
  if (!ctx) throw new Error('useComandas deve ser usado dentro de ComandasProvider');
  return ctx;
}
