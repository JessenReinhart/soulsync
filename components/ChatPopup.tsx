import React, { useState } from "react";
import { getCompletion } from "../utils/openrouter";
import { useAppStore } from "../store/appStore";
import Button from "./common/Button";
import Icon from "./common/Icon";

const ChatPopup: React.FC = () => {
  const {
    isChatOpen,
    chatMessages,
    toggleChat,
    addChatMessage,
    setChatMessages,
  } = useAppStore();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...chatMessages, { role: "user", content: input }];
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
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-grow p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primaryDark"
            placeholder="Ask me anything..."
          />
          <Button onClick={handleSend} className="rounded-l-none">
            <Icon name="send" size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPopup;
