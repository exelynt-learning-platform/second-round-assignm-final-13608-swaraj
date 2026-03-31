

import axios from "axios";
import { useEffect, useState } from "react";
import Home from "./pages/Home";


function App() {
  // const API_KEY = "AIzaSyB1XT3ek-ACQrvSYJMebDSNLdBB6Ti4Apg";
  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY ;
  const [availableModels, setAvailableModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const testGeminiAPI = async () => {
    try {
      // Test available models
      const response = await axios.get(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
      );

      console.log("✅ All available models:", response.data.models);
      
      // Filter models that support generateContent
      const generateContentModels = response.data.models.filter(model => 
        model.supportedGenerationMethods?.includes("generateContent")
      );
      
      console.log("📝 Models supporting generateContent:", generateContentModels);
      
      // Display model names
      const modelNames = generateContentModels.map(model => model.name.replace("models/", ""));
      console.log("🚀 Available model names to use:", modelNames);
      
      setAvailableModels(generateContentModels);
      setError(null);
      
    } catch (error) {
      console.error("❌ API Test Failed:", error.response?.data || error.message);
      setError(error.response?.data?.error?.message || "Failed to fetch models");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testGeminiAPI();
  }, []);

  return (
    <div className="">
      {/* Header */}
      {/* <header className="bg-blue-600 text-white p-4 text-center shadow">
        <h1 className="font-bold text-lg">Chatbox AI 🤖</h1>
        {!loading && availableModels.length > 0 && (
          <p className="text-xs mt-1 opacity-90">
            Available Models: {availableModels.map(m => m.name.replace("models/", "")).join(", ")}
          </p>
        )}
        {error && (
          <p className="text-xs mt-1 text-yellow-200">
            Error: {error}
          </p>
        )}
      </header> */}

      {/* Main Chat */}
      <h1 className="text-3xl text-red-500">Test Tailwind</h1>
      <div className="flex-1">
        <Home 
          availableModels={availableModels} 
          loading={loading} 
          apiKey={API_KEY}
        />
      </div>
    </div>
  );
}

export default App;