/**
 * Módulo Avaliador de Redação - Regras Fixas
 * Implementa avaliação baseada em regras específicas do ENEM
 */

/**
 * Função principal para avaliar redação
 * @param {string} texto - Texto da redação
 * @param {string} tema - Tema da redação
 * @returns {object} Resultado da avaliação
 */
function avaliarRedacao(texto, tema) {
  // Verificar fuga do tema primeiro
  const temaStatus = verificarFugaTema(texto, tema);
  
  // Se houver fuga total do tema, todas as competências recebem 0
  if (temaStatus === "fora do tema") {
    return {
      tema: "fora do tema",
      competencias: {
        c1: 0,
        c2: 0,
        c3: 0,
        c4: 0,
        c5: 0
      },
      nota_total: 0
    };
  }

  // Calcular cada competência
  const competencias = {
    c1: calcularC1(texto),
    c2: calcularC2(texto),
    c3: calcularC3(texto),
    c4: calcularC4(texto),
    c5: calcularC5(texto)
  };

  const nota_total = Object.values(competencias).reduce((acc, nota) => acc + nota, 0);

  return {
    tema: "ok",
    competencias,
    nota_total
  };
}

/**
 * Verifica se há fuga do tema usando comparação simples de palavras-chave
 * @param {string} texto - Texto da redação
 * @param {string} tema - Tema da redação
 * @returns {string} "ok" ou "fora do tema"
 */
function verificarFugaTema(texto, tema) {
  if (!tema || !texto) return "ok";

  // Normalizar texto e tema
  const textoNormalizado = normalizarTexto(texto);
  const temaNormalizado = normalizarTexto(tema);

  // Calcular similaridade simples (contagem de palavras-chave)
  const palavrasTema = new Set(temaNormalizado);
  const palavrasTexto = new Set(textoNormalizado);
  
  let matches = 0;
  palavrasTema.forEach(palavra => {
    if (palavrasTexto.has(palavra)) {
      matches++;
    }
  });

  const similaridade = palavrasTema.size > 0 ? matches / palavrasTema.size : 1;
  
  return similaridade < 0.5 ? "fora do tema" : "ok";
}

/**
 * Normaliza texto removendo acentos e caracteres especiais
 * @param {string} texto - Texto a ser normalizado
 * @returns {array} Array de palavras normalizadas
 */
function normalizarTexto(texto) {
  // Palavras genéricas que não devem ser consideradas para similaridade
  const palavrasGenericas = new Set([
    'sociedade', 'brasileira', 'brasil', 'brasileiro', 'brasileiros', 'brasileiras',
    'problema', 'problemas', 'questao', 'questoes', 'tema', 'temas', 'assunto',
    'importante', 'fundamental', 'necessario', 'preciso', 'deve', 'devem',
    'governo', 'estado', 'pais', 'nacao', 'populacao', 'pessoas', 'cidadãos',
    'publico', 'publica', 'publicos', 'publicas', 'politica', 'politicas',
    'social', 'sociais', 'economico', 'economicos', 'economica', 'economicas',
    'cultural', 'culturais', 'educacao', 'saude', 'seguranca', 'desenvolvimento'
  ]);
  
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s]/g, ' ') // Remove caracteres especiais
    .split(/\s+/)
    .filter(palavra => palavra.length >= 3 && !palavrasGenericas.has(palavra)); // Filtra palavras com 3+ caracteres e remove genéricas
}

/**
 * Competência 1 - Domínio da norma culta
 * Baseada na contagem de erros ortográficos e gramaticais
 * @param {string} texto - Texto da redação
 * @returns {number} Nota de 0 a 200
 */
function calcularC1(texto) {
  const erros = contarErrosGramaticais(texto);
  
  if (erros === 0) return 200;
  if (erros <= 3) return 160;
  if (erros <= 6) return 120;
  return 80;
}

/**
 * Conta erros gramaticais e ortográficos simples
 * @param {string} texto - Texto da redação
 * @returns {number} Número de erros encontrados
 */
function contarErrosGramaticais(texto) {
  let erros = 0;
  const textoLower = texto.toLowerCase();
  
  // Erros de ortografia básicos
  const errosOrtograficos = [
    'nao', 'naum', 'vc', 'voce', 'pq', 'porque', 'tbm', 'tambem',
    'eh', 'e', 'governo', 'governo', 'nao', 'nao', 'nao'
  ];
  
  errosOrtograficos.forEach(erro => {
    if (textoLower.includes(erro)) erros++;
  });
  
  // Erros de concordância básicos
  if (textoLower.includes('a gente vamos')) erros++;
  if (textoLower.includes('os aluno')) erros++;
  if (textoLower.includes('as menino')) erros++;
  
  return erros;
}

/**
 * Competência 2 - Compreensão da proposta de redação
 * Baseada no número de parágrafos
 * @param {string} texto - Texto da redação
 * @returns {number} Nota de 0 a 200
 */
function calcularC2(texto) {
  const paragrafos = texto.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const numParagrafos = paragrafos.length;
  
  if (numParagrafos >= 4) return 200;
  if (numParagrafos === 3) return 150;
  if (numParagrafos === 2) return 100;
  return 50;
}

/**
 * Competência 3 - Seleção, relacionamento e organização das informações
 * Baseada no número de caracteres do texto
 * @param {string} texto - Texto da redação
 * @returns {number} Nota de 0 a 200
 */
function calcularC3(texto) {
  const caracteres = texto.length;
  
  if (caracteres >= 600) return 200;
  if (caracteres >= 400) return 150;
  if (caracteres >= 200) return 100;
  return 50;
}

/**
 * Competência 4 - Conhecimento dos mecanismos linguísticos para construção da argumentação
 * Baseada na presença de conectores
 * @param {string} texto - Texto da redação
 * @returns {number} Nota de 0 a 200
 */
function calcularC4(texto) {
  const conectores = [
    'portanto', 'além disso', 'contudo', 'assim', 'em conclusão', 'dessa forma'
  ];
  
  const textoLower = texto.toLowerCase();
  const conectoresEncontrados = conectores.filter(conector => 
    textoLower.includes(conector)
  );
  
  return conectoresEncontrados.length > 0 ? 200 : 100;
}

/**
 * Competência 5 - Elaboração de proposta de intervenção
 * Baseada na presença de frases-chave de intervenção
 * @param {string} texto - Texto da redação
 * @returns {number} Nota de 0 a 200
 */
function calcularC5(texto) {
  const frasesChave = [
    'é necessário', 'deve-se', 'precisa', 'proposta', 'solução'
  ];
  
  const textoLower = texto.toLowerCase();
  const frasesEncontradas = frasesChave.filter(frase => 
    textoLower.includes(frase)
  );
  
  return frasesEncontradas.length > 0 ? 200 : 80;
}

module.exports = {
  avaliarRedacao,
  verificarFugaTema,
  normalizarTexto,
  calcularC1,
  calcularC2,
  calcularC3,
  calcularC4,
  calcularC5
};
