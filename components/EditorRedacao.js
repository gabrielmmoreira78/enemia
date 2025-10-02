import { useState, useEffect } from 'react';
import { FileText, AlertTriangle } from 'lucide-react';

export default function EditorRedacao({ 
  tema, 
  valor, 
  onChange, 
  placeholder = "Digite sua redação aqui...",
  readonly = false 
}) {
  const [palavras, setPalavras] = useState(0);
  const [caracteres, setCaracteres] = useState(0);

  // Contar palavras e caracteres
  useEffect(() => {
    if (valor) {
      const texto = valor.trim();
      const palavrasArray = texto.split(/\s+/).filter(palavra => palavra.length > 0);
      setPalavras(palavrasArray.length);
      setCaracteres(texto.length);
    } else {
      setPalavras(0);
      setCaracteres(0);
    }
  }, [valor]);

  const getPalavrasColor = () => {
    if (palavras < 200) return 'text-red-600';
    if (palavras < 300) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getPalavrasBgColor = () => {
    if (palavras < 200) return 'bg-red-50 border-red-200';
    if (palavras < 300) return 'bg-yellow-50 border-yellow-200';
    return 'bg-green-50 border-green-200';
  };

  return (
    <div className="space-y-4">
      {/* Tema da redação */}
      {tema && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <FileText className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-primary">Tema da Redação</h3>
              <p className="mt-1 text-sm text-gray-700">{tema}</p>
            </div>
          </div>
        </div>
      )}

      {/* Contador de palavras */}
      <div className={`flex items-center justify-between px-3 py-2 rounded-lg border ${getPalavrasBgColor()}`}>
        <div className="flex items-center space-x-4 text-sm">
          <span className={getPalavrasColor()}>
            <strong>{palavras}</strong> palavras
          </span>
          <span className="text-gray-600">
            {caracteres} caracteres
          </span>
        </div>
        
        {palavras < 200 && (
          <div className="flex items-center text-red-600 text-sm">
            <AlertTriangle className="h-4 w-4 mr-1" />
            Mínimo 200 palavras
          </div>
        )}
      </div>

      {/* Editor de texto */}
      <div className="relative">
        <textarea
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          readOnly={readonly}
          className={`
            w-full h-96 p-4 border border-gray-300 rounded-lg resize-none
            focus:ring-2 focus:ring-primary focus:border-transparent
            transition-colors duration-200
            ${readonly ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
          `}
          style={{ 
            fontFamily: 'Georgia, serif',
            lineHeight: '1.6',
            fontSize: '16px'
          }}
        />
        
        {/* Linha de texto para orientação */}
        <div className="absolute bottom-4 right-4 text-xs text-gray-400 pointer-events-none">
          Linha de orientação
        </div>
      </div>

      {/* Dicas para a redação */}
      {!readonly && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Dicas para sua redação:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Estruture sua redação com introdução, desenvolvimento e conclusão</li>
            <li>• Apresente uma tese clara sobre o tema</li>
            <li>• Desenvolva argumentos consistentes com exemplos</li>
            <li>• Use conectivos para ligar as ideias</li>
            <li>• Proponha uma solução detalhada na conclusão</li>
          </ul>
        </div>
      )}
    </div>
  );
}





