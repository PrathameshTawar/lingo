import React from 'react';

const translations = {
  en: {
    analysisResults: 'Analysis Results',
    localDoctorRecommendations: 'Local Doctor Recommendations',
    downloadReport: 'Download Report',
    shareReport: 'Share Report',
    sharingNotSupported: 'Sharing not supported on this device.',
  },
  es: {
    analysisResults: 'Resultados del Análisis',
    localDoctorRecommendations: 'Recomendaciones de Médicos Locales',
    downloadReport: 'Descargar Informe',
    shareReport: 'Compartir Informe',
    sharingNotSupported: 'Compartir no es compatible con este dispositivo.',
  },
  fr: {
    analysisResults: 'Résultats de l\'Analyse',
    localDoctorRecommendations: 'Recommandations de Médecins Locaux',
    downloadReport: 'Télécharger le Rapport',
    shareReport: 'Partager le Rapport',
    sharingNotSupported: 'Le partage n\'est pas pris en charge sur cet appareil.',
  },
  // Add more languages as needed
};

const Results = ({ analysis, recommendations, language }) => {
  if (!analysis) return null;

  const t = translations[language] || translations.en;

  const downloadReport = () => {
    const report = `Healthcare AI Assistant Report\n\nAnalysis:\n${analysis}\n\nRecommendations:\n${recommendations.map(rec => `${rec.name} - ${rec.address} (Rating: ${rec.rating})`).join('\n')}`;
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'healthcare-report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareReport = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Healthcare AI Assistant Report',
          text: `Analysis: ${analysis}\nRecommendations: ${recommendations.map(rec => `${rec.name} - ${rec.address}`).join(', ')}`,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      alert(t.sharingNotSupported);
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="p-4 bg-gray-50 rounded-md">
        <h2 className="text-lg font-semibold mb-2">{t.analysisResults}</h2>
        <p className="text-gray-700 whitespace-pre-wrap">{analysis}</p>
      </div>
      {recommendations.length > 0 && (
        <div className="p-4 bg-blue-50 rounded-md">
          <h2 className="text-lg font-semibold mb-2">{t.localDoctorRecommendations}</h2>
          <ul className="space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="text-gray-700">
                <strong>{rec.name}</strong> - {rec.address} (Rating: {rec.rating})
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex space-x-2">
        <button
          onClick={downloadReport}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          📥 {t.downloadReport}
        </button>
        <button
          onClick={shareReport}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          📤 {t.shareReport}
        </button>
      </div>
    </div>
  );
};

export default Results;
