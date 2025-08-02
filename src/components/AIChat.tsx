import React, { useState } from 'react';
import { Send, Bot, User, Loader } from 'lucide-react';
import { chatAPI } from '../services/api';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI assistant. I can help you with questions about feedback management, customer service, or any general inquiries. How can I assist you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError('');

    try {
      const response = await chatAPI.sendMessage(userMessage.text);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.data.response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to get AI response. Please try again.');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please make sure the OpenAI API key is configured and try again.",
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">AI Assistant</h2>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="h-80 overflow-y-auto mb-6 space-y-4 bg-gray-50 rounded-xl p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.isUser 
                  ? 'bg-blue-500' 
                  : 'bg-gradient-to-r from-green-500 to-emerald-500'
              }`}>
                {message.isUser ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              
              <div className={`rounded-2xl px-4 py-3 ${
                message.isUser
                  ? 'bg-blue-500 text-white'
                  : 'bg-white border border-gray-200 text-gray-800'
              }`}>
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p className={`text-xs mt-2 ${
                  message.isUser ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader className="w-4 h-4 animate-spin text-gray-500" />
                <span className="text-sm text-gray-500">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-3">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask me anything about feedback management or customer service..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isLoading}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isLoading ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
};