import React, { useState } from "react";
import { getCompletion } from "../utils/openrouter";
import { useAppStore } from "../store/appStore";
import Button from "./common/Button";
import Icon from "./common/Icon";
import { Message } from "@/types";
import { useNavigate } from "react-router-dom";

const ChatPopup: React.FC = () => {
  const isChatOpen = useAppStore((state) => state.isChatOpen);
  const chatMessages = useAppStore((state) => state.chatMessages);
  const toggleChat = useAppStore((state) => state.toggleChat);
  const addChatMessage = useAppStore((state) => state.addChatMessage);
  const setChatMessages = useAppStore((state) => state.setChatMessages);
  const settings = useAppStore((state) => state.settings);
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!settings.openRouterApiKey) {
      addChatMessage({
        role: "assistant",
        content:
          "OpenRouter API key is not set. Please set it in the settings page to use AI features.",
      });
      return;
    }
    if (!input.trim()) return;

    const newMessages: Message[] = [
      ...chatMessages,
      { role: "user", content: input },
    ];
    setChatMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const completion = await getCompletion(newMessages);
      addChatMessage({ role: "assistant", content: completion });
    } catch (error) {
      console.error(error);
      addChatMessage({
        role: "assistant",
        content: "Sorry, I had trouble getting a response.",
      });
    }
    setLoading(false);
  };

  if (!isChatOpen) {
    return (
      <Button
        onClick={() => toggleChat(true)}
        className="fixed bottom-24 right-4 rounded-full h-16 w-16 flex items-center justify-center bg-primaryDark text-white shadow-lg"
      >
        <Icon name="messageCircle" size={24} />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-24 right-4 w-80 h-96 bg-cardLight dark:bg-cardDark rounded-lg shadow-lg flex flex-col">
      <div className="p-4 border-b border-primaryLight/50 dark:border-primaryDark/40 flex justify-between items-center">
        <h3 className="font-semibold">AI Assistant</h3>
        <Button onClick={() => toggleChat(false)} variant="ghost" size="sm">
          <Icon name="x" size={20} />
        </Button>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            className={`flex mb-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-2 rounded-lg max-w-xs ${msg.role === "user" ? "bg-primaryDark text-white" : "bg-gray-200 dark:bg-gray-700"}`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700">
              ...
            </div>
          </div>
        )}
      </div>
      <div className="p-4 border-t border-primaryLight/50 dark:border-primaryDark/40">
        {settings.openRouterApiKey ? (
          <div className="flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-grow p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primaryDark"
              placeholder="Ask me anything..."
              disabled={loading}
            />
            <Button onClick={handleSend} className="rounded-l-none" disabled={loading}>
              <Icon name="send" size={20} />
            </Button>
          </div>
        ) : (
          <div className="text-center text-sm text-red-500 dark:text-red-400">
            Please set your OpenRouter API key in the{" "}
            <span
              className="font-semibold underline cursor-pointer"
              onClick={() => {
                toggleChat(false); // Close chat when navigating to settings
                navigate("/settings");
              }}
            >
              Settings
            </span>{" "}
            to use the AI chat.
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPopup;
