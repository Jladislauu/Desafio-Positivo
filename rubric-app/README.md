# Rubrica de Avaliação — Desafio Técnico (inspiração: CoGrader)

Aplicação full‑stack para criação de rubricas de avaliação com dois modos de níveis (fixos e variáveis), arrastar‑e‑soltar de critérios, validações e persistência em PostgreSQL via API Node/Express + Prisma.

- Frontend: React + TypeScript + Vite + Tailwind CSS + dnd‑kit
- Backend: Node.js (Express 5) + Prisma (PostgreSQL)
- Pastas: [client/](client) e [server/](server)

## Como Rodar

Pré‑requisitos:
- Node.js 18+ e npm
- PostgreSQL em execução

1) Configurar o backend
- Crie um arquivo `.env` em [server/](server) com a variável `DATABASE_URL`:

```env
# server/.env
DATABASE_URL="postgresql://USUARIO:SENHA@HOST:PORTA/NOME_BANCO?schema=public"
```

- Instale as dependências e gere/migre o banco:

```bash
cd server
npm install
# Se necessário, instale o adaptador do Prisma para pg
npm install @prisma/adapter-pg

# Gerar cliente Prisma
npx prisma generate

# Aplicar migrações (desenvolvimento)
npx prisma migrate dev --name init
```

- Inicie a API (porta 3001):

```bash
npm run start:dev
```

2) Rodar o frontend

```bash
cd ../client
npm install
npm run dev
```

- Acesse a UI em http://localhost:5173 (porta padrão do Vite)
- A API roda em http://localhost:3001

## Funcionalidades Implementadas

- Cabeçalho e ações
  - Título: “Criar Rubrica”.
  - Botão “Resetar rubrica” (volta ao estado inicial) e “Salvar rubrica” (POST na API).
- Campo Nome
  - Campo “Nome da rubrica” com validação (não permite salvar vazio).
- Tipo de rubrica (toggle)
  - Alterna entre “Níveis fixos” e “Níveis variáveis”, preservando dados conforme regra de transição.
- Níveis fixos (Fixed levels)
  - Conjunto global de níveis, com rótulo e pontuação editáveis no cabeçalho.
  - Adicionar/remover nível global afeta toda a grade e respeita a regra “não remover o último nível”.
  - Todos os critérios compartilham as mesmas colunas (rótulo + pontos). As descrições são por célula/critério.
- Níveis variáveis (Variable levels)
  - Cada critério tem sua própria lista de níveis (pontos e descrições). Rótulo é opcional/inexistente.
  - Adicionar/remover nível por critério (com validação para não remover o último). Não afeta outros critérios.
- Tabela estilo “grade”
  - Coluna “Critério” e colunas de níveis à direita.
  - Cada célula contém campo de descrição editável com auto‑altura.
- Critérios (linhas)
  - Adicionar novo critério (+) e remover por linha (com validação para não remover o último critério).
  - Reordenar via drag‑and‑drop (handle à esquerda) usando dnd‑kit. A ordem é refletida no estado e enviada ao salvar.
- Pontuação dos níveis
  - Pontos numéricos ≥ 0; edição direta no cabeçalho (fixo) ou por coluna do critério (variável).
  - Exibição: “Rótulo (X)” no modo fixo e “X pts” no modo variável.
- Validações mínimas ao salvar
  - Nome preenchido, pelo menos 1 critério, pelo menos 1 nível (global no fixo; por critério no variável).
- Transição entre modos (regra recomendada)
  - Fixo → Variável: duplica a estrutura global para cada critério, preservando descrições quando possível.
  - Variável → Fixo: consolida níveis com base no primeiro critério, preenchendo rótulos padrão quando necessário.

## Arquitetura e Pastas

- Frontend (React)
  - Estado global: [client/src/context/RubricContext.tsx](client/src/context/RubricContext.tsx)
  - Componentes principais: 
    - [RubricHeader](client/src/components/RubricHeader.tsx): ações de reset/salvar e validações
    - [RubricNameInput](client/src/components/RubricNameInput.tsx): campo nome
    - [TypeToggle](client/src/components/TypeToggle.tsx): alternância fixo/variável com regras de transição
    - [RubricTable](client/src/components/RubricTable.tsx): grade + dnd
    - [CriterionRowFixed](client/src/components/CriterionRowFixed.tsx) e [CriterionRowVariable](client/src/components/CriterionRowVariable.tsx)
    - [LevelHeaderCell](client/src/components/LevelHeaderCell.tsx)
