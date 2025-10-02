# Correção ENEM IA

Uma aplicação web completa para correção de redações do ENEM usando inteligência artificial. Os usuários podem escrever redações, receber correções detalhadas baseadas nas 5 competências do ENEM, e acompanhar sua evolução através de estatísticas e gráficos.

## 🚀 Funcionalidades

### Principais
- ✅ **Autenticação completa** com Firebase Auth (Google + Email/Senha)
- ✅ **Geração de temas** aleatórios de redação do ENEM
- ✅ **Editor de texto** com contador de palavras em tempo real
- ✅ **Correção por algoritmo inteligente** baseado em regras do ENEM
- ✅ **Avaliação das 5 competências** do ENEM (0-200 pontos cada)
- ✅ **Feedback detalhado** por competência
- ✅ **Histórico de redações** com ranking (melhor → pior)
- ✅ **Estatísticas e gráficos** de evolução
- ✅ **Exportação para PDF** das redações corrigidas
- ✅ **Design responsivo** com tema roxo (#8E44AD)

### Recursos Extras
- ✅ Contador de palavras com alertas
- ✅ Validação de regras básicas (mínimo 200 palavras)
- ✅ Identificação de pontos fortes e fracos
- ✅ Tags automáticas para classificação
- ✅ Proteção de rotas (usuário deve estar logado)
- ✅ Interface moderna e intuitiva

## 🛠️ Tecnologias

- **Frontend**: React + Next.js + Tailwind CSS
- **Backend**: Next.js API Routes
- **Banco de dados**: Firebase Firestore
- **Autenticação**: Firebase Auth
- **Correção**: Algoritmo inteligente baseado em regras do ENEM
- **Gráficos**: Recharts
- **PDF**: jsPDF
- **Notificações**: React Hot Toast

## 📋 Pré-requisitos

1. **Node.js** (versão 16 ou superior)
2. **Conta no Firebase** (para Auth, Firestore)
3. **Conta no Vercel** (para deploy)

## 🔧 Instalação

### 1. Clone o repositório
```bash
git clone <seu-repositorio>
cd correcao-enem-ia
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo `env.example` para `.env.local`:

```bash
cp env.example .env.local
```

Preencha as variáveis no arquivo `.env.local`:

```env
# Firebase Configuration (Frontend)
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id

# Nota: A aplicação agora usa um algoritmo de correção simulado
# Não é mais necessário configurar a API do OpenAI

# Firebase Admin SDK (Backend)
FIREBASE_ADMIN_PROJECT_ID=seu-projeto-id
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nsua_private_key_aqui\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=seu_service_account@seu-projeto.iam.gserviceaccount.com
```

### 4. Configure o Firebase

1. **Crie um projeto no Firebase Console**
2. **Ative Authentication**:
   - Vá em Authentication > Sign-in method
   - Ative "Email/Password" e "Google"
3. **Configure Firestore**:
   - Vá em Firestore Database
   - Crie um banco em modo de produção
   - Configure as regras de segurança:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários podem ler/escrever apenas seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Redações: usuário pode ler/escrever apenas suas próprias
    match /redacoes/{redacaoId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.user_id;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.user_id;
    }
  }
}
```

4. **Gere a chave do Service Account**:
   - Vá em Project Settings > Service Accounts
   - Clique em "Generate new private key"
   - Baixe o arquivo JSON e copie os valores para `.env.local`

### 5. Execute o projeto

```bash
npm run dev
```

Acesse `http://localhost:3000` no seu navegador.

## 📱 Como Usar

### 1. Criar Conta
- Acesse a aplicação
- Clique em "Criar conta"
- Preencha os dados ou use login com Google

### 2. Escrever Redação
- Clique em "Gerar Tema" para receber um tema aleatório
- Escreva sua redação no editor
- O contador mostra palavras e caracteres em tempo real
- Clique em "Enviar para Correção"

### 3. Ver Resultados
- Aguarde a correção (alguns segundos)
- Veja sua nota total e por competência
- Leia o feedback detalhado
- Identifique pontos fortes e fracos

### 4. Acompanhar Evolução
- Vá em "Perfil" para ver estatísticas
- Veja gráficos de evolução por competência
- Acesse o histórico de redações
- Exporte redações em PDF

## 🚀 Deploy

### Deploy no Vercel

1. **Conecte seu repositório ao Vercel**
2. **Configure as variáveis de ambiente** no painel do Vercel
3. **Deploy automático** a cada push

```bash
# Ou usando Vercel CLI
npm i -g vercel
vercel
```

### Configuração do Firebase para Produção

1. **Atualize as regras do Firestore** para produção
2. **Configure domínios autorizados** no Firebase Auth
3. **Teste todas as funcionalidades** em produção

## 📊 Estrutura do Banco de Dados

### Coleção `users`
```javascript
{
  uid: "user_id",
  displayName: "Nome do Usuário",
  email: "usuario@email.com",
  createdAt: timestamp
}
```

### Coleção `redacoes`
```javascript
{
  user_id: "user_id",
  tema: "Tema da redação",
  texto: "Texto completo da redação",
  competencias: {
    c1: 160,  // Domínio da norma culta
    c2: 140,  // Compreensão da proposta
    c3: 180,  // Organização das informações
    c4: 120,  // Argumentação
    c5: 150   // Proposta de intervenção
  },
  total: 750,
  feedback: {
    c1: "Feedback da competência 1",
    c2: "Feedback da competência 2",
    // ...
  },
  tags: ["tag1", "tag2"],
  pontos_fortes: ["ponto forte 1"],
  pontos_fracos: ["ponto fraco 1"],
  data: timestamp,
  palavras: 450
}
```

## 🎨 Personalização

### Cores do Tema
As cores principais estão definidas em `tailwind.config.js`:
- **Primary**: #8E44AD (roxo principal)
- **Primary Dark**: #7D3C98
- **Primary Light**: #9B59B6

### Temas de Redação
Os temas estão definidos em `pages/api/gerar-tema.js`. Você pode adicionar novos temas facilmente.

### Prompt da IA
O prompt para correção está em `pages/api/corrigir.js`. Você pode personalizar para melhorar a qualidade das correções.

## 🔒 Segurança

- ✅ Autenticação obrigatória para todas as rotas protegidas
- ✅ Validação de dados no frontend e backend
- ✅ Regras de segurança do Firestore
- ✅ Variáveis de ambiente para dados sensíveis
- ✅ Validação de propriedade de redações

## 🐛 Solução de Problemas

### Erro de CORS
Se houver problemas de CORS, verifique se as URLs do Firebase estão corretas.

### Erro de Autenticação
Verifique se as chaves do Firebase estão corretas e se a autenticação está habilitada.

### Erro na API do OpenAI
Verifique se a API key está correta e se você tem créditos disponíveis.

### Erro no Firestore
Verifique as regras de segurança e se o banco está configurado corretamente.

## 📈 Melhorias Futuras

- [ ] Suporte a mais modelos de IA (Claude, Gemini)
- [ ] Correção de redações em lote
- [ ] Sistema de comparação entre redações
- [ ] Gamificação (badges, conquistas)
- [ ] Modo offline com sincronização
- [ ] Suporte a múltiplos idiomas
- [ ] API pública para integração
- [ ] Dashboard administrativo

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique a seção de solução de problemas
2. Abra uma issue no GitHub
3. Entre em contato através do email: [seu-email@exemplo.com]

---

**Desenvolvido com ❤️ para ajudar estudantes a melhorar suas redações do ENEM!**

