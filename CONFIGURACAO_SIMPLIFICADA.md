# 🚀 Configuração Simplificada - Correção ENEM IA

## ✅ **Ótimas Notícias!**

A aplicação agora usa um **algoritmo de correção inteligente** baseado nas regras do ENEM, eliminando a necessidade de:
- ❌ API Key do OpenAI
- ❌ Créditos de IA
- ❌ Custos mensais

## 🔧 **Configuração Rápida**

### **Passo 1: Configurar Firebase**

1. **Acesse**: [https://console.firebase.google.com](https://console.firebase.google.com)
2. **Crie um projeto**: `correcao-enem-ia`
3. **Ative Authentication**:
   - Email/Senha ✅
   - Google ✅
4. **Configure Firestore Database**:
   - Modo de teste
   - Localização: `us-central1`

### **Passo 2: Obter Chaves do Firebase**

1. **Configurações do projeto** → **Geral**
2. **Seus apps** → **Web** (`</>`)
3. **Nome**: `correcao-enem-ia-web`
4. **Copie as chaves** que aparecem

### **Passo 3: Gerar Service Account**

1. **Configurações** → **Contas de serviço**
2. **Gerar nova chave privada**
3. **Baixe o JSON** e copie:
   - `project_id`
   - `private_key`
   - `client_email`

### **Passo 4: Configurar Variáveis**

```bash
# Copiar arquivo de exemplo
cp env.example .env.local

# Editar o arquivo
nano .env.local
```

**Preencha apenas estas variáveis**:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id

FIREBASE_ADMIN_PROJECT_ID=seu-projeto-id
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nsua_private_key_aqui\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=seu_service_account@seu-projeto.iam.gserviceaccount.com
```

### **Passo 5: Executar a Aplicação**

```bash
# Instalar dependências (já feito)
npm install

# Executar em desenvolvimento
npm run dev

# Acessar
http://localhost:3000
```

## 🎯 **Como Funciona a Correção**

O algoritmo analisa:

### **Competência 1 - Norma Culta**
- ✅ Erros gramaticais
- ✅ Diversidade lexical
- ✅ Tamanho da redação

### **Competência 2 - Compreensão**
- ✅ Presença de tese
- ✅ Número de parágrafos
- ✅ Desenvolvimento do tema

### **Competência 3 - Organização**
- ✅ Estrutura textual
- ✅ Conectivos utilizados
- ✅ Conclusão presente

### **Competência 4 - Argumentação**
- ✅ Palavras argumentativas
- ✅ Mecanismos linguísticos
- ✅ Coesão textual

### **Competência 5 - Intervenção**
- ✅ Proposta de solução
- ✅ Detalhamento da intervenção
- ✅ Viabilidade da proposta

## 📊 **Exemplo de Correção**

**Entrada**: Redação de 350 palavras sobre "Violência contra a mulher"

**Análise**:
- ✅ Tese presente
- ✅ 4 parágrafos
- ✅ Conectivos utilizados
- ✅ Proposta de intervenção
- ✅ Poucos erros gramaticais

**Resultado**:
- C1: 160/200 (boa gramática)
- C2: 150/200 (tema bem desenvolvido)
- C3: 170/200 (boa organização)
- C4: 140/200 (argumentação adequada)
- C5: 155/200 (proposta clara)
- **Total: 775/1000**

## 🚀 **Deploy Rápido**

### **Vercel (Recomendado)**
1. **Push para GitHub**
2. **Conectar ao Vercel**
3. **Adicionar variáveis de ambiente**
4. **Deploy automático**

### **Firebase Hosting**
```bash
npm run build
firebase deploy
```

## 💡 **Vantagens da Versão Simplificada**

- ✅ **Zero custos** de IA
- ✅ **Correção instantânea**
- ✅ **Feedback personalizado**
- ✅ **Baseado em regras do ENEM**
- ✅ **Funciona offline**
- ✅ **Escalável**

## 🔧 **Personalização**

Você pode ajustar o algoritmo em `pages/api/corrigir.js`:

- **Pesos das competências**
- **Critérios de avaliação**
- **Feedback personalizado**
- **Detecção de erros**

## 📈 **Melhorias Futuras**

- [ ] Machine Learning local
- [ ] Mais critérios de avaliação
- [ ] Feedback mais detalhado
- [ ] Comparação com redações modelo

---

**🎉 Aplicação pronta para uso sem custos de IA!**




