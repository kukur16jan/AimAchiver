import React, { useState, useEffect } from 'react';
import { X, Brain } from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
}

const CHAT_HISTORY_KEY = 'aimAchiever_ai_chat_history';

const AIAssistant = ({ onClose }: { onClose: () => void }) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState<ChatMessage[]>([]);

  // Load chat history on mount
  useEffect(() => {
    const saved = localStorage.getItem(CHAT_HISTORY_KEY);
    if (saved) setChat(JSON.parse(saved));
  }, []);

  // Save chat history on change
  useEffect(() => {
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(chat));
  }, [chat]);

  // Parse Gemini markdown-like text to HTML
  function parseGeminiMarkdown(text: string): string {
    if (!text) return '';
    let html = text;
    // Bold: **text**
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic: *text*
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Headings: lines starting with #
    html = html.replace(/^### (.*)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*)$/gm, '<h1>$1</h1>');
    // Unordered lists: lines starting with * or -
    html = html.replace(/^(\s*)\* (.*)$/gm, '$1<li>$2</li>');
    html = html.replace(/^(\s*)- (.*)$/gm, '$1<li>$2</li>');
    // Ordered lists: lines starting with 1. 2. etc.
    html = html.replace(/^(\s*)\d+\. (.*)$/gm, '$1<li>$2</li>');
    // Wrap consecutive <li> in <ul> or <ol>
    html = html.replace(/(<li>.*?<\/li>\s*)+/gs, match => `<ul>${match}</ul>`);
    // Paragraphs: double newlines
    html = html.replace(/\n{2,}/g, '</p><p>');
    // Single newlines to <br>
    html = html.replace(/\n/g, '<br>');
    // Wrap in <p> if not already block
    if (!/^<h|<ul|<ol|<p|<li/.test(html.trim())) {
      html = `<p>${html}</p>`;
    }
    return html;
  }

  const handleAsk = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: question,
      timestamp: new Date().toISOString(),
    };
    setChat(prev => [...prev, userMsg]);
    try {
      const res = await fetch('https://aim-achiever-backend.vercel.app/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });
      const data = await res.json();
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.answer || 'No answer received.',
        timestamp: new Date().toISOString(),
      };
      setChat(prev => [...prev, aiMsg]);
    } catch (err) {
      setChat(prev => [...prev, {
        id: (Date.now() + 2).toString(),
        type: 'ai',
        content: 'Error contacting AI.',
        timestamp: new Date().toISOString(),
      }]);
    }
    setQuestion('');
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full h-[600px] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="w-6 h-6" />
              <h2 className="text-xl font-semibold">AI Productivity Assistant</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Section */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {chat.length === 0 && (
            <div className="text-gray-400 text-center">No chat history yet. Ask your first question!</div>
          )}
          {chat.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl mb-2 ${msg.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'}`}>
                {msg.type === 'ai' ? (
                  <span className="text-sm" dangerouslySetInnerHTML={{ __html: parseGeminiMarkdown(msg.content) }} />
                ) : (
                  <p className="text-sm whitespace-pre-line">{msg.content}</p>
                )}
                <div className="text-xs text-gray-400 mt-1 text-right">{new Date(msg.timestamp).toLocaleTimeString()}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="text-emerald-700 ml-2">Thinking...</span>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleAsk} className="p-6 border-t border-gray-200">
          <div className="flex space-x-3">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask me anything about your goals or tasks..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Thinking...' : 'Ask'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;