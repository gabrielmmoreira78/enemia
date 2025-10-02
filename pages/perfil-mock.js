import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext-mock';
import Layout from '@/components/Layout';
import GraficoEvolucao from '@/components/GraficoEvolucao';
import { 
  User, 
  Calendar, 
  TrendingUp, 
  Award, 
  Target,
  CheckCircle,
  AlertTriangle,
  BarChart3
} from 'lucide-react';

export default function Perfil() {
  const { user } = useAuth();
  const [redacoes, setRedacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [estatisticas, setEstatisticas] = useState(null);

  useEffect(() => {
    // Simular carregamento de redações
    setTimeout(() => {
      const redacoesDemo = [
        {
          id: 'demo-1',
          tema: 'A importância da educação no Brasil',
          total: 850,
          data: new Date('2024-01-15'),
          palavras: 420,
          competencias: { c1: 170, c2: 160, c3: 180, c4: 170, c5: 170 }
        },
        {
          id: 'demo-2',
          tema: 'Desafios da sustentabilidade urbana',
          total: 780,
          data: new Date('2024-01-10'),
          palavras: 380,
          competencias: { c1: 150, c2: 150, c3: 160, c4: 160, c5: 160 }
        },
        {
          id: 'demo-3',
          tema: 'Violência contra a mulher na sociedade',
          total: 720,
          data: new Date('2024-01-05'),
          palavras: 350,
          competencias: { c1: 140, c2: 140, c3: 150, c4: 150, c5: 140 }
        },
        {
          id: 'demo-4',
          tema: 'O papel da tecnologia na educação',
          total: 680,
          data: new Date('2024-01-01'),
          palavras: 320,
          competencias: { c1: 130, c2: 135, c3: 140, c4: 135, c5: 140 }
        }
      ];
      
      setRedacoes(redacoesDemo);
      setLoading(false);
    }, 1000);
  }, []);

  // Calcular estatísticas
  useEffect(() => {
    if (redacoes.length === 0) {
      setEstatisticas(null);
      return;
    }

    const totalRedacoes = redacoes.length;
    const mediaGeral = redacoes.reduce((acc, r) => acc + r.total, 0) / totalRedacoes;
    const melhorRedacao = Math.max(...redacoes.map(r => r.total));
    const piorRedacao = Math.min(...redacoes.map(r => r.total));

    // Médias por competência
    const mediasCompetencias = {
      c1: redacoes.reduce((acc, r) => acc + (r.competencias?.c1 || 0), 0) / totalRedacoes,
      c2: redacoes.reduce((acc, r) => acc + (r.competencias?.c2 || 0), 0) / totalRedacoes,
      c3: redacoes.reduce((acc, r) => acc + (r.competencias?.c3 || 0), 0) / totalRedacoes,
      c4: redacoes.reduce((acc, r) => acc + (r.competencias?.c4 || 0), 0) / totalRedacoes,
      c5: redacoes.reduce((acc, r) => acc + (r.competencias?.c5 || 0), 0) / totalRedacoes,
    };

    // Identificar pontos fortes e fracos
    const pontosFortes = [];
    const pontosFracos = [];
    
    Object.entries(mediasCompetencias).forEach(([comp, media]) => {
      const competencias = {
        c1: 'Domínio da norma culta',
        c2: 'Compreensão da proposta',
        c3: 'Organização das informações',
        c4: 'Argumentação',
        c5: 'Proposta de intervenção'
      };
      
      if (media >= 150) {
        pontosFortes.push(competencias[comp]);
      } else if (media < 100) {
        pontosFracos.push(competencias[comp]);
      }
    });

    // Evolução (últimas 2 redações vs primeiras 2)
    const ultimas2 = redacoes.slice(0, Math.min(2, totalRedacoes));
    const primeiras2 = redacoes.slice(-Math.min(2, totalRedacoes));
    
    const mediaUltimas = ultimas2.reduce((acc, r) => acc + r.total, 0) / ultimas2.length;
    const mediaPrimeiras = primeiras2.reduce((acc, r) => acc + r.total, 0) / primeiras2.length;
    const evolucao = mediaUltimas - mediaPrimeiras;

    setEstatisticas({
      totalRedacoes,
      mediaGeral: Math.round(mediaGeral),
      melhorRedacao,
      piorRedacao,
      mediasCompetencias,
      pontosFortes,
      pontosFracos,
      evolucao: Math.round(evolucao)
    });
  }, [redacoes]);

  const formatarData = (data) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(data);
  };

  const getStatusEvolucao = () => {
    if (!estatisticas) return { cor: 'gray', texto: 'Sem dados' };
    
    if (estatisticas.evolucao > 50) return { cor: 'green', texto: 'Excelente evolução!' };
    if (estatisticas.evolucao > 0) return { cor: 'green', texto: 'Evoluindo bem' };
    if (estatisticas.evolucao === 0) return { cor: 'yellow', texto: 'Mantendo nível' };
    return { cor: 'red', texto: 'Precisa melhorar' };
  };

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Meu Perfil (Demo)
            </h1>
            <p className="text-gray-600 mt-1">
              Acompanhe sua evolução e estatísticas
            </p>
          </div>
        </div>

        {/* Informações do usuário */}
        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {user?.displayName || 'Usuário'}
              </h2>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                Membro desde {formatarData(new Date())}
              </p>
            </div>
          </div>
        </div>

        {estatisticas ? (
          <>
            {/* Estatísticas gerais */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="card p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {estatisticas.totalRedacoes}
                </div>
                <div className="text-sm text-gray-600">
                  Redações corrigidas
                </div>
              </div>

              <div className="card p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {estatisticas.mediaGeral}
                </div>
                <div className="text-sm text-gray-600">
                  Média geral
                </div>
              </div>

              <div className="card p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mx-auto mb-4">
                  <Award className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {estatisticas.melhorRedacao}
                </div>
                <div className="text-sm text-gray-600">
                  Melhor redação
                </div>
              </div>

              <div className="card p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <div className={`text-2xl font-bold ${getStatusEvolucao().cor === 'green' ? 'text-green-600' : getStatusEvolucao().cor === 'red' ? 'text-red-600' : 'text-yellow-600'}`}>
                  {estatisticas.evolucao > 0 ? '+' : ''}{estatisticas.evolucao}
                </div>
                <div className="text-sm text-gray-600">
                  Evolução
                </div>
              </div>
            </div>

            {/* Gráfico de evolução */}
            <GraficoEvolucao redacoes={redacoes} />

            {/* Pontos fortes e fracos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pontos fortes */}
              {estatisticas.pontosFortes.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    Pontos Fortes
                  </h3>
                  <div className="space-y-2">
                    {estatisticas.pontosFortes.map((ponto, index) => (
                      <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-green-800 font-medium">{ponto}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pontos a melhorar */}
              {estatisticas.pontosFracos.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                    Pontos a Melhorar
                  </h3>
                  <div className="space-y-2">
                    {estatisticas.pontosFracos.map((ponto, index) => (
                      <div key={index} className="flex items-center p-3 bg-red-50 rounded-lg">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                        <span className="text-red-800 font-medium">{ponto}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Médias por competência */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Médias por Competência
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {Object.entries(estatisticas.mediasCompetencias).map(([comp, media]) => {
                  const competencias = {
                    c1: 'C1\nNorma culta',
                    c2: 'C2\nCompreensão',
                    c3: 'C3\nOrganização',
                    c4: 'C4\nArgumentação',
                    c5: 'C5\nIntervenção'
                  };
                  
                  const mediaRound = Math.round(media);
                  const cor = mediaRound >= 150 ? 'green' : mediaRound >= 100 ? 'yellow' : 'red';
                  
                  return (
                    <div key={comp} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-2 whitespace-pre-line">
                        {competencias[comp]}
                      </div>
                      <div className={`text-2xl font-bold ${
                        cor === 'green' ? 'text-green-600' : 
                        cor === 'yellow' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {mediaRound}
                      </div>
                      <div className="text-xs text-gray-500">/ 200</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="card p-12 text-center">
            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Carregando estatísticas...
            </h3>
            <p className="text-gray-600">
              Aguarde enquanto calculamos suas estatísticas
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}




