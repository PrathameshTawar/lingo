import React, { useState } from 'react';
import SymptomInput from './components/SymptomInput';
import Results from './components/Results';

const translations = {
  en: {
    title: 'Healthcare AI Assistant',
    lightMode: '☀️ Light',
    darkMode: '🌙 Dark',
  },
  es: {
    title: 'Asistente de IA para la Salud',
    lightMode: '☀️ Claro',
    darkMode: '🌙 Oscuro',
  },
  fr: {
    title: 'Assistant IA pour la Santé',
    lightMode: '☀️ Lumière',
    darkMode: '🌙 Sombre',
  },
  // Add more languages as needed
};

function App() {
  const [analysis, setAnalysis] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');

  const handleAnalysis = async (symptoms, language, location) => {
    setLanguage(language); // Update language state
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/analyze-symptoms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptoms, language }),
      });
      const data = await response.json();
      setAnalysis(data.analysis);

      // Fetch recommendations if location provided
      if (location) {
        const recResponse = await fetch('http://localhost:5000/api/local-recommendations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ lat: location.lat, lng: location.lng, language }),
        });
        const recData = await recResponse.json();
        setRecommendations(recData.recommendations || []);
      } else {
        setRecommendations([]);
      }
    } catch (error) {
      console.error('Error:', error);
      setAnalysis('Error analyzing symptoms. Please try again.');
      setRecommendations([]);
    }
    setLoading(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const t = translations[language] || translations.en;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'} flex items-center justify-center`}>
      <div className={`max-w-md w-full ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-center">{t.title}</h1>
          <button
            onClick={toggleDarkMode}
            className={`px-3 py-1 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
          >
            {darkMode ? t.lightMode : t.darkMode}
          </button>
        </div>
        <SymptomInput onAnalyze={handleAnalysis} loading={loading} />
        <Results analysis={analysis} recommendations={recommendations} language={language} />
      </div>
    </div>
  );
}

export default App;
