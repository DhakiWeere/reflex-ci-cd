"use client";

import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

export default function Home() {
  const [code, setCode] = useState("// LOADING PAGE ....");

  async function updateEditor() {
    try {
      const response = await fetch('/api/get-code');

      // response success ?
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // JSON
      const jsonData = await response.json();

      // update editor
      setCode(jsonData.jsxContent);

    } catch (error) {
      console.error('Error fetching code:', error);
      throw error;
    }
  }


  // get code from branch first render
  useEffect(()=>{
    setTimeout(updateEditor, 2500);
  }, []);

  return (
    <main className="main-container">
      <h1 className="page-title">Reflex CI / CD  </h1>
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
      <button id="btnPushCode" className="btn-pushcode" onClick={updateEditor}>Push Code</button>
    </main>
  );
}
