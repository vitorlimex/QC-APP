import { useState } from 'react';
import TelaInicial from './tela_inicial';
import TelaLogin from './tela_login';

export default function App() {
  const [logado, setLogado] = useState(false);

  if (!logado) {
    return <TelaLogin onLogin={() => setLogado(true)} />;
  }
  return <TelaInicial onSair={() => setLogado(false)} />;
}