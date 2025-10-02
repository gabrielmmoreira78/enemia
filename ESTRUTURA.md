# 📁 Estrutura do Projeto - Correção ENEM IA

## 🏗️ Organização Geral

```
correcao-enem-ia/
├── 📁 components/           # Componentes reutilizáveis
├── 📁 contexts/            # Contextos React (Auth)
├── 📁 lib/                 # Configurações e utilitários
├── 📁 pages/               # Páginas e APIs
├── 📁 scripts/             # Scripts de configuração
├── 📁 styles/              # Estilos globais
├── 📄 Configurações        # Arquivos de configuração
└── 📄 Documentação         # README, DEPLOY, etc.
```

## 📂 Detalhamento por Pasta

### `/components/` - Componentes React
- **`Layout.js`** - Layout principal com sidebar e navegação
- **`EditorRedacao.js`** - Editor de texto com contador de palavras
- **`CardCompetencia.js`** - Card para exibir competências do ENEM
- **`PainelHistorico.js`** - Painel lateral com histórico de redações
- **`GraficoEvolucao.js`** - Gráficos de evolução por competência

### `/contexts/` - Contextos React
- **`AuthContext.js`** - Contexto de autenticação com Firebase

### `/lib/` - Configurações e Utilitários
- **`firebase.js`** - Configuração do Firebase (cliente)
- **`firebase-admin.js`** - Configuração do Firebase Admin (servidor)

### `/pages/` - Páginas e APIs

#### Páginas da Aplicação
- **`_app.js`** - Componente raiz da aplicação
- **`index.js`** - Dashboard principal
- **`login.js`** - Página de login
- **`register.js`** - Página de registro
- **`perfil.js`** - Página de perfil e estatísticas
- **`redacao/[id].js`** - Visualização de redação específica

#### APIs (Backend)
- **`api/corrigir.js`** - Endpoint para correção de redações com IA
- **`api/gerar-tema.js`** - Endpoint para gerar temas aleatórios

### `/scripts/` - Scripts de Configuração
- **`setup.js`** - Script interativo para configuração das variáveis de ambiente

### `/styles/` - Estilos
- **`globals.css`** - Estilos globais com Tailwind CSS

## 🔧 Arquivos de Configuração

### Core do Next.js
- **`next.config.js`** - Configuração do Next.js
- **`package.json`** - Dependências e scripts
- **`tsconfig.json`** - Configuração do TypeScript

### Styling
- **`tailwind.config.js`** - Configuração do Tailwind CSS
- **`postcss.config.js`** - Configuração do PostCSS

### Linting e Qualidade
- **`.eslintrc.json`** - Configuração do ESLint

### Firebase
- **`firebase.json`** - Configuração do Firebase
- **`firestore.rules`** - Regras de segurança do Firestore
- **`firestore.indexes.json`** - Índices do Firestore

### Deploy
- **`vercel.json`** - Configuração do Vercel
- **`.gitignore`** - Arquivos ignorados pelo Git

## 📚 Documentação

- **`README.md`** - Documentação principal do projeto
- **`DEPLOY.md`** - Guia completo de deploy
- **`ESTRUTURA.md`** - Este arquivo (estrutura do projeto)
- **`env.example`** - Exemplo de variáveis de ambiente

## 🎯 Funcionalidades por Arquivo

### Autenticação
- **Login/Registro**: `pages/login.js`, `pages/register.js`
- **Contexto**: `contexts/AuthContext.js`
- **Configuração**: `lib/firebase.js`

### Dashboard Principal
- **Página**: `pages/index.js`
- **Editor**: `components/EditorRedacao.js`
- **Layout**: `components/Layout.js`

### Correção de Redações
- **API**: `pages/api/corrigir.js`
- **Geração de temas**: `pages/api/gerar-tema.js`
- **Visualização**: `pages/redacao/[id].js`

### Análise e Estatísticas
- **Perfil**: `pages/perfil.js`
- **Histórico**: `components/PainelHistorico.js`
- **Gráficos**: `components/GraficoEvolucao.js`
- **Cards**: `components/CardCompetencia.js`

### Estilização
- **Tema**: `tailwind.config.js`
- **Estilos**: `styles/globals.css`
- **Cores**: Branco + Roxo (#8E44AD)

## 🗄️ Estrutura do Banco de Dados

### Coleção `users`
```javascript
{
  uid: string,
  displayName: string,
  email: string,
  createdAt: timestamp
}
```

### Coleção `redacoes`
```javascript
{
  id: string,
  user_id: string,
  tema: string,
  texto: string,
  competencias: {
    c1: number,  // 0-200
    c2: number,  // 0-200
    c3: number,  // 0-200
    c4: number,  // 0-200
    c5: number   // 0-200
  },
  total: number,      // 0-1000
  feedback: object,   // Feedback por competência
  tags: array,        // Tags automáticas
  pontos_fortes: array,
  pontos_fracos: array,
  data: timestamp,
  palavras: number
}
```

## 🔄 Fluxo de Dados

1. **Usuário faz login** → `AuthContext` gerencia estado
2. **Usuário gera tema** → API `/api/gerar-tema`
3. **Usuário escreve redação** → `EditorRedacao` component
4. **Usuário envia para correção** → API `/api/corrigir`
5. **IA corrige redação** → OpenAI GPT-3.5-turbo
6. **Resultado salvo** → Firestore database
7. **Usuário vê resultado** → `CardCompetencia` components
8. **Histórico atualizado** → `PainelHistorico` component
9. **Estatísticas atualizadas** → `GraficoEvolucao` component

## 🚀 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar em produção
npm start

# Linting
npm run lint

# Configuração inicial
npm run setup

# Deploy no Vercel
vercel

# Deploy no Firebase
firebase deploy
```

## 📊 Métricas do Projeto

- **Total de arquivos**: 29
- **Componentes React**: 5
- **Páginas**: 6
- **APIs**: 2
- **Linhas de código**: ~2.500+
- **Dependências**: 15 principais

## 🎨 Design System

### Cores
- **Primary**: #8E44AD (Roxo)
- **Primary Dark**: #7D3C98
- **Primary Light**: #9B59B6
- **Background**: #F8F9FA
- **Text**: #1F2937

### Componentes
- **Botões**: `btn-primary`, `btn-secondary`
- **Inputs**: `input-field`
- **Cards**: `card`
- **Cores**: `text-primary`, `bg-primary`

## 🔐 Segurança

- ✅ Autenticação obrigatória
- ✅ Validação de dados
- ✅ Regras do Firestore
- ✅ Variáveis de ambiente
- ✅ CORS configurado

## 📈 Performance

- ✅ SSR com Next.js
- ✅ Lazy loading de componentes
- ✅ Otimização de imagens
- ✅ Cache de API responses
- ✅ Bundle splitting automático

---

**Estrutura organizada e escalável para uma aplicação completa de correção de redações do ENEM!** 🎓✨





