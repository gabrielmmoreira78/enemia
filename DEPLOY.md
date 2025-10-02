# Guia de Deploy - Correção ENEM IA

Este guia te ajudará a fazer o deploy da aplicação em diferentes plataformas.

## 🚀 Deploy no Vercel (Recomendado)

### 1. Preparação

1. **Faça push do código para o GitHub**
2. **Configure as variáveis de ambiente** no Vercel

### 2. Deploy via Vercel Dashboard

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "New Project"
3. Conecte seu repositório GitHub
4. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `OPENAI_API_KEY`
   - `FIREBASE_ADMIN_PROJECT_ID`
   - `FIREBASE_ADMIN_PRIVATE_KEY`
   - `FIREBASE_ADMIN_CLIENT_EMAIL`

5. Clique em "Deploy"

### 3. Deploy via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel

# Deploy de produção
vercel --prod
```

## 🔥 Deploy no Firebase Hosting

### 1. Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Login e Configuração

```bash
# Login
firebase login

# Inicializar projeto
firebase init

# Selecionar:
# - Hosting
# - Firestore
# - Functions (opcional)
```

### 3. Build e Deploy

```bash
# Build da aplicação
npm run build

# Deploy
firebase deploy
```

## 🌐 Deploy no Netlify

### 1. Preparação

1. Faça build da aplicação: `npm run build`
2. Faça push para o GitHub

### 2. Deploy

1. Acesse [netlify.com](https://netlify.com)
2. Conecte seu repositório
3. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `out`
4. Adicione as variáveis de ambiente
5. Deploy

## 🐳 Deploy com Docker

### 1. Criar Dockerfile

```dockerfile
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

### 2. Build e Run

```bash
# Build da imagem
docker build -t correcao-enem-ia .

# Executar container
docker run -p 3000:3000 --env-file .env.local correcao-enem-ia
```

## ☁️ Deploy na AWS

### 1. AWS Amplify

1. Acesse [AWS Amplify Console](https://console.aws.amazon.com/amplify)
2. Conecte seu repositório
3. Configure build settings:
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: out
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```
4. Configure as variáveis de ambiente
5. Deploy

### 2. AWS EC2

1. **Criar instância EC2** (Ubuntu 20.04)
2. **Conectar via SSH**
3. **Instalar dependências**:

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2
sudo npm install -g pm2

# Instalar Nginx
sudo apt install nginx -y
```

4. **Configurar aplicação**:

```bash
# Clone do repositório
git clone <seu-repositorio>
cd correcao-enem-ia

# Instalar dependências
npm install

# Configurar variáveis de ambiente
nano .env.local

# Build
npm run build

# Iniciar com PM2
pm2 start npm --name "correcao-enem-ia" -- start
pm2 save
pm2 startup
```

5. **Configurar Nginx**:

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔧 Configurações Pós-Deploy

### 1. Firebase

1. **Configurar domínios autorizados**:
   - Vá em Authentication > Settings > Authorized domains
   - Adicione seu domínio de produção

2. **Atualizar regras do Firestore**:
```bash
firebase deploy --only firestore:rules
```

### 2. OpenAI

1. **Verificar limites da API**
2. **Configurar webhook** (se necessário)
3. **Monitorar uso** no dashboard

### 3. Monitoramento

1. **Configurar logs** (Vercel, CloudWatch, etc.)
2. **Monitorar performance**
3. **Configurar alertas** de erro

## 📊 Verificação Pós-Deploy

### Checklist

- [ ] ✅ Aplicação carrega corretamente
- [ ] ✅ Autenticação funciona (Google + Email)
- [ ] ✅ Geração de temas funciona
- [ ] ✅ Editor de texto funciona
- [ ] ✅ Correção por IA funciona
- [ ] ✅ Histórico de redações funciona
- [ ] ✅ Exportação PDF funciona
- [ ] ✅ Gráficos de evolução funcionam
- [ ] ✅ Responsividade funciona
- [ ] ✅ Performance está adequada

### Testes

1. **Teste completo do fluxo**:
   - Criar conta
   - Gerar tema
   - Escrever redação
   - Enviar para correção
   - Ver resultados
   - Exportar PDF

2. **Teste de diferentes dispositivos**:
   - Desktop
   - Tablet
   - Mobile

3. **Teste de performance**:
   - Tempo de carregamento
   - Tempo de correção
   - Responsividade da interface

## 🚨 Troubleshooting

### Problemas Comuns

1. **Erro 500 na correção**:
   - Verificar API key do OpenAI
   - Verificar limites de uso
   - Verificar logs do servidor

2. **Erro de autenticação**:
   - Verificar configuração do Firebase
   - Verificar domínios autorizados
   - Verificar regras do Firestore

3. **Erro de build**:
   - Verificar versão do Node.js
   - Verificar dependências
   - Verificar variáveis de ambiente

### Logs

```bash
# Vercel
vercel logs

# Firebase
firebase functions:log

# PM2
pm2 logs correcao-enem-ia
```

## 📈 Otimizações

### Performance

1. **Cache**:
   - Implementar cache no Redis
   - Cache de respostas da API

2. **CDN**:
   - Configurar CDN para assets estáticos
   - Otimizar imagens

3. **Database**:
   - Indexar campos frequentemente consultados
   - Otimizar queries

### Escalabilidade

1. **Load Balancer**
2. **Auto Scaling**
3. **Database Sharding**
4. **Microservices**

---

**Dica**: Sempre teste em ambiente de staging antes do deploy em produção!





