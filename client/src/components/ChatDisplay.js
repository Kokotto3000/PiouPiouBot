import { useState, useEffect } from "react";
import axios from "axios";

function ChatDisplay(props){

    //const userId= user?.user_id;
    const userId= "kokottotest001";
    //const clickedUserId= clickedUser?.user_id;
    const clickedUserId= "pioupioutest001";

    //console.log(userId, clickedUserId)

    const [userMessages, setUserMessages ]= useState([]);
    const [clickedUserMessages, setClickedUserMessages]= useState([]);

    async function getUserMessages(){

        try{
            const response= await axios.get('http://localhost:8000/messages', {
                params: {
                    userId: userId,
                    correspondingUserId: clickedUserId
                }
            });

            setUserMessages(response.data);

        }catch(err){
            console.log("error : " + err);
        }
        
    }

    async function getClickedUserMessages(){

        try{
            const response= await axios.get('http://localhost:8000/messages', {
                params: {
                    userId: clickedUserId,
                    correspondingUserId: userId
                }
            });

            setClickedUserMessages(response.data);

        }catch(err){
            console.log("error : " + err);
        }
        
    }

    useEffect(()=> {
        getUserMessages();
        getClickedUserMessages();
    }, []);

    const messages= [];

    userMessages?.forEach(message => {
        const formattedMessage= {};
        //formattedMessage['name'] = user?.first_name;
        //formattedMessage['img'] = user?.url;
        formattedMessage['message'] = message.message;
        formattedMessage['timestamp'] = message.timestamp;
        messages.push(formattedMessage);
    });

    clickedUserMessages?.forEach(message => {
        const formattedMessage= {};
        //formattedMessage['name'] = clickedUser?.first_name;
        //formattedMessage['img'] = clickedUser?.url;
        formattedMessage['message'] = message.message;
        formattedMessage['timestamp'] = message.timestamp;
        messages.push(formattedMessage);
    });

    const descendingOrderMessages= messages?.sort((a,b)=> (a.timestamp).localeCompare(b.timestamp));

    //console.log(messages)

    //console.log(userMessages, clickedUserMessages);

    return (
        <div>
            <div className="chat-display">
                {descendingOrderMessages.map((message, index)=> (
                    <div key={index}>
                        <div>
                            <p>{message.message}</p>
                        </div>
                    </div>
                ))}
            </div>
            
        </div>
    )
}

export default ChatDisplay;