import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async API call with Gemini 2.5 Flash
export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (message, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const API_KEY = process.env.REACT_APP_GEMINI_API_KEY ;
      const MODEL_NAME = state.chat.selectedModel || "gemini-2.5-flash";
      
      console.log(`📤 Sending to ${MODEL_NAME}:`, message);
      
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`,
        {
          contents: [{
            parts: [{ text: message }]
          }],
          generationConfig: {
            temperature: 1.0,
            maxOutputTokens: 65536, // Using the model's output limit
            topP: 0.95,
            topK: 64,
          }
        }
      );

      console.log("📥 API Response:", response.data);
      
      // Extract the response text
      if (response.data.candidates && response.data.candidates[0]) {
        const candidate = response.data.candidates[0];
        
        if (candidate.content && candidate.content.parts && candidate.content.parts[0]) {
          const aiResponse = candidate.content.parts[0].text;
          console.log("✅ Extracted Response:", aiResponse);
          return aiResponse;
        } else if (candidate.text) {
          return candidate.text;
        } else {
          throw new Error("Unexpected response format");
        }
      } else {
        throw new Error("No response from API");
      }
      
    } catch (error) {
      console.error("❌ API Error:", error.response?.data || error.message);
      let errorMessage = "Failed to get response";
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

// Async function to fetch available models
export const fetchAvailableModels = createAsyncThunk(
  "chat/fetchModels",
  async (_, { rejectWithValue }) => {
    try {
      const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
      const response = await axios.get(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
      );
      
      console.log("📚 All models:", response.data.models);
      
      // Filter for models that support generateContent
      const generateContentModels = response.data.models.filter(model => 
        model.supportedGenerationMethods?.includes("generateContent")
      );
      
      console.log("✅ Models with generateContent:", generateContentModels.map(m => m.name));
      
      return generateContentModels.map(model => ({
        id: model.name.replace("models/", ""),
        name: model.displayName || model.name.replace("models/", ""),
        description: model.description,
        version: model.version,
        inputTokenLimit: model.inputTokenLimit,
        outputTokenLimit: model.outputTokenLimit,
        temperature: model.temperature,
        topP: model.topP,
        topK: model.topK
      }));
    } catch (error) {
      console.error("❌ Error fetching models:", error);
      return rejectWithValue(error.response?.data || "Failed to fetch models");
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    loading: false,
    error: null,
    availableModels: [],
    selectedModel: "gemini-2.5-flash", // Default to Gemini 2.5 Flash
    modelDetails: null,
  },
  reducers: {
    addUserMessage: (state, action) => {
      state.messages.push({ role: "user", content: action.payload });
    },
    clearChat: (state) => {
      state.messages = [];
      state.error = null;
    },
    setSelectedModel: (state, action) => {
      state.selectedModel = action.payload;
      // Find and store model details
      state.modelDetails = state.availableModels.find(m => m.id === action.payload);
      console.log(`🔄 Model changed to: ${action.payload}`);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({ 
          role: "assistant", 
          content: action.payload 
        });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAvailableModels.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAvailableModels.fulfilled, (state, action) => {
        state.loading = false;
        state.availableModels = action.payload;
        // Set model details for selected model
        state.modelDetails = action.payload.find(m => m.id === state.selectedModel);
      })
      .addCase(fetchAvailableModels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addUserMessage, clearChat, setSelectedModel } = chatSlice.actions;
export default chatSlice.reducer;