- Backend (Node/Express + Prisma)
  - Entrada: [server/src/index.ts](server/src/index.ts)
  - Prisma/Pool PG: [server/src/prisma.ts](server/src/prisma.ts)
  - Schema: [server/prisma/schema.prisma](server/prisma/schema.prisma)

## API

Base: http://localhost:3001

- GET `/rubrics`
  - Lista rubricas com critérios e níveis (ordenados).
- POST `/rubrics`
  - Cria rubrica completa em transação Prisma. Validação com Zod.
  - Payload (exemplo):

```json
{
  "name": "Minha Rubrica",
  "type": "fixed",
  "criteria": [
    {
      "name": "Critério 1",
      "order": 1,
      "levels": [
        { "label": "Atende expectativas", "points": 4,   "description": "Descrição" },
        { "label": "Aproxima-se das expectativas", "points": 3.4, "description": "Descrição" }
      ]
    }
  ]
}
```

Notas:
- No modo variável, `label` pode ser omitido nos níveis; `points ≥ 0`.
- A UI automaticamente envia `order` sequencial (baseado na ordem visual).
- Em caso de erro de validação, a API retorna `{ error, details }` compatível com Zod.

## Banco de Dados (Prisma + PostgreSQL)

Modelos principais em [server/prisma/schema.prisma](server/prisma/schema.prisma): `Rubric`, `Criterion`, `Level` com deleção em cascata nas relações de critério/nível.

Comandos úteis:

```bash
# Na pasta server
npx prisma generate                  # gera o cliente Prisma
npx prisma migrate dev               # aplica/gera migrações em dev
npx prisma migrate deploy            # aplica migrações em ambientes não interativos
npx prisma studio                    # opcional: abrir UI para inspecionar dados
```

Observação sobre adaptador PG: este projeto usa `@prisma/adapter-pg` para compartilhar pool do `pg`. Se não estiver instalado, rode `npm i @prisma/adapter-pg` em [server/](server).

## Scripts

- Frontend (em [client/package.json](client/package.json))
  - `dev`: inicia Vite em modo desenvolvimento
  - `build`: tsc + build Vite
  - `preview`: pré‑visualização do build
- Backend (em [server/package.json](server/package.json))
  - `start:dev`: nodemon + ts‑node (porta 3001)
  - `build`: compila TypeScript para `dist/`
  - `start`: roda `dist/index.js`

## Limitações Conhecidas

- Não há tela de edição/visualização de rubricas salvas no frontend; apenas criação e POST.
- API não implementa endpoints de update/delete; apenas create e list.
- Sem autenticação/autorização.
- Validações de UI cobrem MVP; não há todas micro‑interações do CoGrader.
- Sem deploy automatizado; foco em ambiente local.

## Como rodar

```bash
# 1) Backend
cd server
cp .env.example .env   # se existir; caso contrário, crie .env manualmente
# edite DATABASE_URL no .env
npm i && npm i @prisma/adapter-pg
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev

# 2) Frontend (novo terminal)
cd ../client
npm i
npm run dev
```

Abra o app em http://localhost:5173 e use “Salvar rubrica” para persistir na API.

## O que foi replicado do CoGrader

- Layout da criação de rubrica com cabeçalho, nome e alternância de tipo.
- Grade com níveis fixos/variáveis, edição inline de pontos/rótulos/descrições.
- Adição/remoção de níveis e critérios com as validações solicitadas.
- Reordenação de critérios via drag‑and‑drop.
- Regras de transição entre modos sem perda de dados essenciais.

## Stack e Decisões

- `dnd-kit` para DnD acessível e composável.
- `Zod` no backend para validação robusta do payload.
- `Prisma` com transação e include ordenado para retorno coerente.
- `Tailwind CSS` para produtividade no layout/estilo.

---

