import React, { useState } from 'react';

const translations = {
  en: {
    selectLanguage: 'Select Language',
    describeSymptoms: 'Describe your symptoms',
    getLocalRecommendations: 'Get local doctor recommendations',
    voiceInput: 'Voice Input',
    analyzeSymptoms: 'Analyze Symptoms',
    analyzing: 'Analyzing...',
    getLocation: 'Get Location',
    listening: 'Listening...',
    voiceNotSupported: 'Voice input is not supported in this browser.',
    locationNotSupported: 'Geolocation is not supported by this browser.',
    locationError: 'Unable to get location. Please check permissions.',
  },
  es: {
    selectLanguage: 'Seleccionar Idioma',
    describeSymptoms: 'Describe tus síntomas',
    getLocalRecommendations: 'Obtener recomendaciones de médicos locales',
    voiceInput: 'Entrada de Voz',
    analyzeSymptoms: 'Analizar Síntomas',
    analyzing: 'Analizando...',
    getLocation: 'Obtener Ubicación',
    listening: 'Escuchando...',
    voiceNotSupported: 'La entrada de voz no es compatible con este navegador.',
    locationNotSupported: 'La geolocalización no es compatible con este navegador.',
    locationError: 'No se pudo obtener la ubicación. Verifique los permisos.',
  },
  fr: {
    selectLanguage: 'Sélectionner la Langue',
    describeSymptoms: 'Décrivez vos symptômes',
    getLocalRecommendations: 'Obtenir des recommandations de médecins locaux',
    voiceInput: 'Entrée Vocale',
    analyzeSymptoms: 'Analyser les Symptômes',
    analyzing: 'Analyse...',
    getLocation: 'Obtenir la Localisation',
    listening: 'Écoute...',
    voiceNotSupported: 'L\'entrée vocale n\'est pas prise en charge dans ce navigateur.',
    locationNotSupported: 'La géolocalisation n\'est pas prise en charge par ce navigateur.',
    locationError: 'Impossible d\'obtenir la localisation. Vérifiez les autorisations.',
  },
  // Add more languages as needed
};

const SymptomInput = ({ onAnalyze, loading }) => {
  const [symptoms, setSymptoms] = useState('');
  const [language, setLanguage] = useState('en');
  const [isListening, setIsListening] = useState(false);
  const [location, setLocation] = useState(null);
  const [useLocation, setUseLocation] = useState(false);

  const t = translations[language] || translations.en;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (symptoms.trim()) {
      const loc = useLocation ? location : null;
      onAnalyze(symptoms, language, loc);
    }
  };

  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = language;
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSymptoms(prev => prev + ' ' + transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert(t.voiceNotSupported);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert(t.locationError);
        }
      );
    } else {
      alert(t.locationNotSupported);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
          {t.selectLanguage}
        </label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="hi">Hindi</option>
          <option value="zh">Chinese</option>
          <option value="ar">Arabic</option>
        </select>
      </div>
      <div>
        <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-1">
          {t.describeSymptoms}
        </label>
        <textarea
          id="symptoms"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="Enter your symptoms here..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="useLocation"
          checked={useLocation}
          onChange={(e) => setUseLocation(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="useLocation" className="text-sm font-medium text-gray-700">
          {t.getLocalRecommendations}
        </label>
        {useLocation && (
          <button
            type="button"
            onClick={getLocation}
            className="px-3 py-1 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            📍 {t.getLocation}
          </button>
        )}
      </div>
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={startVoiceInput}
          disabled={isListening}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
        >
          {isListening ? t.listening : '🎤 ' + t.voiceInput}
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? t.analyzing : t.analyzeSymptoms}
        </button>
      </div>
    </form>
  );
};

export default SymptomInput;
