# API de Usuários - Documentação

## Visão Geral

Esta é uma API REST para gerenciamento de usuários, construída com Node.js puro. A API oferece operações CRUD completas para usuários com validação robusta de dados e sistema de logging detalhado.

## Base URL

```
http://localhost:3333
```

## Endpoints

### 1. Listar Todos os Usuários

**GET** `/user`

Retorna uma lista de todos os usuários cadastrados.

#### Resposta de Sucesso (200)
```json
[
  {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": 2,
    "name": "Maria Santos",
    "email": "maria@email.com",
    "createdAt": "2024-01-15T11:00:00.000Z"
  }
]
```

---

### 2. Buscar Usuário por ID

**GET** `/user/:id`

Retorna um usuário específico pelo seu ID.

#### Parâmetros
- `id` (number): ID do usuário

#### Resposta de Sucesso (200)
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@email.com",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

#### Resposta de Erro (404)
```json
{
  "error": "Usuário não encontrado"
}
```

#### Resposta de Erro (400)
```json
{
  "error": "ID inválido"
}
```

---

### 3. Criar Novo Usuário

**POST** `/user`

Cria um novo usuário no sistema.

#### Corpo da Requisição
```json
{
  "name": "João Silva",
  "email": "joao@email.com"
}
```

#### Validações
- **name**: Obrigatório, mínimo 2 caracteres, máximo 100 caracteres, apenas letras, espaços e caracteres especiais permitidos
- **email**: Obrigatório, formato de email válido, máximo 254 caracteres

#### Resposta de Sucesso (201)
```json
{
  "message": "Usuário criado com sucesso",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Resposta de Erro (400)
```json
{
  "error": "Dados inválidos",
  "details": [
    "Nome é obrigatório",
    "Formato de email inválido"
  ]
}
```

---

### 4. Atualizar Usuário

**PUT** `/user/:id`

Atualiza os dados de um usuário existente.

#### Parâmetros
- `id` (number): ID do usuário

#### Corpo da Requisição
```json
{
  "name": "João Santos",
  "email": "joao.santos@email.com"
}
```

#### Resposta de Sucesso (200)
```json
{
  "message": "Usuário atualizado com sucesso",
  "user": {
    "id": 1,
    "name": "João Santos",
    "email": "joao.santos@email.com",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
}
```

#### Resposta de Erro (404)
```json
{
  "error": "Usuário não encontrado"
}
```

#### Resposta de Erro (400)
```json
{
  "error": "Dados inválidos",
  "details": [
    "Nome deve ter pelo menos 2 caracteres"
  ]
}
```

---

### 5. Deletar Usuário

**DELETE** `/user/:id`

Remove um usuário do sistema.

#### Parâmetros
- `id` (number): ID do usuário

#### Resposta de Sucesso (200)
```json
{
  "message": "Usuário deletado com sucesso"
}
```

#### Resposta de Erro (404)
```json
{
  "error": "Usuário não encontrado"
}
```

#### Resposta de Erro (400)
```json
{
  "error": "ID inválido"
}
```

---

## Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 201 | Criado com sucesso |
| 400 | Dados inválidos |
| 404 | Recurso não encontrado |
| 500 | Erro interno do servidor |

## Validações

### Nome
- **Obrigatório**: Sim
- **Tamanho mínimo**: 2 caracteres
- **Tamanho máximo**: 100 caracteres
- **Caracteres permitidos**: Letras, espaços, hífens, apóstrofos
- **Exemplos válidos**: "João Silva", "Maria José", "Ana-Clara"

### Email
- **Obrigatório**: Sim
- **Formato**: Deve seguir o padrão RFC 5322
- **Tamanho máximo**: 254 caracteres
- **Exemplos válidos**: "user@domain.com", "user.name@domain.co.uk"
- **Exemplos inválidos**: "email-invalido", "@domain.com", "user@"

## Logs

A API gera logs detalhados em arquivos na pasta `logs/`:

- `app.log`: Logs gerais da aplicação
- `error.log`: Logs de erro
- `api.log`: Logs específicos de requisições da API
- `debug.log`: Logs de debug

## Persistência de Dados

Os dados são persistidos automaticamente em um arquivo JSON (`database.json`) na raiz do projeto. O arquivo é atualizado a cada operação de escrita.

## Exemplos de Uso

### Criar um usuário
```bash
curl -X POST http://localhost:3333/user \
  -H "Content-Type: application/json" \
  -d '{"name": "João Silva", "email": "joao@email.com"}'
```

### Listar todos os usuários
```bash
curl http://localhost:3333/user
```

### Buscar usuário por ID
```bash
curl http://localhost:3333/user/1
```

### Atualizar usuário
```bash
curl -X PUT http://localhost:3333/user/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "João Santos", "email": "joao.santos@email.com"}'
```

### Deletar usuário
```bash
curl -X DELETE http://localhost:3333/user/1
```

## Tratamento de Erros

A API retorna erros em formato JSON com informações detalhadas:

```json
{
  "error": "Descrição do erro",
  "details": ["Lista de erros específicos"]
}
```

## Limitações

- Os IDs são gerados sequencialmente baseados no número de usuários
- Não há autenticação/autorização implementada
- Os dados são armazenados em arquivo JSON (não recomendado para produção)
- Não há paginação para listagem de usuários
