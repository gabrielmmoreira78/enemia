// API mock para correção de redações (sem Firebase)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { texto, tema, user_id } = req.body;

    if (!texto || !tema) {
      return res.status(400).json({ error: 'Texto e tema são obrigatórios' });
    }

    // Simular análise da redação
    const palavras = texto.trim().split(/\s+/).length;
    const paragrafos = texto.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    
    // Algoritmo de correção simulado
    const c1 = Math.max(120, Math.min(200, 160 + (palavras >= 300 ? 20 : 0) - (palavras < 200 ? 40 : 0)));
    const c2 = Math.max(100, Math.min(200, 140 + (paragrafos >= 4 ? 30 : 0) + (palavras >= 400 ? 30 : 0)));
    const c3 = Math.max(110, Math.min(200, 150 + (paragrafos >= 3 ? 25 : 0) + (palavras >= 350 ? 25 : 0)));
    const c4 = Math.max(100, Math.min(200, 130 + (palavras >= 300 ? 35 : 0) + (paragrafos >= 4 ? 35 : 0)));
    const c5 = Math.max(90, Math.min(200, 120 + (palavras >= 400 ? 40 : 0) + (paragrafos >= 5 ? 40 : 0)));

    const competencias = { c1, c2, c3, c4, c5 };
    const total = c1 + c2 + c3 + c4 + c5;

    const feedback = {
      c1: c1 >= 160 ? "Excelente domínio da norma culta. Poucos ou nenhum erro gramatical encontrado." : 
          c1 >= 130 ? "Bom domínio da norma culta. Alguns erros pontuais que podem ser corrigidos." :
          "Necessita melhorar o domínio da norma culta. Vários erros gramaticais encontrados.",
      c2: c2 >= 160 ? "Excelente compreensão da proposta. Tema bem desenvolvido e aprofundado." :
          c2 >= 130 ? "Boa compreensão da proposta. Tema abordado adequadamente." :
          "Compreensão básica da proposta. Tema abordado superficialmente.",
      c3: c3 >= 160 ? "Excelente organização textual. Informações bem selecionadas e relacionadas." :
          c3 >= 130 ? "Boa organização textual. Informações adequadas." :
          "Organização textual básica. Informações pouco relacionadas.",
      c4: c4 >= 160 ? "Excelente argumentação. Mecanismos linguísticos bem utilizados." :
          c4 >= 130 ? "Boa argumentação. Alguns mecanismos linguísticos presentes." :
          "Argumentação básica. Poucos mecanismos linguísticos.",
      c5: c5 >= 160 ? "Excelente proposta de intervenção. Solução clara, detalhada e viável." :
          c5 >= 130 ? "Boa proposta de intervenção. Solução presente." :
          "Proposta de intervenção básica. Solução pouco desenvolvida."
    };

    const pontosFortes = [];
    const pontosFracos = [];
    
    if (c1 >= 150) pontosFortes.push("Domínio da norma culta");
    if (c2 >= 150) pontosFortes.push("Compreensão da proposta");
    if (c3 >= 150) pontosFortes.push("Organização textual");
    if (c4 >= 150) pontosFortes.push("Argumentação");
    if (c5 >= 150) pontosFortes.push("Proposta de intervenção");
    
    if (c1 < 120) pontosFracos.push("Domínio da norma culta");
    if (c2 < 120) pontosFracos.push("Compreensão da proposta");
    if (c3 < 120) pontosFracos.push("Organização textual");
    if (c4 < 120) pontosFracos.push("Argumentação");
    if (c5 < 120) pontosFracos.push("Proposta de intervenção");

    const tags = [];
    if (palavras >= 400) tags.push("redação extensa");
    if (palavras < 250) tags.push("redação curta");
    if (paragrafos >= 4) tags.push("bem estruturada");
    if (total >= 800) tags.push("excelente");
    if (total < 600) tags.push("precisa melhorar");

    res.status(200).json({
      success: true,
      redacao_id: 'demo-' + Date.now(),
      competencias,
      total,
      feedback,
      tags,
      pontos_fortes: pontosFortes,
      pontos_fracos: pontosFracos,
      validacao_basica: {
        palavras,
        temTese: true,
        temProposta: true,
        temConclusao: true,
        valida: palavras >= 200
      }
    });

  } catch (error) {
    console.error('Erro na correção:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
}




