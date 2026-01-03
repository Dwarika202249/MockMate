import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { HiDownload, HiTrash } from "react-icons/hi";

const ChatPanel = ({ messages = [] }) => {
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-4 h-[70vh] overflow-y-auto flex flex-col shadow-[0_8px_32px_rgba(168,85,247,0.08)]">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300">
          Live Conversation
        </h4>
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition" title="Download transcript">
            <HiDownload className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition" title="Clear chat">
            <HiTrash className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-end gap-3 ${
              m.sender === "ai"
                ? "justify-start"
                : m.sender === "user"
                ? "justify-end"
                : "justify-center"
            }`}
          >
            {m.sender === "ai" && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500 text-white">🤖</div>
            )}

            <div
              className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                m.sender === "ai"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-bl-none"
                  : m.sender === "user"
                  ? "bg-gradient-to-r from-green-500 to-teal-400 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {m.text}
              {m.timestamp && <div className="text-xs text-gray-200 mt-1">{new Date(m.timestamp).toLocaleTimeString()}</div>}
            </div>

            {m.sender === "user" && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-green-400 to-emerald-500 text-white">🙋‍♂️</div>
            )}
          </motion.div>
        ))}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ChatPanel;
