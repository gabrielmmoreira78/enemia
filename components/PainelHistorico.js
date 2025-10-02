import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Link from 'next/link';

export default function PainelHistorico() {
  const { user } = useAuth();
  const [redacoes, setRedacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Buscar apenas por user_id no servidor e ordenar no cliente
    const q = query(
      collection(db, 'redacoes'),
      where('user_id', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const redacoesData = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          data: doc.data().data?.toDate?.() || new Date(doc.data().data)
        }))
        .sort((a, b) => b.data - a.data);
      
      setRedacoes(redacoesData);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const formatarData = (data) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(data);
  };

  const getTendencia = (index) => {
    if (index === 0) return null; // Primeira redação não tem tendência
    
    const atual = redacoes[index].total;
    const anterior = redacoes[index - 1].total;
    
    if (atual > anterior) {
      return { icon: TrendingUp, color: 'text-green-600', text: '+' + (atual - anterior) };
    } else if (atual < anterior) {
      return { icon: TrendingDown, color: 'text-red-600', text: (atual - anterior) };
    } else {
      return { icon: Minus, color: 'text-gray-600', text: '0' };
    }
  };

  const getNotaColor = (nota) => {
    if (nota >= 800) return 'text-green-600';
    if (nota >= 600) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getNotaBgColor = (nota) => {
    if (nota >= 800) return 'bg-green-50 border-green-200';
    if (nota >= 600) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Redações</h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (redacoes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Redações</h3>
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Nenhuma redação encontrada</p>
          <p className="text-sm text-gray-400 mt-1">
            Suas redações aparecerão aqui após a correção
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Histórico de Redações
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {redacoes.length} redação{redacoes.length !== 1 ? 'ões' : ''} corrigida{redacoes.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {redacoes.map((redacao, index) => {
          const tendencia = getTendencia(index);
          const TendenciaIcon = tendencia?.icon;
          
          return (
            <Link
              key={redacao.id}
              href={`/redacao/${redacao.id}`}
              className="block p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      #{redacoes.length - index}
                    </span>
                    {tendencia && (
                      <div className="flex items-center space-x-1">
                        <TendenciaIcon className={`h-4 w-4 ${tendencia.color}`} />
                        <span className={`text-xs ${tendencia.color}`}>
                          {tendencia.text}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1 truncate">
                    {redacao.tema}
                  </p>
                  
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatarData(redacao.data)}
                    </span>
                    <span>{redacao.palavras} palavras</span>
                  </div>
                </div>
                
                <div className={`px-3 py-1 rounded-full border ${getNotaBgColor(redacao.total)}`}>
                  <span className={`text-lg font-bold ${getNotaColor(redacao.total)}`}>
                    {redacao.total}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      
      {redacoes.length > 0 && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Melhor redação:</span>
            <span className="font-medium">{redacoes[0].total} pontos</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>Média geral:</span>
            <span className="font-medium">
              {Math.round(redacoes.reduce((acc, r) => acc + r.total, 0) / redacoes.length)} pontos
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

