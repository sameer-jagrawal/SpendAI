"use client";

import ChatWindow from "../components/Chat/ChatWindow";

export default function Home() {
  return (
    <main className="app-shell">
      <div className="background-glow glow-one" />
      <div className="background-glow glow-two" />

      <header className="topbar fixed">
        <div className="brand">
          <div className="brand-icon">
            S
          </div>

          <div>
            <h1>SpendAI</h1>
            <span>AI expense manager</span>
          </div>
        </div>

        <div className="status">
          <span className="status-dot" />
          AI Online
        </div>
      </header>

      <section className="chat-section">
        <ChatWindow />
      </section>
    </main>
  );
}
