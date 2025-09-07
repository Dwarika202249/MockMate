import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const ChatPanel = ({ messages = [] }) => {
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="bg-white rounded-lg shadow p-4 h-[70vh] overflow-y-auto">
      <h4 className="text-lg font-semibold text-indigo-900 mb-3">Live Conversation</h4>
      <div className="space-y-3">
        {messages.map((m) => (
          <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`${m.sender === "ai" ? "text-left" : m.sender === "user" ? "text-right" : "text-center"}`}>
            <div className={`inline-block px-3 py-2 rounded-lg ${m.sender === "ai" ? "bg-indigo-50 text-indigo-900" : m.sender === "user" ? "bg-green-50 text-green-900" : "bg-gray-100 text-gray-700"}`}>
              {m.text}
            </div>
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ChatPanel;
