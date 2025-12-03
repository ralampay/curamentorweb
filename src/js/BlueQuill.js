import React, { useState } from "react";
import Loader from "./commons/Loader";
import { chat } from "./services/BlueQuillService";

const DEFAULT_MESSAGES = [
  {
    role: "assistant",
    content: "Ask me about any publication in the system and I will summarize the details, date, or file status.",
    timestamp: new Date().toISOString()
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

    const userMessage = { role: "user", content: draft.trim(), timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMessage]);
    setDraft("");
    setIsProcessing(true);

    chat(draft.trim()).then((response) => {
      console.log(response);
      const answer = response.data?.answer || "I received your question and pushed it to the knowledge core.";
      const assistantReply = {
        role: "assistant",
        content: answer,
        timestamp: new Date().toISOString(),
        files: response.data?.files || [],
        authors: response.data?.authors || []
      };

      setMessages((prev) => [...prev, assistantReply]);
    }).catch((error) => {
      console.error("BlueQuill chat error", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong while fetching the response.",
          timestamp: new Date().toISOString()
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
            <h1 className="h3 mb-0">Blue Quill</h1>
          </div>
          <span className="badge bg-primary text-white">
            Blue Quill
          </span>
        </div>

        <div
          className="border rounded-3 p-3 mb-3 flex-grow-1 overflow-auto position-relative"
          style={{
            backgroundColor: "#f8fafc",
            borderColor: "rgba(15, 118, 255, 0.2)"
          }}
        >
          {isProcessing &&
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75 rounded-3">
              <Loader/>
            </div>
          }
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className="mb-3 p-3 rounded-3"
              style={{
                backgroundColor: message.role === "assistant" ? "#bfdbfe" : "#f1f5f9"
              }}
            >
              <div className="d-flex align-items-center gap-2 mb-1">
                <strong className={`${message.role === "assistant" ? "text-primary" : "text-muted"}`}>
                  {message.role === "assistant" ? "Blue Quill" : "You"}
                </strong>
                <small className="text-muted">
                  {message.role === "assistant" ? "Assistant" : "User"}
                </small>
              </div>
              <div className="d-flex align-items-start justify-content-between mb-1">
                <div
                  className="mb-0 flex-grow-1"
                  style={{ lineHeight: 1.6, color: "#0f172a" }}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
                />
                {message.timestamp &&
                  <small className="text-muted ms-3" style={{ fontSize: "0.75rem" }}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </small>
                }
              </div>
              {message.authors && message.authors.length > 0 &&
                <div className="text-muted small mb-1">
                  Authors: {message.authors.join(", ")}
                </div>
              }
              {message.files && message.files.length > 0 && (() => {
                const uniqueFiles = Array.isArray(message.files)
                  ? [...new Set(message.files)]
                  : [];
                if (!uniqueFiles.length) {
                  return null;
                }
                return (
                  <div className="d-flex flex-wrap gap-2">
                    {uniqueFiles.map((fileUrl) => (
                      <a
                        key={fileUrl}
                        className="btn btn-sm btn-outline-primary"
                        href={fileUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Download file
                      </a>
                    ))}
                  </div>
                );
              })()}
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
          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              setMessages(DEFAULT_MESSAGES);
              setDraft("");
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}
