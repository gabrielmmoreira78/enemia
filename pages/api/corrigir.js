// Correção simulada: sem dependência de Firebase Admin aqui
const { avaliarRedacao } = require('../../lib/avaliador');

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
  "A importância da vacinação para a saúde pública no Brasil"
];

// Função para validar regras básicas da redação
function validarRegrasBasicas(texto) {
  const palavras = texto.trim().split(/\s+/).length;
  const temTese = texto.toLowerCase().includes('tese') || 
                  texto.toLowerCase().includes('argumento') ||
                  texto.toLowerCase().includes('defendo') ||
                  texto.toLowerCase().includes('acredito');
  const temProposta = texto.toLowerCase().includes('proposta') || 
                      texto.toLowerCase().includes('intervenção') || 
                      texto.toLowerCase().includes('solução') ||
                      texto.toLowerCase().includes('deve') ||
                      texto.toLowerCase().includes('necessário');
  const temConclusao = texto.toLowerCase().includes('conclusão') || 
                       texto.toLowerCase().includes('portanto') || 
                       texto.toLowerCase().includes('assim') ||
                       texto.toLowerCase().includes('finalmente') ||
                       texto.toLowerCase().includes('em suma');
  
  return {
    palavras,
    temTese,
    temProposta,
    temConclusao,
    valida: palavras >= 200 && temTese && temProposta && temConclusao
  };
}

// Função para correção simulada baseada em regras do ENEM
function corrigirComAlgoritmo(texto, tema) {
  const validacao = validarRegrasBasicas(texto);
  
  // Usar o novo módulo avaliador
  const avaliacao = avaliarRedacao(texto, tema);
  
  // Gerar feedback personalizado baseado na avaliação
  const feedback = gerarFeedback(avaliacao.competencias, { relevanciaTema: avaliacao.tema === "ok" ? 1 : 0 });
  
  // Identificação de pontos fortes e fracos
  const pontosFortes = identificarPontosFortes(avaliacao.competencias);
  const pontosFracos = identificarPontosFracos(avaliacao.competencias);
  
  // Geração de tags baseada na avaliação
  const tags = gerarTagsSimples(texto, avaliacao.competencias, avaliacao.tema);
  
  return {
    competencias: avaliacao.competencias,
    total: avaliacao.nota_total,
    feedback,
    tags,
    pontos_fortes: pontosFortes,
    pontos_fracos: pontosFracos
  };
}

