# 01 - Fundamentos Node.js

Este projeto demonstra os fundamentos do Node.js através de uma API REST completa para gerenciamento de usuários, implementando conceitos avançados como streams, persistência de dados, validação robusta e testes automatizados.

## 🚀 Funcionalidades

- ✅ **API REST Completa** - CRUD completo para usuários
- ✅ **Validação Robusta** - Validação de email e nome com regex avançada
- ✅ **Persistência de Dados** - Database em JSON com carregamento/salvamento automático
- ✅ **Sistema de Logging** - Logs detalhados em arquivos separados
- ✅ **Testes Automatizados** - Cobertura completa com Vitest
- ✅ **Streams HTTP** - Demonstração de streams customizados
- ✅ **Documentação Completa** - API documentada com exemplos

## 📁 Estrutura do Projeto

```
├── src/
│   ├── server.js          # Servidor HTTP principal
│   ├── database.js        # Classe Database com persistência
│   ├── middlewares/
│   │   └── json.js        # Middleware de parsing JSON
│   └── utils/
│       ├── validators.js  # Validações de dados
│       └── logger.js      # Sistema de logging
├── streams/
│   ├── fundamentais.js    # Conceitos básicos de streams
│   ├── stream-http-server.js # Servidor HTTP com streams
│   └── fake-upload-http-stream.js # Cliente de teste
├── tests/
│   ├── api.test.js        # Testes da API
│   ├── validators.test.js # Testes dos validadores
│   └── database.test.js   # Testes do database
├── docs/
│   └── API.md            # Documentação da API
├── logs/                 # Arquivos de log (gerados automaticamente)
├── database.json         # Database persistido (gerado automaticamente)
└── package.json
```

## 🛠️ Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

## 🚀 Como Usar

### Iniciar o Servidor
```bash
npm run dev
```

### Executar Testes
```bash
# Executar todos os testes
npm test

# Executar testes uma vez
npm run test:run

# Executar testes com cobertura
npm run test:coverage
```

### Testar Streams
```bash
# Executar exemplo de streams fundamentais
npm run streams

# Iniciar servidor de streams (porta 3334)
npm run stream-server

# Testar upload de stream
npm run test-streams
```

## 📚 API Endpoints

### Usuários

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/user` | Listar todos os usuários |
| GET | `/user/:id` | Buscar usuário por ID |
| POST | `/user` | Criar novo usuário |
| PUT | `/user/:id` | Atualizar usuário |
| DELETE | `/user/:id` | Deletar usuário |

### Exemplos de Uso

#### Criar Usuário
```bash
curl -X POST http://localhost:3333/user \
  -H "Content-Type: application/json" \
  -d '{"name": "João Silva", "email": "joao@email.com"}'
```

#### Listar Usuários
```bash
curl http://localhost:3333/user
```

#### Atualizar Usuário
```bash
curl -X PUT http://localhost:3333/user/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "João Santos", "email": "joao.santos@email.com"}'
```

#### Deletar Usuário
```bash
curl -X DELETE http://localhost:3333/user/1
```

## 🔍 Validações

### Nome
- Obrigatório
- Mínimo 2 caracteres
- Máximo 100 caracteres
- Apenas letras, espaços e caracteres especiais permitidos

### Email
- Obrigatório
- Formato válido (RFC 5322)
- Máximo 254 caracteres
- Validação robusta com regex

## 📊 Logs

O sistema gera logs detalhados na pasta `logs/`:

- `app.log` - Logs gerais da aplicação
- `error.log` - Logs de erro
- `api.log` - Logs de requisições da API
- `debug.log` - Logs de debug

## 🧪 Testes

O projeto inclui testes automatizados com cobertura completa:

- **Testes de API** - Todos os endpoints testados
- **Testes de Validação** - Validações de email e nome
- **Testes de Database** - Operações CRUD do database

### Executar Testes
```bash
npm test
```

## 🌊 Streams

O projeto demonstra conceitos avançados de streams:

- **Readable Streams** - Geração de dados
- **Transform Streams** - Transformação de dados
- **Writable Streams** - Processamento de dados
- **HTTP Streams** - Streams em requisições HTTP

## 📖 Documentação

A documentação completa da API está disponível em [docs/API.md](docs/API.md).

## 🏗️ Arquitetura

### Database
- Classe `Database` com persistência em JSON
- Operações CRUD completas
- Carregamento/salvamento automático

### Validação
- Validação robusta de email com regex
- Validação de nome com caracteres permitidos
- Tratamento de erros detalhado

### Logging
- Sistema de logging estruturado
- Logs separados por tipo
- Timestamps e metadados

### Testes
- Testes unitários com Vitest
- Cobertura de código
- Testes de integração da API

## 🚀 Próximos Passos

- [ ] Implementar autenticação JWT
- [ ] Adicionar paginação
- [ ] Implementar cache com Redis
- [ ] Adicionar rate limiting
- [ ] Implementar banco de dados real (PostgreSQL)
- [ ] Adicionar Docker
- [ ] Implementar CI/CD

## 📝 Licença

ISC

## 👨‍💻 Autor

Desenvolvido como parte do curso de fundamentos Node.js.
