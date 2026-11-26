// Teste Unitário: Validação de regras de cadastro e login
describe("Testes Unitários de Validação", () => {
  
  it("deve validar se a senha possui o tamanho mínimo exigido pelo Firebase (6 caracteres)", () => {
    const senhaCurta = "12345";
    const senhaValida = "123456";

    const ehSenhaValida = (senha: string) => senha.length >= 6;

    expect(ehSenhaValida(senhaCurta)).toBe(false);
    expect(ehSenhaValida(senhaValida)).toBe(true);
  });

  it("deve validar o formato básico de um e-mail", () => {
    const emailInvalido = "usuario-sem-arroba.com";
    const emailValido = "contato@quartetochopastico.com";

    const validarEmail = (email: string) => email.includes("@") && email.includes(".");

    expect(validarEmail(emailInvalido)).toBe(false);
    expect(validarEmail(emailValido)).toBe(true);
  });

});