// Função para análise detalhada do texto
function analisarTexto(texto, tema) {
  const palavras = texto.toLowerCase().split(/\s+/);
  const frases = texto.split(/[.!?]+/).filter(f => f.trim().length > 0);
  const paragrafos = texto.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  
  // Relevância com o tema (palavras-chave simples, sem IA)
  const stopwords = new Set([
    'a','o','os','as','de','da','do','das','dos','e','em','no','na','nos','nas','um','uma','uns','umas',
    'para','por','com','contra','sobre','que','se','ao','à','às','aos','ou','não','nao','é','ser','dos','das'
  ]);
  const temaTokens = String(tema || '')
    .toLowerCase()
    .replace(/[^a-zà-ú0-9\s]/gi, ' ')
    .split(/\s+/)
    .filter(t => t.length >= 3 && !stopwords.has(t));
  const temaKeywords = Array.from(new Set(temaTokens));
  const textoTokens = palavras.map(t => t.replace(/[^a-zà-ú0-9]/gi,''));
  const textoSet = new Set(textoTokens);
  const matches = temaKeywords.filter(k => textoSet.has(k));
  const relevanciaTema = temaKeywords.length > 0 ? matches.length / temaKeywords.length : 1;
  
  // Análise de vocabulário
  const palavrasUnicas = new Set(palavras);
  const diversidadeLexical = palavrasUnicas.size / palavras.length;
  
  // Análise de conectivos
  const conectivos = [
    'portanto', 'assim', 'dessa forma', 'desse modo', 'por isso', 'consequentemente',
    'além disso', 'ademais', 'outrossim', 'também', 'igualmente', 'similarmente',
    'por outro lado', 'entretanto', 'contudo', 'todavia', 'no entanto', 'mas',
    'primeiro', 'segundo', 'terceiro', 'inicialmente', 'posteriormente', 'finalmente',
    'em primeiro lugar', 'em segundo lugar', 'por fim', 'em suma', 'em conclusão'
  ];
  
  const conectivosEncontrados = conectivos.filter(conectivo => 
    texto.toLowerCase().includes(conectivo)
  ).length;
  
  // Análise de argumentação
  const palavrasArgumentativas = [
    'porque', 'pois', 'devido a', 'em virtude de', 'já que', 'uma vez que',
    'conforme', 'segundo', 'de acordo com', 'conforme', 'como', 'assim como'
  ];
  
  const argumentacaoEncontrada = palavrasArgumentativas.filter(palavra => 
    texto.toLowerCase().includes(palavra)
  ).length;
  
  // Análise de proposta de intervenção
  const palavrasIntervencao = [
    'deve', 'necessário', 'importante', 'fundamental', 'essencial', 'preciso',
    'governo', 'sociedade', 'família', 'escola', 'mídia', 'leis', 'políticas',
    'criar', 'implementar', 'desenvolver', 'estabelecer', 'promover', 'incentivar'
  ];
  
  const intervencaoEncontrada = palavrasIntervencao.filter(palavra => 
    texto.toLowerCase().includes(palavra)
  ).length;
  
  // Análise de erros comuns
  const errosGramaticais = detectarErrosGramaticais(texto);
  
  return {
    palavras: palavras.length,
    frases: frases.length,
    paragrafos: paragrafos.length,
    diversidadeLexical,
    relevanciaTema,
    conectivosEncontrados,
    argumentacaoEncontrada,
    intervencaoEncontrada,
    errosGramaticais,
    temTese: validarRegrasBasicas(texto).temTese,
    temProposta: validarRegrasBasicas(texto).temProposta,
    temConclusao: validarRegrasBasicas(texto).temConclusao
  };
}

// Função para calcular notas baseadas na análise
function calcularNotas(analise, validacao) {
  // Competência 1 - Domínio da norma culta
  const c1 = Math.max(0, Math.min(200, 
    200 - (analise.errosGramaticais * 20) + 
    (analise.diversidadeLexical * 50) +
    (validacao.palavras >= 200 ? 30 : 0)
  ));
  
  // Competência 2 - Compreensão da proposta
  const c2 = Math.max(0, Math.min(200,
    60 + (analise.temTese ? 40 : 0) +
    (analise.paragrafos >= 3 ? 20 : 0) +
    (analise.palavras >= 300 ? 10 : 0) +
    Math.round((analise.relevanciaTema || 0) * 70)
  ));
  
  // Competência 3 - Organização das informações
  const c3 = Math.max(0, Math.min(200,
    80 + (analise.paragrafos >= 4 ? 40 : 0) +
    (analise.conectivosEncontrados * 15) +
    (analise.temConclusao ? 30 : 0) +
    (analise.diversidadeLexical * 30)
  ));
  
  // Competência 4 - Argumentação
  const c4 = Math.max(0, Math.min(200,
    70 + (analise.argumentacaoEncontrada * 20) +
    (analise.conectivosEncontrados * 10) +
    (analise.palavras >= 400 ? 30 : 0) +
    (analise.diversidadeLexical * 40)
  ));
  
  // Competência 5 - Proposta de intervenção
  const c5 = Math.max(0, Math.min(200,
    60 + (analise.temProposta ? 60 : 0) +
    (analise.intervencaoEncontrada * 15) +
    (analise.palavras >= 350 ? 30 : 0) +
    (analise.temConclusao ? 40 : 0)
  ));
  
  const notas = {
    c1: Math.round(c1),
    c2: Math.round(c2),
    c3: Math.round(c3),
    c4: Math.round(c4),
    c5: Math.round(c5)
  };
  // Penalização global por fuga ao tema
  const fator = analise.relevanciaTema < 0.2 ? 0.6 : (analise.relevanciaTema < 0.4 ? 0.85 : 1);
  if (fator < 1) {
    Object.keys(notas).forEach(k => { notas[k] = Math.max(0, Math.round(notas[k] * fator)); });
  }
  return notas;
}

