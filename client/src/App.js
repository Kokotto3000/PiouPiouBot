import { useState } from 'react';
import './App.css';
import APICall from './utils/APICall';

function App() {

  const [question, setQuestion]= useState("");
  const [response, setResponse]= useState("");

  async function getResponse(){
    const response= await APICall(question);
    setResponse(response);
  }

  return (
    <div className="App">
      <h1>PiouPiou Bot</h1>
      <h2>Your question :</h2>
      <input name="question" onChange={e=> setQuestion(e.target.value)}></input>
      <button type="submit" onClick={getResponse}>Envoyer</button>
      <h2>PiouPiou response :</h2>
      <p>{response}</p>
    </div>
  );
}

export default App;
