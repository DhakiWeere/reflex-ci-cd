"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import './editor.css';

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
      {/* <pre className="code-output">{code}</pre> */}
      <button className="test-btn" 
      onClick={() => {alert(`CODE : \n ${code}`)}}>Get Code</button>
    </main>
  );
}
