import { useState } from 'react';
import APICall from '../utils/APICall';
import axios from 'axios';
import ChatDisplay from '../components/ChatDisplay';

//faire composant pour aller chercher tous les messages avec tri dans la bdd

function Home(props) {

    const [question, setQuestion]= useState("");
    const [response, setResponse]= useState("");
    const [conversation, setConversation]= useState([]);

    //const userId= user?.user_id; à voir plus tard dans les props ou state redux
    const userId= "kokottotest001";
    //const clickedUserId= clickedUser?.user_id; quand il y aura plusieurs matches ;)
    const clickedUserId= "pioupioutest001";

    async function getResponse(){
        const response= await APICall(question);
        setResponse(response);
        setConversation(existingItems => {
            return [...existingItems, question, response];
        });
        
        const questionMessage= {
            timestamp: new Date().toISOString(),
            from_userId: userId,
            to_userId: clickedUserId,
            message: question
        }

        const responseMessage= {
            timestamp: new Date().toISOString(),
            from_userId: clickedUserId,
            to_userId: userId,
            message: response
        }

        try{
            await axios.post('http://localhost:8000/message', { questionMessage, responseMessage });
            setQuestion("");
        }catch(err){
            console.log("error : " + err);
        }
    }

    return (
        <div>
            <h1>PiouPiou Bot</h1>
            <h2>Your question :</h2>
            <textarea name="question" value={question} onChange={e=> setQuestion(e.target.value)}></textarea>
            <button type="submit" onClick={getResponse}>Envoyer</button>
            <h2>PiouPiou response :</h2>
            <p>{response}</p>
            <ChatDisplay />
            {/* conversation.map((element, index)=> <h3 key={index}>{element}</h3>) */}
        </div>
    );
}

export default Home;