
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendMessage,
  addUserMessage,
  clearChat,
  setSelectedModel,
} from "../features/chat/chatSlice";

const Home = ({ availableModels: propsModels, loading: modelsLoading }) => {
  const dispatch = useDispatch();

  const {
    messages,
    loading,
    error,
    selectedModel,
    availableModels: storeModels,
  } = useSelector((state) => state.chat);

  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);

  const models = propsModels?.length > 0 ? propsModels : storeModels;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage;
    setInputMessage("");

    dispatch(addUserMessage(userMessage));
    try {
      await dispatch(sendMessage(userMessage)).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  return (
   <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">

    {/* Container */}
    <div className="w-full max-w-5xl h-[95vh] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
          <h2 className="font-semibold">ChatBot</h2>
          <button
            onClick={() => dispatch(clearChat())}
            className="text-sm opacity-80 hover:opacity-100"
          >
            Clear
          </button>
        </div>

        {/* Model Select */}
        <div className="p-2 border-b">
          <select
            value={selectedModel}
            onChange={(e) => dispatch(setSelectedModel(e.target.value))}
            className="w-full p-2 text-sm border rounded-lg outline-none"
          >
            <option value="">Select Model</option>
            {models?.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 text-sm rounded-2xl max-w-[75%] ${
                  msg.role === "user"
                    ? "bg-cyan-400 text-white rounded-br-none"
                    : "bg-white border text-gray-700 rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Typing */}
          {loading && (
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
            </div>
          )}

          {error && (
            <div className="text-red-400 text-xs text-center">{error}</div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSendMessage}
          className="p-2 flex items-center gap-2 border-t bg-white"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message"
            disabled={!selectedModel || loading}
            className="flex-1 px-3 py-2 text-sm border rounded-full outline-none"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || !selectedModel || loading}
            className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:scale-105 transition"
          >
            ➤
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;