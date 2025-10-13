"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";

export default function Home() {
  const [code, setCode] = useState("// Start typing code here...");

  return (
    <main className="main-container">
      <h1 className="page-title">Reflect CI / CD  </h1>
      <h2 className="page-subtitle">Self Reflecting System Pipeline</h2>

      <div className="editor-wrapper">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={code}
          theme="vs-dark"
          onChange={(value) => setCode(value || "")}
        />
      </div>
      <button id="btnPushCode" className="btn-pushcode">Push Code</button>
    </main>
  );
}
