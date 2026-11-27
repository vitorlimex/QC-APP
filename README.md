# 🍺 Quarteto Choppastico — Gestor de Comandas

## Sobre o projeto

O projeto foi desenvolvido como parte de uma atividade de extensão do curso de Ciência da Computação e Analise e Desenvolvimento de Sistemas da Universidade Estácio de Sá.

O aplicativo tem como objetivo facilitar o gerenciamento de comandas de um grupo de empreendedores que trabalha com a venda de chopp em feiras e eventos, substituindo o controle manual por uma solução digital.

Com o aplicativo, é possível organizar as comandas, identificar as mesas, adicionar produtos e calcular automaticamente o valor total dos pedidos, facilitando o atendimento e reduzindo erros de cálculo.

## Funcionalidades

- Cadastro e login de usuários com Firebase.
- Mostrar e ocultar senha.
- Visualização das comandas abertas.
- Criação de comandas.
- Identificação de mesas por QR Code ou digitação manual.
- Seleção de produtos e quantidades.
- Cálculo automático do valor total da comanda.
- Adição de produtos em comandas abertas.
- Encerramento de comandas.
- Interface personalizada com as cores escolhidas pela parte interessada.

## Tecnologias utilizadas

- React Native
- TypeScript
- Expo
- Expo Router
- Firebase Authentication
- Cloud Firestore
- Node.js
- Git e GitHub
- Visual Studio Code

## Principais dependências

| Dependência | Finalidade |
|---|---|
| react | Desenvolvimento dos componentes |
| react-native | Desenvolvimento da interface mobile |
| expo | Ambiente de desenvolvimento |
| expo-router | Navegação entre as telas |
| firebase | Autenticação e banco de dados |
| expo-camera | Leitura de QR Code |
| @expo/vector-icons | Ícones do aplicativo |
| expo-local-authentication | Estrutura inicial de biometria |
| expo-secure-store | Armazenamento seguro de informações |
| @react-native-async-storage/async-storage | Armazenamento local |

## Pré-requisitos

Para executar o projeto, é necessário ter instalado:

- Node.js
- npm
- Git
- Expo Go no dispositivo móvel

## Como executar o projeto

### 1. Clonar o repositório

    git clone https://github.com/vitorlimex/QC-APP.git

### 2. Acessar a pasta do projeto

    cd QC-APP

### 3. Instalar as dependências

    npm ci

Caso esteja utilizando o PowerShell e encontre problemas de permissão, utilize:

    npm.cmd ci

### 4. Iniciar o aplicativo

    npx expo start --lan

No PowerShell, caso necessário:

    npx.cmd expo start --lan

### 5. Executar no celular

Abra o Expo Go e escaneie o QR Code apresentado pelo Expo.

O computador e o celular devem estar conectados à mesma rede local. Também é necessário acesso à internet para utilizar os serviços do Firebase.

## Como utilizar o aplicativo

1. Realize o cadastro de uma conta.
2. Entre utilizando o e-mail e a senha cadastrados.
3. Na tela inicial, selecione a opção Nova Comanda.
4. Informe o número da mesa manualmente ou através do QR Code.
5. Selecione os produtos e suas respectivas quantidades.
6. Confirme a criação da comanda.
7. Acesse a comanda para visualizar o total, adicionar produtos ou encerrar o atendimento.

## Testes realizados

Os testes funcionais foram realizados manualmente utilizando o Expo Go em um dispositivo iOS.

| Funcionalidade | Resultado |
|---|---|
| Cadastro de usuário | Aprovado |
| Login com Firebase | Aprovado |
| Mostrar e ocultar senha | Aprovado |
| Criação de comanda manual | Aprovado |
| Leitura de QR Code | Aprovado |
| Seleção de produtos | Aprovado |
| Adição de produtos à comanda | Aprovado |
| Encerramento de comanda | Aprovado |
| Navegação entre as telas | Aprovado |

Também foi realizada a verificação do código TypeScript através do comando:

    npx tsc --noEmit

## Melhorias futuras

- Finalizar a autenticação por biometria.
- Configurar a persistência da sessão do Firebase.
- Revisar as vulnerabilidades das dependências.
- Melhorar o gerenciamento de sessões.
- Ampliar os testes automatizados.

## Desenvolvedores

- Vitor Hugo Lima da Silva Fernandes
- Caio da Silva Maciel
- Max Leandro Rosario Gomes Junior
- Amanda da Silva Lima

## Informações acadêmicas

**Instituição:** Universidade Estácio de Sá — Nova América

**Curso:** Ciência da Computação, Analise e Desenvolvimento de Sistemas

**Ano:** 2026

Projeto desenvolvido para fins acadêmicos e de extensão, buscando solucionar uma necessidade real do comércio local.
