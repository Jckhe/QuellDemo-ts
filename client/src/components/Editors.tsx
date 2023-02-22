import * as React from "react";
import  ControlledEditor  from "@monaco-editor/react";
import { editor } from "monaco-editor";
import {querySamples} from './helperFunctions'

export const QueryEditor = ({setQuery, selectedQuery}: QueryEditorProps) => {

  const handleChange = (value?: any,  ev?: editor.IModelContentChangedEvent): any => {
    setQuery(value)
  };

  const query = querySamples[selectedQuery]

  return (
   <div className="monaco-editor-container" >
    <ControlledEditor
      // height={"250px"}
      className={"monaco-editor"}
      defaultLanguage="graphql"
      value={query}
      onChange={handleChange}
      options={{
        scrollBeyondLastLine: true,
        wordWrap: "wordWrapColumn"
      }}/>
   </div>
  )
};

export const ResponseEditor = ({response}: ResponseEditorProps) => {

  return (
   <div className="monaco-editor-container" style={{marginTop: 10}} >
    <ControlledEditor
      height={"500px"}
      className={"monaco-editor"}
      defaultLanguage="graphql"
      value={response}
      // onChange={null}
      options={{
        scrollBeyondLastLine: true
      }}/>
   </div>
  )
};

interface QueryEditorProps {
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  selectedQuery: string;
}

interface ResponseEditorProps {
  response: string
}