import React, { useState } from "react";

const DEFAULT_MESSAGES = [
  {
    role: "assistant",
    content: "Ask me about any publication in the system and I will summarize the details, date, or file status."
  }
];

export default BlueQuill = () => {
  const [messages, setMessages] = useState(DEFAULT_MESSAGES);
  const [draft, setDraft] = useState("");

  const handleSend = () => {
    if (!draft.trim()) {
      return;
    }

    const userMessage = { role: "user", content: draft.trim() };
    const assistantReply = {
      role: "assistant",
      content: "I don't have live data, but I can mock a response: the requested publication is listed in the library and its PDF is ready to download."
    };

    setMessages((prev) => [...prev, userMessage, assistantReply]);
    setDraft("");
  };

  return (
    <div
      className="vh-100 d-flex align-items-center justify-content-center"
      style={{ background: "linear-gradient(180deg, #e2e8ff, #e0f2fe 50%, #bfdbfe)" }}
    >
      <div
        className="bluequill-card shadow-lg rounded-4 p-4"
        style={{
          width: "min(700px, 90vw)",
          backgroundColor: "white",
          border: "1px solid rgba(15, 118, 255, 0.15)"
        }}
      >
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <p className="text-uppercase text-muted small mb-1">Blue Quill</p>
            <h1 className="h3 mb-0">Publication page assistant</h1>
          </div>
          <span className="badge text-bg-primary">Ad-hoc</span>
        </div>

        <div
          className="border rounded-3 p-3 mb-3"
          style={{
            minHeight: "320px",
            backgroundColor: "#e0f2fe",
            borderColor: "rgba(15, 118, 255, 0.3)"
          }}
        >
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className="mb-3 p-3 rounded-3"
              style={{
                backgroundColor: message.role === "assistant" ? "#bfdbfe" : "#f1f5f9"
              }}
            >
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className={`badge ${message.role === "assistant" ? "bg-primary" : "bg-light"} text-dark`}>
                  {message.role === "assistant" ? "Blue Quill" : "You"}
                </span>
                <small className="text-muted">
                  {message.role === "assistant" ? "Assistant" : "User"}
                </small>
              </div>
              <p className="mb-0" style={{ lineHeight: 1.6, color: "#0f172a" }}>
                {message.content}
              </p>
            </div>
          ))}
        </div>

        <div className="d-flex gap-2">
          <input
            className="form-control"
            placeholder="Ask about a publication"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleSend();
              }
            }}
          />
          <button className="btn btn-primary" onClick={handleSend} disabled={!draft.trim()}>
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
