import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const ChatPanel = ({ messages = [] }) => {
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="bg-white rounded-lg shadow p-4 h-[70vh] overflow-y-auto flex flex-col">
      <h4 className="text-lg font-semibold text-indigo-900 mb-3">
        Live Conversation
      </h4>

      <div className="flex-1 space-y-4">
        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-end gap-2 ${
              m.sender === "ai"
                ? "justify-start"
                : m.sender === "user"
                ? "justify-end"
                : "justify-center"
            }`}
          >
            {/* AI bubble */}
            {m.sender === "ai" && (
              <span className="text-xl">🤖</span>
            )}

            <div
              className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                m.sender === "ai"
                  ? "bg-indigo-100 text-indigo-900 rounded-bl-none"
                  : m.sender === "user"
                  ? "bg-green-100 text-green-900 rounded-br-none"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {m.text}
            </div>

            {/* User bubble */}
            {m.sender === "user" && (
              <span className="text-xl">🙋‍♂️</span>
            )}
          </motion.div>
        ))}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ChatPanel;
