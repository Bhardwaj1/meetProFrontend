import { useState } from "react";
import Button from "../common/Button";

export default function ChatPanel() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    if (!message.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        text: message,
        sender: "You",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    setMessage("");
  };

  return (
    <div className="h-full flex flex-col bg-[#0f172a] text-white">
      
      {/* HEADER */}
      <div className="px-4 py-3 border-b border-white/10 bg-white/5">
        <h2 className="font-semibold">Meeting Chat</h2>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-600">
        {messages.length === 0 && (
          <p className="text-gray-400 text-sm text-center">
            No messages yet
          </p>
        )}

        {messages.map((msg, i) => (
          <div key={i} className="flex flex-col">
            <span className="text-xs text-blue-400">
              {msg.sender} • {msg.time}
            </span>
            <div className="bg-white/10 px-3 py-2 rounded-lg mt-1 text-sm">
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="p-3 border-t border-white/10 flex gap-2 bg-white/5">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
}
