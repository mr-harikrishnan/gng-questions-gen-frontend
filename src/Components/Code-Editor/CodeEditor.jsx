import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";


function CodeEditor({code,setCode}) {
  return (
    <CodeMirror
      value={code}
      height="100px"
      theme={vscodeDark}
      onChange={(value) => {
        setCode(value)
        
      }}
    />
  );
}

export default CodeEditor