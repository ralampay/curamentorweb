import React, { useState } from "react";
import { chat } from "./services/BlueQuillService";

const DEFAULT_MESSAGES = [
  {
    role: "assistant",
    content: "Ask me about any publication in the system and I will summarize the details, date, or file status."
  }
];

export default BlueQuill = () => {
  const [messages, setMessages] = useState(DEFAULT_MESSAGES);
  const [draft, setDraft] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const escapeHtml = (value) => {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  };

  const renderMarkdown = (value) => {
    if (!value) {
      return "";
    }

    let html = escapeHtml(value);
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
    html = html.replace(/__([^\n]+?)__/g, "<strong>$1</strong>");
    html = html.replace(/_(.+?)_/g, "<em>$1</em>");
    html = html.replace(/^### (.*)$/gm, "<h4>$1</h4>");
    html = html.replace(/^## (.*)$/gm, "<h3>$1</h3>");
    html = html.replace(/^# (.*)$/gm, "<h2>$1</h2>");
    html = html.replace(/^\- (.*)$/gm, "<li>$1</li>");
    html = html.replace(/\n/g, "<br/>");
    return html;
  };

  const handleSend = () => {
    if (!draft.trim()) {
      return;
    }

    const userMessage = { role: "user", content: draft.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setDraft("");
    setIsProcessing(true);

    chat(draft.trim()).then((response) => {
      console.log(response);
      const answer = response.data?.answer || "I received your question and pushed it to the knowledge core.";
      const assistantReply = {
        role: "assistant",
        content: answer
      };

      setMessages((prev) => [...prev, assistantReply]);
    }).catch((error) => {
      console.error("BlueQuill chat error", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong while fetching the response."
        }
      ]);
    }).finally(() => {
      setIsProcessing(false);
    });
  };

  return (
    <div
      className="vh-100 d-flex align-items-center justify-content-center"
      style={{ background: "linear-gradient(180deg, #e0f2fe, #dbeafe 40%, #c7d2fe)" }}
    >
      <div
        className="bluequill-card shadow-lg rounded-4 p-4 d-flex flex-column"
        style={{
          width: "min(960px, 98vw)",
          height: "90vh",
          backgroundColor: "white",
          border: "1px solid rgba(15, 118, 255, 0.2)"
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
          className="border rounded-3 p-3 mb-3 flex-grow-1 overflow-auto"
          style={{
            backgroundColor: "#f8fafc",
            borderColor: "rgba(15, 118, 255, 0.2)"
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
              <div
                className="mb-0"
                style={{ lineHeight: 1.6, color: "#0f172a" }}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
              />
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
          <button className="btn btn-primary" onClick={handleSend} disabled={!draft.trim() || isProcessing}>
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
