import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Loader2, 
  FileText, 
  Calendar, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { askAssistant } from '../services/api';

export default function ChatDrawer({ isOpen, onClose, profile, schemes = [] }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I am Right2Know AI, your scholarship guidance assistant. I can help clarify document prerequisites, deadline timelines, and specific eligibility requirements across your matched opportunities.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const quickPrompts = [
    { label: '📄 Required Documents', text: 'Which documents should I prepare for these scholarships?' },
    { label: '⏰ Earliest Deadline', text: 'Which scholarship closes first?' },
    { label: '💡 Why Eligible?', text: 'Why am I eligible for these scholarships?' },
    { label: '💰 Highest Award', text: 'Which scholarship offers the highest financial benefit?' }
  ];

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputValue).trim();
    if (!query || loading) return;

    const userMessage = {
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await askAssistant(profile, query, schemes);
      
      const assistantMessage = {
        role: 'assistant',
        content: response?.answer || "I couldn't find specific details for that query. Please check the official scheme page.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          isError: true,
          content: "The AI assistant is operating in offline mode. Your deterministic matching results remain active on the results page!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="AI Scholarship Assistant">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-2xl h-full shadow-[0_25px_60px_rgba(15,23,42,0.15)] flex flex-col z-10 animate-in slide-in-from-right duration-300 border-l border-white/80 text-slate-800">
        
        {/* Drawer Header */}
        <div className="p-5 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold shadow-sm">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                Right2Know AI Assistant
              </h3>
              <p className="text-xs text-slate-500">
                Ground-truth scholarship guidance
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors focus:outline-none"
            aria-label="Close AI chat drawer"
            id="chat-drawer-close-button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Context Pill */}
        {profile && profile.course && (
          <div className="bg-indigo-50/70 border-b border-indigo-100 px-5 py-2.5 text-xs text-indigo-900 flex items-center justify-between">
            <span className="truncate">
              <strong>Context:</strong> {profile.course} • Yr {profile.year} • {profile.state}
            </span>
            <span className="text-[11px] font-bold text-indigo-700 shrink-0 ml-2">
              {schemes.length} matched
            </span>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div 
                key={index}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs font-bold text-xs">
                    AI
                  </div>
                )}

                <div className={`max-w-[85%] rounded-[1.5rem] p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                  isUser 
                    ? 'bg-slate-900 text-white font-medium rounded-br-none' 
                    : msg.isError
                      ? 'bg-amber-50 border border-amber-200 text-amber-900 rounded-bl-none'
                      : 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-none'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <span className={`block text-[10px] mt-1.5 ${isUser ? 'text-slate-400 text-right' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs font-bold text-xs">
                    You
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none p-3.5 shadow-sm flex items-center gap-2 text-xs text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span>Formulating personalized answer...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Query Capsules */}
        <div className="p-3.5 bg-white border-t border-slate-100">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Suggested Queries
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {quickPrompts.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(item.text)}
                disabled={loading}
                className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-100">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about required documents, deadlines..."
              disabled={loading}
              maxLength={1000}
              className="flex-1 bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
              id="chat-drawer-input"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className="p-3 rounded-2xl bg-slate-900 text-white hover:bg-indigo-900 disabled:opacity-40 active:scale-95 transition-all shadow-md shrink-0 cursor-pointer"
              aria-label="Send message"
              id="chat-drawer-send-button"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-white" />
              ) : (
                <Send className="w-5 h-5 text-white" />
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
