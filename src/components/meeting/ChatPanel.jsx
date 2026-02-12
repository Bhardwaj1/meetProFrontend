import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMeeting } from "../../context/MeetingContext";
import { useAuth } from "../../context/AuthContext";

export default function ChatPanel() {
  const { id: meetingId } = useParams();
  const { messages, sendMessage } = useMeeting();
  const { user } = useAuth();

  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(meetingId, text);
    setText("");
  };

  console.log({messages})

  // 🔥 Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-full flex flex-col bg-[#0b1220] text-white">
      {/* HEADER */}
      <div className="px-4 py-3 border-b border-white/10 bg-white/5 flex items-center justify-between">
        <h2 className="font-semibold text-sm tracking-wide">
          💬 Meeting Chat
        </h2>
        <span className="text-xs text-gray-400">
          {messages.length} messages
        </span>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.length === 0 && (
          <p className="text-gray-500 text-sm text-center mt-6">
            No messages yet
          </p>
        )}

        {messages.map((msg, i) => {
          const isMe = msg.userId === user?.id || msg.userId === user?._id;

          return (
            <div
              key={i}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-md text-sm ${
                  isMe
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-br-sm"
                    : "bg-white/10 text-gray-200 rounded-bl-sm"
                }`}
              >
                {!isMe && (
                  <p className="text-xs text-blue-400 mb-1">
                    {msg.sender}
                  </p>
                )}

                <p className="break-words">{msg.text}</p>

                <p className="text-[10px] text-right mt-1 opacity-70">
                  {msg.time}
                </p>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="p-3 border-t border-white/10 bg-white/5">
        <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 px-3 py-2 bg-transparent focus:outline-none text-sm"
            placeholder="Type message..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          <button
            onClick={handleSend}
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-xs font-medium hover:opacity-90 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
