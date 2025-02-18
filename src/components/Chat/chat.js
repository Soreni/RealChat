import React, {useState, useEffect} from 'react';
import queryString from 'query-string';
import io from 'socket.io-client'
import './Chat.css';

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';



let socket;
const Chat =()=>{
const [name, setName] = useState('');
const [room,setRoom] = useState('');
const [users, setUsers] = useState('');
const [message, setMessage] = useState('');
const [messages, setMessages] = useState([]);
const ENDPOINT = 'https://realchat1.herokuapp.com/';
useEffect( ()=>{
    /* eslint no-restricted-globals:0 */
const {name, room} = queryString.parse(location.search);
socket = io(ENDPOINT);

setName(name);
setRoom(room);

socket.emit('join',{name,room},()=>{

});

return()=>{
    socket.emit('disconnect')
    socket.off();
}

},[ENDPOINT,location.search]);

useEffect(()=>{

    socket.on('message', (message) => {
        setMessages([...messages, message ]);
      });
  
      socket.on('roomData', ({ users }) => {
        setUsers(users);
      })
  
      return () => {
        socket.emit('disconnect');
  
        socket.off();
      }
    }, [messages])
//send message 
const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }
    return (

        <div className="outerContainer">
        <div className="container">
          
            <InfoBar room={room} />    
            <Messages messages={messages} name={name} /> 
            <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />    
        </div>  
         <TextContainer users={users}/>
      </div>)


}

export default Chat;