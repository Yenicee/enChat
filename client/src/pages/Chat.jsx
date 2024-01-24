import { useContext, useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import Logo from "./Logo";
import { uniqBy } from "lodash";
import axios from 'axios';
import { UserContext } from "../component/UserContext";
import Persons from "../component/Persons";

export default function Chat() {
    const [ws, setWs] = useState(null);
    const [onlinePoeple, setOnlinePeople] = useState({});
    const [offlinePeople, setOfflinePeople] = useState({});
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [newMessageText, setNewMessageText] = useState('');
    const [messages, setMessages] = useState([]);
    const { username, id } = useContext(UserContext);
    const divUnderMessages = useRef();

    useEffect(() => {
        connectToWs();
    }, []);

    function connectToWs() {
        const ws = new WebSocket('ws://localhost:4040');
        // Almacenar la instancia del WebSocket en el estado
        setWs(ws);
        // Manejar el evento 'message'
        ws.addEventListener('message', handleMessage);
        ws.addEventListener('close', () => {
            setTimeout(() => {
                console.log('disconnected')
                connectToWs();
            }, 1000)
        });

        // Limpiar el WebSocket cuando el componente se desmonta
        return () => {
            ws.removeEventListener('message', handleMessage);

        };
    }

    function showOnLinePeople(peopleArray) {
        const people = {};
        peopleArray.forEach(({ userId, username }) => {
            people[userId] = username;
        });
        setOnlinePeople(people);
    }

    function handleMessage(ev) {
        const messageData = JSON.parse(ev.data)
        console.log({ ev, messageData })
        if ('online' in messageData) {
            showOnLinePeople(messageData.online);
        } else if ('text' in messageData) {
            setMessages(prev => ([...prev, { ...messageData }]))
        }
    }

    function sendMessage(ev) {
        ev.preventDefault();
        ws.send(JSON.stringify({
            recipient: selectedUserId,
            text: newMessageText,
        }));
        setNewMessageText('');
        setMessages(prev => ([...prev, {
            text: newMessageText,
            sender: id,
            recipient: selectedUserId,
            _id: Date.now(),

        }]));

    };

    useEffect(() => {
        const div = divUnderMessages.current;
        if (div) {
            div.scrollIntoView({ behavior: 'smooth', block: 'end' })
        }
    }, [messages]);

    //message save MongoDB
    useEffect(() => {
        if (selectedUserId) {
            axios.get('/messages/' + selectedUserId).then(res => {
                setMessages(res.data)
            });
        }
    }, [selectedUserId]);

    useEffect(() => {
        axios.get('/people').then(res => {
            const offlinePeopleArr = res.data
                .filter(p => p._id !== id)
                .filter(p => !Object.keys(onlinePoeple).includes(p._id))

            const offlinePeople = {}
            offlinePeopleArr.forEach(p => {
                offlinePeople[p._id] = p;
            })

            setOfflinePeople(offlinePeople);
        });
    }, [onlinePoeple]);


    const onlinePoepleExclOurUser = { ...onlinePoeple };
    delete onlinePoepleExclOurUser[id];

    const messagesWithoutDupes = uniqBy(messages, '_id')

    return (

        <div className="flex h-screen">
            <div className="bg-gray-50 w-1/3 ">
                <Logo />
                <br />
                {Object.keys(onlinePoepleExclOurUser).map(userId => (
                    <Persons
                        key={userId}
                        id={userId}
                        online={true}
                        username={onlinePoepleExclOurUser[userId]}
                        onClick={() => setSelectedUserId(userId)}
                        selected={userId === selectedUserId} />
                ))}
                {Object.keys(offlinePeople).map(userId => (
                    <Persons
                        key={userId}
                        id={userId}
                        online={false}
                        username={offlinePeople[userId].username}
                        onClick={() => setSelectedUserId(userId)}
                        selected={userId === selectedUserId} />
                ))}
            </div>

            {/* segundo contenedor para mensages */}
            <div className="flex flex-col bg-gradient-to-tl hover:bg-gradient-to-tr from-blue-900 via-indigo-900 to-blue-950 w-2/3">
                <div className="flex-grow">
                    {!selectedUserId && (
                        <div className="flex h-full flex-grow items-center justify-center">
                            <div className="text-gray-400">&larr; Selected person from the sidebar</div>
                        </div>
                    )}
                    {!!selectedUserId && (
                        <div className="relative h-full">
                            <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2">
                                {messagesWithoutDupes.map(message => (
                                    <div key={message._id} className={(message.sender === id ? 'text-right' : 'text-left')}>
                                        <div className={"text-left inline-block p-2 my-2 rounded-md text-sm " + (message.sender === id ? 'bg-blue-400 text-white' : 'bg-white text-gray-500')}>
                                            {message.text}
                                        </div>
                                    </div>
                                ))}
                                <div ref={divUnderMessages}></div>
                            </div>
                        </div>


                    )}
                </div>

                {!!selectedUserId && (
                    <form className="flex gap-2" onSubmit={sendMessage}>
                        <input
                            value={newMessageText}
                            onChange={ev => setNewMessageText(ev.target.value)}
                            type="text"
                            className="bg-white border p-1 flex-grow rounded-lg"
                            placeholder="Type your message here"
                        />

                        <button type="submit" className="bg-transparent p-2 text-white rounded-full hover:shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                            </svg>
                        </button>

                    </form>
                )}

            </div>
        </div>
    );
}