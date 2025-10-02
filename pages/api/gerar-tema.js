// Temas de redação do ENEM
const temasRedacao = [
  "Os desafios para a valorização do professor no Brasil",
  "A persistência da violência contra a mulher na sociedade brasileira", 
  "Caminhos para combater o racismo no Brasil",
  "Desafios para a formação educacional de surdos no Brasil",
  "A manipulação do comportamento do usuário pelo controle de dados na internet",
  "Desafios para a democratização do acesso ao cinema no Brasil",
  "O estigma associado às doenças mentais na sociedade brasileira",
  "O combate ao uso indiscriminado das tecnologias digitais de informação por crianças",
  "Desafios para a redução das desigualdades entre as regiões do Brasil",
  "A importância da vacinação para a saúde pública no Brasil",
  "A democratização do acesso ao livro no Brasil",
  "Os desafios para a educação inclusiva no Brasil",
  "A intolerância religiosa no Brasil",
  "Desafios para a sustentabilidade urbana no Brasil",
  "O combate ao trabalho infantil no Brasil",
  "A questão da mobilidade urbana no Brasil",
  "Os desafios para a preservação do patrimônio cultural brasileiro",
  "A violência no trânsito brasileiro",
  "Desafios para a educação a distância no Brasil",
  "O combate à corrupção no Brasil"
];

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Gerar tema aleatório
    const temaAleatorio = temasRedacao[Math.floor(Math.random() * temasRedacao.length)];
    
    res.status(200).json({
      success: true,
      tema: temaAleatorio,
      temas_disponiveis: temasRedacao
    });

  } catch (error) {
    console.error('Erro ao gerar tema:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
}





