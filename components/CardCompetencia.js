import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const competencias = {
  c1: {
    nome: 'Competência 1',
    descricao: 'Domínio da norma culta da língua portuguesa',
    cor: 'blue'
  },
  c2: {
    nome: 'Competência 2', 
    descricao: 'Compreensão da proposta de redação',
    cor: 'green'
  },
  c3: {
    nome: 'Competência 3',
    descricao: 'Seleção, relacionamento e organização das informações',
    cor: 'purple'
  },
  c4: {
    nome: 'Competência 4',
    descricao: 'Conhecimento dos mecanismos linguísticos para construção da argumentação',
    cor: 'orange'
  },
  c5: {
    nome: 'Competência 5',
    descricao: 'Elaboração de proposta de intervenção para o problema abordado',
    cor: 'pink'
  }
};

const cores = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-900',
    accent: 'text-blue-600'
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200', 
    text: 'text-green-900',
    accent: 'text-green-600'
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-900', 
    accent: 'text-purple-600'
  },
  orange: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-900',
    accent: 'text-orange-600'
  },
  pink: {
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    text: 'text-pink-900',
    accent: 'text-pink-600'
  }
};

export default function CardCompetencia({ competencia, nota, feedback, showFeedback = true }) {
  const info = competencias[competencia];
  const cor = cores[info.cor];

  const getStatusIcon = () => {
    if (nota >= 150) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    } else if (nota >= 100) {
      return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    } else {
      return <XCircle className="h-5 w-5 text-red-600" />;
    }
  };

  const getStatusText = () => {
    if (nota >= 150) return 'Ponto forte';
    if (nota >= 100) return 'Necessita melhoria';
    return 'Ponto fraco';
  };

  const getStatusColor = () => {
    if (nota >= 150) return 'text-green-600';
    if (nota >= 100) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getNotaColor = () => {
    if (nota >= 150) return 'text-green-600';
    if (nota >= 100) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`${cor.bg} ${cor.border} border rounded-lg p-4`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className={`text-sm font-semibold ${cor.text}`}>
            {info.nome}
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            {info.descricao}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className={`text-xs font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
      </div>

      {/* Nota */}
      <div className="mb-3">
        <div className="flex items-baseline space-x-2">
          <span className={`text-2xl font-bold ${getNotaColor()}`}>
            {nota}
          </span>
          <span className="text-sm text-gray-500">/ 200</span>
        </div>
        
        {/* Barra de progresso */}
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              nota >= 150 ? 'bg-green-500' : 
              nota >= 100 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${(nota / 200) * 100}%` }}
          />
        </div>
      </div>

      {/* Feedback */}
      {showFeedback && feedback && (
        <div className="mt-3">
          <h4 className="text-xs font-medium text-gray-700 mb-1">Feedback:</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            {feedback}
          </p>
        </div>
      )}
    </div>
  );
}





