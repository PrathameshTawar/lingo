# Healthcare AI Assistant

A multilingual healthcare AI assistant that analyzes symptoms and provides local doctor recommendations.

## Features

- Symptom analysis using OpenAI GPT
- Multilingual support (English, Spanish, French, etc.)
- Voice input for symptoms
- Local doctor recommendations via Google Maps API
- Offline caching with service worker
- Dark mode toggle

## Setup

### Backend

1. Navigate to the backend directory:
   ```
   cd healthcare-ai-app/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   OPENAI_API_KEY=your_openai_api_key
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   PORT=5000
   ```

4. Start the backend server:
   ```
   npm start
   ```

### Frontend

1. Navigate to the frontend directory:
   ```
   cd healthcare-ai-app/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm start
   ```

The app will be available at `http://localhost:3000`.

## Deployment

### Backend
- Deploy to a Node.js hosting service (e.g., Heroku, Railway, Render).
- Ensure environment variables are set in the hosting platform.

### Frontend
- Build the app:
  ```
  npm run build
  ```
- Deploy the `build` folder to a static hosting service (e.g., Vercel, Netlify, GitHub Pages).

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key for symptom analysis.
- `GOOGLE_MAPS_API_KEY`: Your Google Maps API key for local recommendations.
- `PORT`: Port for the backend server (default: 5000).

## Technologies Used

- **Frontend**: React, Tailwind CSS, Service Worker
- **Backend**: Node.js, Express, OpenAI API, Google Maps API
- **Translation**: Custom mock translation system

## License

This project is for educational purposes only and should not be used for actual medical advice.