// Função para detectar erros gramaticais comuns
function detectarErrosGramaticais(texto) {
  let erros = 0;
  const textoLower = texto.toLowerCase();
  
  // Erros comuns de concordância
  if (textoLower.includes('a gente vamos')) erros++;
  if (textoLower.includes('os aluno')) erros++;
  if (textoLower.includes('as menino')) erros++;
  
  // Erros de ortografia básicos
  if (textoLower.includes('naum')) erros++;
  if (textoLower.includes('vc')) erros++;
  if (textoLower.includes('pq')) erros++;
  if (textoLower.includes('tbm')) erros++;
  
  // Erros de acentuação
  if (texto.includes('nao')) erros++;
  if (texto.includes('voce')) erros++;
  if (texto.includes('governo')) erros++;
  
  // Erros de pontuação
  const frases = texto.split(/[.!?]/);
  frases.forEach(frase => {
    if (frase.trim().length > 0 && !frase.match(/[.!?]$/)) {
      erros++;
    }
  });
  
  return Math.min(erros, 10); // Máximo 10 erros para não zerar a nota
}

// Função para gerar feedback personalizado
function gerarFeedback(competencias, analise) {
  const feedback = {};
  
  // Feedback C1
  if (competencias.c1 >= 160) {
    feedback.c1 = "Excelente domínio da norma culta. Poucos ou nenhum erro gramatical encontrado.";
  } else if (competencias.c1 >= 120) {
    feedback.c1 = "Bom domínio da norma culta. Alguns erros pontuais que podem ser corrigidos.";
  } else {
    feedback.c1 = "Necessita melhorar o domínio da norma culta. Vários erros gramaticais e ortográficos encontrados.";
  }
  
  // Feedback C2
  if (competencias.c2 >= 160) {
    feedback.c2 = "Excelente compreensão da proposta. Tema bem desenvolvido e aprofundado.";
  } else if (competencias.c2 >= 120) {
    feedback.c2 = "Boa compreensão da proposta. Tema abordado adequadamente, mas pode ser mais aprofundado.";
  } else if (competencias.c2 >= 100) {
    feedback.c2 = "Compreensão básica da proposta. Tema abordado superficialmente, necessita mais desenvolvimento.";
  } else {
    feedback.c2 = "Fuga total ao tema proposto. A redação não abordou o assunto principal.";
  }
  
  // Feedback C3
  if (competencias.c3 >= 160) {
    feedback.c3 = "Excelente organização textual. Informações bem selecionadas e relacionadas.";
  } else if (competencias.c3 >= 120) {
    feedback.c3 = "Boa organização textual. Informações adequadas, mas podem ser melhor relacionadas.";
  } else {
    feedback.c3 = "Organização textual básica. Informações pouco relacionadas e selecionadas.";
  }
  
  // Feedback C4
  if (competencias.c4 >= 160) {
    feedback.c4 = "Excelente argumentação. Mecanismos linguísticos bem utilizados para construir a argumentação.";
  } else if (competencias.c4 >= 120) {
    feedback.c4 = "Boa argumentação. Alguns mecanismos linguísticos presentes, mas podem ser ampliados.";
  } else {
    feedback.c4 = "Argumentação básica. Poucos mecanismos linguísticos para construção da argumentação.";
  }
  
  // Feedback C5
  if (competencias.c5 >= 160) {
    feedback.c5 = "Excelente proposta de intervenção. Solução clara, detalhada e viável.";
  } else if (competencias.c5 >= 120) {
    feedback.c5 = "Boa proposta de intervenção. Solução presente, mas pode ser mais detalhada.";
  } else {
    feedback.c5 = "Proposta de intervenção básica. Solução pouco desenvolvida ou ausente.";
  }
  
  return feedback;
}

