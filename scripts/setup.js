#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  console.log('🚀 Configuração da Aplicação Correção ENEM IA\n');
  
  try {
    // Verificar se .env.local já existe
    const envPath = path.join(__dirname, '..', '.env.local');
    if (fs.existsSync(envPath)) {
      const overwrite = await question('⚠️  O arquivo .env.local já existe. Deseja sobrescrever? (y/N): ');
      if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
        console.log('❌ Configuração cancelada.');
        rl.close();
        return;
      }
    }

    console.log('📝 Vamos configurar as variáveis de ambiente...\n');

    // Firebase Configuration
    console.log('🔧 Configuração do Firebase:');
    const firebaseApiKey = await question('NEXT_PUBLIC_FIREBASE_API_KEY: ');
    const firebaseAuthDomain = await question('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ');
    const firebaseProjectId = await question('NEXT_PUBLIC_FIREBASE_PROJECT_ID: ');
    const firebaseStorageBucket = await question('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ');
    const firebaseMessagingSenderId = await question('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ');
    const firebaseAppId = await question('NEXT_PUBLIC_FIREBASE_APP_ID: ');

    console.log('\n🤖 Configuração da OpenAI:');
    const openaiApiKey = await question('OPENAI_API_KEY: ');

    console.log('\n🔐 Configuração do Firebase Admin:');
    const firebaseAdminProjectId = await question('FIREBASE_ADMIN_PROJECT_ID: ');
    const firebaseAdminPrivateKey = await question('FIREBASE_ADMIN_PRIVATE_KEY (completa com \\n): ');
    const firebaseAdminClientEmail = await question('FIREBASE_ADMIN_CLIENT_EMAIL: ');

    // Criar arquivo .env.local
    const envContent = `# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=${firebaseApiKey}
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${firebaseAuthDomain}
NEXT_PUBLIC_FIREBASE_PROJECT_ID=${firebaseProjectId}
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${firebaseStorageBucket}
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${firebaseMessagingSenderId}
NEXT_PUBLIC_FIREBASE_APP_ID=${firebaseAppId}

# OpenAI API Key
OPENAI_API_KEY=${openaiApiKey}

# Firebase Admin SDK
FIREBASE_ADMIN_PROJECT_ID=${firebaseAdminProjectId}
FIREBASE_ADMIN_PRIVATE_KEY="${firebaseAdminPrivateKey}"
FIREBASE_ADMIN_CLIENT_EMAIL=${firebaseAdminClientEmail}
`;

    fs.writeFileSync(envPath, envContent);

    console.log('\n✅ Arquivo .env.local criado com sucesso!');
    console.log('\n📋 Próximos passos:');
    console.log('1. Execute: npm install');
    console.log('2. Execute: npm run dev');
    console.log('3. Acesse: http://localhost:3000');
    console.log('\n📖 Consulte o README.md para instruções detalhadas de configuração do Firebase.');

  } catch (error) {
    console.error('❌ Erro durante a configuração:', error.message);
  } finally {
    rl.close();
  }
}

setup();





