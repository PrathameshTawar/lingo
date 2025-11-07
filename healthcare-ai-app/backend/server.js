const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAI = require('openai');
const axios = require('axios');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Mock Lingo Compiler translation (for hackathon demo)
async function translateText(text, fromLang, targetLang) {
  try {
    // Simple mock translation using predefined dictionaries
    const translations = {
      en: {
        es: {
          'headache': 'dolor de cabeza',
          'fever': 'fiebre',
          'cough': 'tos',
          'stomach pain': 'dolor de estómago',
          'Analysis Results': 'Resultados del Análisis',
          'Local Doctor Recommendations': 'Recomendaciones de Médicos Locales',
          'Download Report': 'Descargar Informe',
          'Share Report': 'Compartir Informe',
          'Select Language': 'Seleccionar Idioma',
          'Describe your symptoms': 'Describe tus síntomas',
          'Get local doctor recommendations': 'Obtener recomendaciones de médicos locales',
          'Voice Input': 'Entrada de Voz',
          'Analyze Symptoms': 'Analizar Síntomas',
          'Healthcare AI Assistant': 'Asistente de IA para la Salud',
        },
        fr: {
          'headache': 'mal de tête',
          'fever': 'fièvre',
          'cough': 'toux',
          'stomach pain': 'douleur d\'estomac',
          'Analysis Results': 'Résultats de l\'Analyse',
          'Local Doctor Recommendations': 'Recommandations de Médecins Locaux',
          'Download Report': 'Télécharger le Rapport',
          'Share Report': 'Partager le Rapport',
          'Select Language': 'Sélectionner la Langue',
          'Describe your symptoms': 'Décrivez vos symptômes',
          'Get local doctor recommendations': 'Obtenir des recommandations de médecins locaux',
          'Voice Input': 'Entrée Vocale',
          'Analyze Symptoms': 'Analyser les Symptômes',
          'Healthcare AI Assistant': 'Assistant IA pour la Santé',
        },
        // Add more languages as needed
      },
      // Add reverse translations if needed
    };

    if (fromLang === targetLang) return text;

    const langMap = translations[fromLang] && translations[fromLang][targetLang];
    if (langMap) {
      // Simple word-by-word translation
      const words = text.toLowerCase().split(' ');
      const translatedWords = words.map(word => langMap[word] || word);
      return translatedWords.join(' ');
    }

    // Fallback: return original text
    return text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}

// Route for symptom analysis
app.post('/api/analyze-symptoms', async (req, res) => {
  const { symptoms, language } = req.body;

  try {
    // Translate symptoms to English for AI analysis
    const translatedSymptoms = await translateText(symptoms, 'en');

    // Use OpenAI to analyze symptoms
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful medical assistant. Provide basic guidance on symptoms, possible causes, home remedies, and advise seeing a doctor if needed. Keep responses concise.' },
        { role: 'user', content: `Symptoms: ${translatedSymptoms}` },
      ],
      max_tokens: 300,
    });

    const analysis = completion.choices[0].message.content;

    // Translate analysis back to user's language
    const translatedAnalysis = await translateText(analysis, language);

    res.json({ analysis: translatedAnalysis });
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    res.status(500).json({ error: 'Failed to analyze symptoms' });
  }
});

// Route for local recommendations (nearby doctors)
app.post('/api/local-recommendations', async (req, res) => {
  const { lat, lng, language } = req.body;

  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
        location: `${lat},${lng}`,
        radius: 5000, // 5km radius
        type: 'doctor',
        key: apiKey,
      },
    });

    const places = response.data.results.slice(0, 5).map(place => ({
      name: place.name,
      address: place.vicinity,
      rating: place.rating,
    }));

    // Translate place names and addresses if needed
    const translatedPlaces = await Promise.all(places.map(async place => ({
      name: await translateText(place.name, 'en', language),
      address: await translateText(place.address, 'en', language),
      rating: place.rating,
    })));

    res.json({ recommendations: translatedPlaces });
  } catch (error) {
    console.error('Error fetching local recommendations:', error);
    res.status(500).json({ error: 'Failed to fetch local recommendations' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