// Função para identificar pontos fortes
function identificarPontosFortes(competencias) {
  const pontos = [];
  
  if (competencias.c1 >= 150) pontos.push("Domínio da norma culta");
  if (competencias.c2 >= 150) pontos.push("Compreensão da proposta");
  if (competencias.c3 >= 150) pontos.push("Organização textual");
  if (competencias.c4 >= 150) pontos.push("Argumentação");
  if (competencias.c5 >= 150) pontos.push("Proposta de intervenção");
  
  return pontos;
}

// Função para identificar pontos fracos
function identificarPontosFracos(competencias) {
  const pontos = [];
  
  if (competencias.c1 < 100) pontos.push("Domínio da norma culta");
  if (competencias.c2 < 100) pontos.push("Compreensão da proposta");
  if (competencias.c3 < 100) pontos.push("Organização textual");
  if (competencias.c4 < 100) pontos.push("Argumentação");
  if (competencias.c5 < 100) pontos.push("Proposta de intervenção");
  
  return pontos;
}

// Função para gerar tags simples baseada na avaliação
function gerarTagsSimples(texto, competencias, temaStatus) {
  const tags = [];
  const palavras = texto.split(/\s+/).length;
  
  if (palavras >= 400) tags.push("redação extensa");
  if (palavras < 250) tags.push("redação curta");
  if (competencias.c1 >= 160) tags.push("sem erros gramaticais");
  if (competencias.c1 < 100) tags.push("vários erros gramaticais");
  if (competencias.c2 >= 150) tags.push("boa estrutura");
  if (competencias.c3 >= 150) tags.push("texto bem desenvolvido");
  if (competencias.c4 >= 150) tags.push("boa conexão");
  if (competencias.c5 >= 150) tags.push("proposta detalhada");
  if (temaStatus === "fora do tema") tags.push("fuga ao tema");
  
  return tags;
}

// Função para gerar tags (mantida para compatibilidade)
function gerarTags(analise, competencias) {
  const tags = [];
  
  if (analise.palavras >= 400) tags.push("redação extensa");
  if (analise.palavras < 250) tags.push("redação curta");
  if (analise.conectivosEncontrados >= 3) tags.push("boa conexão");
  if (analise.conectivosEncontrados < 2) tags.push("falta conectivos");
  if (analise.errosGramaticais === 0) tags.push("sem erros gramaticais");
  if (analise.errosGramaticais > 3) tags.push("vários erros gramaticais");
  if (analise.diversidadeLexical > 0.6) tags.push("vocabulário diverso");
  if (analise.argumentacaoEncontrada >= 3) tags.push("boa argumentação");
  if (analise.intervencaoEncontrada >= 4) tags.push("proposta detalhada");
  
  return tags;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { texto, tema, user_id } = req.body;

    if (!texto || !user_id) {
      return res.status(400).json({ error: 'Texto e user_id são obrigatórios' });
    }

    // Validar regras básicas
    const validacao = validarRegrasBasicas(texto);

    // Corrigir com algoritmo simulado
    const temaUsado = tema && String(tema).trim() ? tema : 'Tema livre';
    const correcao = corrigirComAlgoritmo(texto, temaUsado);

    // Retornar apenas o resultado; o cliente salvará no Firestore
    res.status(200).json({
      success: true,
      ...correcao,
      validacao_basica: validacao
    });

  } catch (error) {
    console.error('Erro na correção:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
}