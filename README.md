![logo](logo.png)

# Automação de Pesquisas Bing para Microsoft Rewards

Este projeto automatiza a realização de pesquisas no Bing com o objetivo de acumular pontos no programa Microsoft Rewards. O script utiliza Node.js e Playwright para controlar um navegador, garantindo que as pesquisas sejam feitas de forma eficiente e única.

## Funcionalidades

- **Automação de Buscas**: Executa uma série de pesquisas no Bing a partir de uma lista de termos.
- **Sessão Persistente**: Utiliza um diretório de dados de usuário (`user_data`) para manter a sessão do navegador, evitando a necessidade de fazer login a cada execução.
- **Gerador de Termos**: Inclui um script em Python (`generate_terms.py`) para criar listas de termos de pesquisa realistas e variados.
- **Prevenção de Duplicatas**: O sistema garante que o mesmo termo não seja pesquisado mais de uma vez na mesma sessão.

## Pré-requisitos

- [Node.js](https://nodejs.org/)
- [Python](https://www.python.org/)

## Instalação e Configuração

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/ggb0x/Bing-Search.git
    cd Bing-Search
    ```

2.  **Instale as dependências do Node.js:**
    ```bash
    npm install
    ```
    Isso instalará o Playwright e outras bibliotecas necessárias.

3.  **Configuração da Conta (Primeira Execução):**
    - Na primeira vez que você executar o script, uma janela do navegador será aberta.
    - **Faça login manualmente na sua conta da Microsoft.**
    - Após o login, você pode fechar o navegador. A sua sessão será salva no diretório `user_data`, que é ignorado pelo Git para proteger sua privacidade.

## Como Usar

1.  **Gere os termos de pesquisa (Opcional):**
    Se desejar criar uma nova lista de termos, execute o script Python.
    ```bash
    python generate_terms.py
    ```

2.  **Execute o script de automação:**
    ```bash
    node index.js
    ```
    O script irá ler os termos do arquivo `search_terms.txt` e começar as pesquisas.

## Automação

Para facilitar a execução do processo, foram criados scripts de automação para Windows, Linux e macOS.

### Windows

Execute o arquivo `Rewards.bat`. Ele irá gerar os termos de pesquisa e iniciar o script de automação em sequência.

```bash
.\Rewards.bat
```

### Linux e macOS

No Linux e macOS, use o script `rewards.sh`. Primeiro, dê a ele permissão de execução:

```bash
chmod +x rewards.sh
```

Depois, execute o script:

```bash
./rewards.sh
```

## Observações Importantes

- O diretório `user_data` armazena os dados da sua sessão de login. Ele já está incluído no `.gitignore` e **não deve** ser enviado para o repositório para garantir a segurança da sua conta.