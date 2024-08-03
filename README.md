
# Save Data

## Como executar

#### 1. Clone o repositório:

```bash
git clone https://github.com/Luis020-hub/save-data
```

#### 2. Renomeie o arquivo `./save-data/.env.sample` para `./save-data/.env` e preencha com suas informações.

#### 3. Renomeie o arquivo `template.yaml.sample` para `template.yaml` e preencha as `Variáveis de Ambiente da Função NFSave`.

- DB_URL_PRODUCTION
- GOOGLE_API_KEY

#### 4. Acesse a pasta `save-data` e instale as dependências:

```bash
cd save-data
```
```bash
npm install
```

#### 5. Execute os testes com:

```bash
npm run test
```

#### 6. Compile e faça o deploy:

```bash
sam build
sam deploy --guided
```

#### Deletar

```bash
sam delete
```
