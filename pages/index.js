import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import EditorRedacao from '@/components/EditorRedacao';
import CardCompetencia from '@/components/CardCompetencia';
import PainelHistorico from '@/components/PainelHistorico';
import { 
  Send, 
  RefreshCw, 
  Download,
  FileText,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Dashboard() {
  const { user } = useAuth();
  const [tema, setTema] = useState('');
  const [texto, setTexto] = useState('');
  const [corrigindo, setCorrigindo] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const palavrasCount = texto.trim() ? texto.trim().split(/\s+/).length : 0;

  // Gerar tema aleatório
  const gerarTema = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/gerar-tema');
      const data = await response.json();
      
      if (data.success) {
        setTema(data.tema);
        setTexto('');
        setResultado(null);
        toast.success('Tema gerado com sucesso!');
      } else {
        toast.error('Erro ao gerar tema');
      }
    } catch (error) {
      console.error('Erro ao gerar tema:', error);
      toast.error('Erro ao gerar tema');
    } finally {
      setLoading(false);
    }
  };

  // Corrigir redação
  const corrigirRedacao = async () => {
    if (!texto.trim()) {
      toast.error('Digite sua redação antes de enviar');
      return;
    }

    // Tema opcional: usa "Tema livre" se vazio
    const temaUsado = tema && tema.trim() ? tema : 'Tema livre';

    const palavras = texto.trim().split(/\s+/).length;
    if (palavras < 200) {
      toast.error('A redação deve ter pelo menos 200 palavras');
      return;
    }

    setCorrigindo(true);
    
    try {
      const response = await fetch('/api/corrigir', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          texto: texto.trim(),
          tema: temaUsado,
          user_id: user.uid,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Salvar no Firestore com o usuário autenticado
        try {
          await addDoc(collection(db, 'redacoes'), {
            user_id: user.uid,
            tema: temaUsado,
            texto: texto.trim(),
            competencias: data.competencias,
            total: data.total,
            feedback: data.feedback,
            tags: data.tags || [],
            pontos_fortes: data.pontos_fortes || [],
            pontos_fracos: data.pontos_fracos || [],
            validacao_basica: data.validacao_basica,
            data: serverTimestamp(),
            palavras: data.validacao_basica?.palavras
          });
        } catch (e) {
          console.error('Erro ao salvar no Firestore:', e);
        }

        setResultado(data);
        toast.success('Redação corrigida com sucesso!');
      } else {
        toast.error(data.error || 'Erro ao corrigir redação');
      }
    } catch (error) {
      console.error('Erro ao corrigir redação:', error);
      toast.error('Erro ao corrigir redação');
    } finally {
      setCorrigindo(false);
    }
  };

  // Exportar redação corrigida em PDF
  const exportarPDF = () => {
    if (!resultado) return;

    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(18);
    doc.setTextColor(142, 68, 173);
    doc.text('Redação ENEM - Correção IA', 20, 20);
    
    // Tema
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Tema: ${tema}`, 20, 35);
    
    // Nota total
    doc.setFontSize(16);
    doc.setTextColor(142, 68, 173);
    doc.text(`Nota Total: ${resultado.total}/1000`, 20, 50);
    
    // Competências
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    let yPos = 65;
    
    Object.entries(resultado.competencias).forEach(([comp, nota], index) => {
      const competencias = {
        c1: 'Competência 1 - Domínio da norma culta',
        c2: 'Competência 2 - Compreensão da proposta',
        c3: 'Competência 3 - Organização das informações',
        c4: 'Competência 4 - Argumentação',
        c5: 'Competência 5 - Proposta de intervenção'
      };
      
      doc.text(`${competencias[comp]}: ${nota}/200`, 20, yPos);
      yPos += 8;
    });
    
    // Feedback
    yPos += 10;
    doc.setFontSize(14);
    doc.setTextColor(142, 68, 173);
    doc.text('Feedback por Competência:', 20, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    Object.entries(resultado.feedback).forEach(([comp, feedback]) => {
      const competencias = {
        c1: 'C1',
        c2: 'C2', 
        c3: 'C3',
        c4: 'C4',
        c5: 'C5'
      };
      
      doc.text(`${competencias[comp]}: ${feedback}`, 20, yPos);
      yPos += 6;
    });
    
    // Redação original
    yPos += 10;
    doc.setFontSize(14);
    doc.setTextColor(142, 68, 173);
    doc.text('Texto da Redação:', 20, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    // Quebrar texto em linhas
    const lines = doc.splitTextToSize(texto, 170);
    lines.forEach(line => {
      doc.text(line, 20, yPos);
      yPos += 5;
    });
    
    // Salvar PDF
    doc.save(`redacao-enem-${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success('PDF exportado com sucesso!');
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Dashboard - Correção ENEM IA
            </h1>
            <p className="text-gray-600 mt-1">
              Escreva sua redação e receba uma correção detalhada
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={gerarTema}
              disabled={loading}
              className="btn-secondary flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Gerando...' : 'Gerar Tema'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Área principal - Editor e Correção */}
          <div className="lg:col-span-2 space-y-6">
            {/* Editor de Redação */}
            <div className="card p-6">
              <EditorRedacao
                tema={tema}
                valor={texto}
                onChange={setTexto}
                readonly={false}
              />
            </div>

            {/* Botões de ação */}
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {texto && (
                  <span>
                    {texto.trim().split(/\s+/).length} palavras • {texto.length} caracteres
                  </span>
                )}
              </div>
              
              <div className="flex space-x-3">
                {resultado && (
                  <button
                    onClick={exportarPDF}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Exportar PDF</span>
                  </button>
                )}
                
                <button
                  onClick={corrigirRedacao}
                  disabled={corrigindo || palavrasCount < 200}
                  className="btn-primary flex items-center space-x-2"
                >
                  {corrigindo ? (
                    <div className="spinner" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span>
                    {corrigindo ? 'Corrigindo...' : 'Enviar para Correção'}
                  </span>
                </button>
              </div>
            </div>

            {/* Resultado da Correção */}
            {resultado && (
              <div className="card p-6 animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Resultado da Correção
                  </h3>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">
                      {resultado.total}
                    </div>
                    <div className="text-sm text-gray-600">/ 1000 pontos</div>
                  </div>
                </div>

                {/* Competências */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {Object.entries(resultado.competencias).map(([comp, nota]) => (
                    <CardCompetencia
                      key={comp}
                      competencia={comp}
                      nota={nota}
                      feedback={resultado.feedback[comp]}
                      showFeedback={true}
                    />
                  ))}
                </div>

                {/* Tags e Pontos */}
                {(resultado.tags?.length > 0 || resultado.pontos_fortes?.length > 0 || resultado.pontos_fracos?.length > 0) && (
                  <div className="space-y-4">
                    {resultado.pontos_fortes?.length > 0 && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-green-900 mb-2 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Pontos Fortes
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {resultado.pontos_fortes.map((ponto, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                            >
                              {ponto}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {resultado.pontos_fracos?.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-red-900 mb-2 flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Pontos a Melhorar
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {resultado.pontos_fracos.map((ponto, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"
                            >
                              {ponto}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {resultado.tags?.length > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-blue-900 mb-2">
                          Tags
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {resultado.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Painel lateral - Histórico */}
          <div className="lg:col-span-1">
            <PainelHistorico />
          </div>
        </div>
      </div>
    </Layout>
  );
}

