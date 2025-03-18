import { useState, useEffect } from "react";

export default function ChatApp() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!conversationId) {
      setConversationId(Date.now().toString());
    }
  }, [conversationId]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);
    const res = await fetch(`${process.env.REACT_APP_ENDPOINT}/chat/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, conversation_id: conversationId }),
    });
    const data = await res.json();

    setChatHistory([...chatHistory, { user: message, bot: data.response }]);
    setMessage("");
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center p-6 w-[800px] h-[600px] border rounded-lg shadow-lg bg-white">
        <h1 className="text-xl font-bold mb-4"> CHATBOT </h1>

        {/* Chat History */}
        <div className="w-full h-[400px] border p-4 rounded overflow-y-auto bg-gray-100">
          {chatHistory.map((chat, index) => (
            <div key={index} className="mb-2">
              <p className="text-blue-500">You: {chat.user}</p>
              <p className="text-green-500">Assistant: {chat.bot}</p>
            </div>
          ))}
        </div>
        {loading && <div>Assistant is typing...</div>}
        {/* Input Box & Send Button */}
        <div className="w-full mt-2 flex gap-2">
          {!loading && (
            <>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="border p-2 rounded flex-grow"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Send
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
