import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useState } from 'react';
import { TrendingUp, BarChart3 } from 'lucide-react';

const competencias = {
  c1: { nome: 'C1', descricao: 'Norma culta' },
  c2: { nome: 'C2', descricao: 'Compreensão' },
  c3: { nome: 'C3', descricao: 'Organização' },
  c4: { nome: 'C4', descricao: 'Argumentação' },
  c5: { nome: 'C5', descricao: 'Intervenção' }
};

export default function GraficoEvolucao({ redacoes }) {
  const [tipoGrafico, setTipoGrafico] = useState('linha');

  if (!redacoes || redacoes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolução por Competência</h3>
        <div className="text-center py-8">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Dados insuficientes para gerar gráficos</p>
          <p className="text-sm text-gray-400 mt-1">
            Escreva mais redações para ver sua evolução
          </p>
        </div>
      </div>
    );
  }

  // Preparar dados para o gráfico
  const dadosEvolucao = redacoes.map((redacao, index) => ({
    redacao: `#${redacoes.length - index}`,
    total: redacao.total,
    c1: redacao.competencias?.c1 || 0,
    c2: redacao.competencias?.c2 || 0,
    c3: redacao.competencias?.c3 || 0,
    c4: redacao.competencias?.c4 || 0,
    c5: redacao.competencias?.c5 || 0,
    data: redacao.data
  })).reverse(); // Ordenar cronologicamente

  // Calcular médias por competência
  const mediasCompetencias = Object.keys(competencias).map(comp => {
    const valores = redacoes.map(r => r.competencias?.[comp] || 0);
    const media = valores.reduce((acc, val) => acc + val, 0) / valores.length;
    return {
      competencia: competencias[comp].nome,
      descricao: competencias[comp].descricao,
      media: Math.round(media)
    };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value} pontos
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Evolução por Competência</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setTipoGrafico('linha')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              tipoGrafico === 'linha'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <TrendingUp className="h-4 w-4 inline mr-1" />
            Evolução
          </button>
          <button
            onClick={() => setTipoGrafico('barra')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              tipoGrafico === 'barra'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <BarChart3 className="h-4 w-4 inline mr-1" />
            Médias
          </button>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {tipoGrafico === 'linha' ? (
            <LineChart data={dadosEvolucao}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="redacao" 
                stroke="#666"
                fontSize={12}
              />
              <YAxis 
                domain={[0, 200]}
                stroke="#666"
                fontSize={12}
                label={{ value: 'Pontos', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#8E44AD" 
                strokeWidth={3}
                name="Total"
                dot={{ fill: '#8E44AD', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="c1" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="C1 - Norma culta"
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="c2" 
                stroke="#10B981" 
                strokeWidth={2}
                name="C2 - Compreensão"
                dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="c3" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                name="C3 - Organização"
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="c4" 
                stroke="#F59E0B" 
                strokeWidth={2}
                name="C4 - Argumentação"
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="c5" 
                stroke="#EC4899" 
                strokeWidth={2}
                name="C5 - Intervenção"
                dot={{ fill: '#EC4899', strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          ) : (
            <BarChart data={mediasCompetencias}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="competencia" 
                stroke="#666"
                fontSize={12}
              />
              <YAxis 
                domain={[0, 200]}
                stroke="#666"
                fontSize={12}
                label={{ value: 'Pontos', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value) => [`${value} pontos`, 'Média']}
                labelFormatter={(label) => `Competência ${label}`}
              />
              <Bar 
                dataKey="media" 
                fill="#8E44AD"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Legenda para médias */}
      {tipoGrafico === 'barra' && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
          {mediasCompetencias.map((comp) => (
            <div key={comp.competencia} className="text-center">
              <div className="font-medium text-gray-900">{comp.competencia}</div>
              <div className="text-gray-600">{comp.descricao}</div>
              <div className="font-semibold text-primary">{comp.media} pts</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}





