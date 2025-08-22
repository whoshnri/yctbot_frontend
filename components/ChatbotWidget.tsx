// components/ChatbotWidget.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize, MessageCircle, Minimize, X, Send, Bot } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessage {
  id: number;
  text: string;
  sender: "user" | "bot";
}



export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [maximize, setMaximize] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const startRef = useRef<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const toggleWidget = () => setIsOpen(!isOpen);
  const toggleMaximize = () => setMaximize(!maximize);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
      return null;
    };

    let token = getCookie("user_token");
    if (!token) {
      token = crypto.randomUUID();
      document.cookie = `user_token=${token}; path=/; max-age=${
        60 * 60 * 24 * 365
      };`;
    }

    setUserToken(token);
  }, []);
  useEffect(() => {
    if (isOpen) {
      startRef.current = Date.now();
    } else if (startRef.current) {
      const now = Math.floor((Date.now() - startRef.current) / 1000);
      sendDuration(now);
      startRef.current = null;
    }
  }, [isOpen]);

  async function sendDuration(durationSec: number) {
    try {
      const response = await fetch(`${API_URL}/session-duration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ duration: durationSec, session_id: userToken }),
      });
      const data = await response.json();
      console.log("Server response:", data);
    } catch (err) {
      console.error("Error sending duration:", err);
    }
  }

  const sendMessage = async () => {
    if (!input.trim()) return; 
    const userMessage: ChatMessage = {
      id: messages.length + 1,
      text: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);
    console.log("User message added:", userMessage);

    try {
      const response = await fetch(`${API_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput, history: messages }),
      });

      const data = await response.json();
      console.log("Raw response from server:", data);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const botMessage: ChatMessage = {
        id: messages.length + 2,
        text: data.response,
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
      console.log("Bot message added:", botMessage);
    } catch (error) {
      console.error("Error fetching bot response:", error);

      const errorMessage: ChatMessage = {
        id: messages.length + 2,
        text: "⚠️ Sorry, something went wrong. Please try again.",
        sender: "bot",
      };

      setMessages((prev) => [...prev, errorMessage]);
      console.log("Error message added:", errorMessage);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating Button */}
      <Button
        onClick={toggleWidget}
        className="rounded-full bg-green-600 hover:bg-green-700 transition-all duration-300 w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <div className="relative">
          {isOpen ? (
            <X className="text-white w-5 h-5" />
          ) : (
            <MessageCircle className="text-white w-5 h-5" />
          )}
          {/* Notification dot when closed and has messages */}
          {!isOpen && messages.length > 0 && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          )}
        </div>
      </Button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.3,
            }}
            className={`absolute z-50 bg-white border border-green-300 shadow-2xl rounded-2xl flex flex-col overflow-hidden right-0 transition-all ${
              maximize
                ? "w-[100vh] h-[90vh] bottom-0"
                : "w-80 h-[500px] bottom-16"
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 relative items-center cursor-pointer flex justify-between text-white text-center p-4 font-semibold shadow-sm">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <span className="text-sm font-medium">YCT Chatbot</span>
              </div>
              <div className="lg:flex hidden items-center gap-2">
                {!maximize ? (
                  <Maximize
                    onClick={toggleMaximize}
                    className="w-4 h-4 hover:scale-110 cursor-pointer transition-transform duration-200 hover:bg-green-800 rounded p-0.5"
                    aria-label="Maximize chat"
                  />
                ) : (
                  <Minimize
                    onClick={toggleMaximize}
                    className="w-4 h-4 hover:scale-110 cursor-pointer transition-transform duration-200 hover:bg-green-800 rounded p-0.5"
                    aria-label="Minimize chat"
                  />
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gradient-to-b from-green-50 to-white scrollbar-thin scrollbar-thumb-green-300 scrollbar-track-green-100">
              {/* Welcome message */}
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-3 h-3 text-green-600" />
                </div>
                <div className="p-3 max-w-[80%] text-sm bg-white border rounded-2xl rounded-tl-md border-green-200 text-gray-700 shadow-sm">
                  Welcome to YCT Chatbot! How can I assist you today?
                </div>
              </div>

              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "items-start gap-2"
                  }`}
                >
                  {msg.sender === "bot" && (
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-3 h-3 text-green-600" />
                    </div>
                  )}
                  <div
                    className={`p-3 max-w-[80%] text-sm transition-all duration-200 ${
                      msg.sender === "user"
                        ? "bg-green-600 text-white rounded-2xl rounded-br-md shadow-md"
                        : "bg-white border rounded-2xl rounded-tl-md border-green-200 text-gray-700 shadow-sm"
                    }`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      // className="prose prose-sm max-w-none prose-p:m-0 prose-ul:m-0 prose-ol:m-0"
                    >
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-start gap-2"
                  >
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-3 h-3 text-green-600" />
                    </div>
                    <div className="p-3 bg-white border rounded-2xl rounded-tl-md border-green-200 shadow-sm">
                      <div className="flex space-x-1">
                        <div
                          className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <div
                          className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <div
                          className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex items-center border-t border-green-200 bg-white p-3 gap-2">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1 rounded-full border-green-300 focus-visible:ring-green-500 focus-visible:border-green-500 px-4 py-2 text-sm"
                disabled={isTyping}
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isTyping}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 rounded-full px-4 py-2 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
