
import { render, screen } from '@testing-library/react-native';
import TelaLogin from '../src/app/tela_login';

describe("Testes de Interface - Tela de Login", () => {

  it("deve renderizar os campos de entrada de e-mail e senha", async () => {

    await render(
      <TelaLogin
        onLogin={() => {}}
        onCadastro={() => {}}
      />
    );

    const inputEmail = screen.getByPlaceholderText('Email');
    expect(inputEmail).toBeTruthy();

    const inputSenha = screen.getByPlaceholderText('Senha');
    expect(inputSenha).toBeTruthy();

  });

});
