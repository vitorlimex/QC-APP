import { useState } from 'react';
import TelaInicial from './tela_inicial';
import TelaLogin from './tela_login';
import TelaCadastro from './tela_cadastro';

export default function App() {
  const [tela, setTela] = useState ('Login');

  if(tela === 'Login') {
    return (
    <TelaLogin onLogin={() => setTela('inicial')}
                onCadastro={() => setTela('cadastro')} />
                                                     
    );
  }

  if (tela === 'cadastro') {
    return <TelaCadastro/>;
  }
  
  return <TelaInicial onSair={() => setTela('Login')} />;
}