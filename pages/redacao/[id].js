import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import EditorRedacao from '@/components/EditorRedacao';
import CardCompetencia from '@/components/CardCompetencia';
import { useRouter } from 'next/router';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';

export default function VisualizarRedacao() {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = router.query;
  const [redacao, setRedacao] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !user) return;

    const fetchRedacao = async () => {
      try {
        const redacaoDoc = await getDoc(doc(db, 'redacoes', id));
        
        if (redacaoDoc.exists()) {
          const redacaoData = redacaoDoc.data();
          
          // Verificar se a redação pertence ao usuário
          if (redacaoData.user_id !== user.uid) {
            toast.error('Você não tem permissão para visualizar esta redação');
            router.push('/');
            return;
          }
          
          setRedacao({
            id: redacaoDoc.id,
            ...redacaoData,
            data: redacaoData.data?.toDate?.() || new Date(redacaoData.data)
          });
        } else {
          toast.error('Redação não encontrada');
          router.push('/');
        }
      } catch (error) {
        console.error('Erro ao buscar redação:', error);
        toast.error('Erro ao carregar redação');
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchRedacao();
  }, [id, user, router]);

  const exportarPDF = () => {
    if (!redacao) return;

    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(18);
    doc.setTextColor(142, 68, 173);
    doc.text('Redação ENEM - Correção IA', 20, 20);
    
    // Tema
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Tema: ${redacao.tema}`, 20, 35);
    
    // Data
    const dataFormatada = new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(redacao.data);
    doc.text(`Data: ${dataFormatada}`, 20, 45);
    
    // Nota total
    doc.setFontSize(16);
    doc.setTextColor(142, 68, 173);
    doc.text(`Nota Total: ${redacao.total}/1000`, 20, 60);
    
    // Competências
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    let yPos = 75;
    
    const competencias = {
      c1: 'Competência 1 - Domínio da norma culta da língua portuguesa',
      c2: 'Competência 2 - Compreensão da proposta de redação',
      c3: 'Competência 3 - Seleção, relacionamento e organização das informações',
      c4: 'Competência 4 - Conhecimento dos mecanismos linguísticos para construção da argumentação',
      c5: 'Competência 5 - Elaboração de proposta de intervenção para o problema abordado'
    };
    
    Object.entries(redacao.competencias).forEach(([comp, nota]) => {
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
    
    Object.entries(redacao.feedback).forEach(([comp, feedback]) => {
      const compShort = {
        c1: 'C1',
        c2: 'C2', 
        c3: 'C3',
        c4: 'C4',
        c5: 'C5'
      };
      
      doc.text(`${compShort[comp]}: ${feedback}`, 20, yPos);
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
    const lines = doc.splitTextToSize(redacao.texto, 170);
    lines.forEach(line => {
      doc.text(line, 20, yPos);
      yPos += 5;
    });
    
    // Salvar PDF
    doc.save(`redacao-enem-${dataFormatada.replace(/\//g, '-')}.pdf`);
    toast.success('PDF exportado com sucesso!');
  };

  const formatarData = (data) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(data);
  };

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-96 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!redacao) {
    return (
      <Layout>
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Redação não encontrada
          </h2>
          <p className="text-gray-600 mb-6">
            A redação que você está procurando não existe ou foi removida.
          </p>
          <button
            onClick={() => router.push('/')}
            className="btn-primary"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Visualizar Redação
              </h1>
              <p className="text-gray-600 mt-1">
                {formatarData(redacao.data)} • {redacao.palavras} palavras
              </p>
            </div>
          </div>
          
          <button
            onClick={exportarPDF}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Exportar PDF</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Redação e competências */}
          <div className="lg:col-span-2 space-y-6">
            {/* Editor com redação */}
            <div className="card p-6">
              <EditorRedacao
                tema={redacao.tema}
                valor={redacao.texto}
                onChange={() => {}} // Readonly
                readonly={true}
              />
            </div>

            {/* Resultado da correção */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Resultado da Correção
                </h3>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">
                    {redacao.total}
                  </div>
                  <div className="text-sm text-gray-600">/ 1000 pontos</div>
                </div>
              </div>

              {/* Competências */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(redacao.competencias).map(([comp, nota]) => (
                  <CardCompetencia
                    key={comp}
                    competencia={comp}
                    nota={nota}
                    feedback={redacao.feedback[comp]}
                    showFeedback={true}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Painel lateral com informações */}
          <div className="lg:col-span-1 space-y-6">
            {/* Informações da redação */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Informações
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-700">Data:</span>
                  <p className="text-sm text-gray-600">
                    {formatarData(redacao.data)}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Palavras:</span>
                  <p className="text-sm text-gray-600">{redacao.palavras}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Caracteres:</span>
                  <p className="text-sm text-gray-600">{redacao.texto.length}</p>
                </div>
              </div>
            </div>

            {/* Tags e pontos */}
            {(redacao.tags?.length > 0 || redacao.pontos_fortes?.length > 0 || redacao.pontos_fracos?.length > 0) && (
              <div className="space-y-4">
                {redacao.pontos_fortes?.length > 0 && (
                  <div className="card p-6">
                    <h4 className="text-sm font-medium text-green-900 mb-2">
                      Pontos Fortes
                    </h4>
                    <div className="space-y-1">
                      {redacao.pontos_fortes.map((ponto, index) => (
                        <div
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                        >
                          {ponto}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {redacao.pontos_fracos?.length > 0 && (
                  <div className="card p-6">
                    <h4 className="text-sm font-medium text-red-900 mb-2">
                      Pontos a Melhorar
                    </h4>
                    <div className="space-y-1">
                      {redacao.pontos_fracos.map((ponto, index) => (
                        <div
                          key={index}
                          className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"
                        >
                          {ponto}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {redacao.tags?.length > 0 && (
                  <div className="card p-6">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">
                      Tags
                    </h4>
                    <div className="space-y-1">
                      {redacao.tags.map((tag, index) => (
                        <div
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}





