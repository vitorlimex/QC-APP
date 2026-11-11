import { useState } from "react";
import TelaCadastro from "./tela_cadastro";
import TelaInicial from "./tela_inicial";
import TelaLogin from "./tela_login";

export default function App() {
  const [tela, setTela] = useState("Login");

  if (tela === "Login") {
    return (
      <TelaLogin
        onLogin={() => setTela("inicial")}
        onCadastro={() => setTela("cadastro")}
      />
    );
  }

  if (tela === "cadastro") {
    return <TelaCadastro onVoltar={() => setTela("Login")} />;
  }

  return <TelaInicial onSair={() => setTela("Login")} />;
}
