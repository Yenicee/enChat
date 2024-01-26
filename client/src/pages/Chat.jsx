import { useContext, useEffect, useRef, useState } from "react";
import axios from 'axios';
import { uniqBy } from "lodash";
import { UserContext } from "../component/UserContext";
import Logo from "./Logo";
import Persons from "../component/Persons";

export default function Chat() {
    const [ws, setWs] = useState(null);
    const [onlinePoeple, setOnlinePeople] = useState({});
    const [offlinePeople, setOfflinePeople] = useState({});
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [newMessageText, setNewMessageText] = useState('');
    const [messages, setMessages] = useState([]);
    const { username, id, setId, setUsername } = useContext(UserContext);
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
            if (messageData.sender === selectedUserId) {
                setMessages(prev => ([...prev, { ...messageData }]))
            }
        }
    }

    //fuction logout button
    function logout() {
        axios.post('/logout').then(() => {
            setWs(null)
            setId(null);
            setUsername(null);
        });
    }



    function sendMessage(ev, file = null) {

        if (ev) ev.preventDefault();
        ws.send(JSON.stringify({
            recipient: selectedUserId,
            text: newMessageText,
            file,
        }));
        setNewMessageText('');
        setMessages(prev => ([...prev, {
            text: newMessageText,
            sender: id,
            recipient: selectedUserId,
            _id: Date.now(),

        }]));
        if (file) {
            axios.get('/messages/' + selectedUserId).then(res => {
                setMessages(res.data)
            });
        } else {
            setNewMessageText('');
            setMessages(prev => ([...prev, {
                text: newMessageText,
                sender: id,
                recipient: selectedUserId,
                _id: Date.now(),

            }]));
        }

    };

    function sendFile(ev) {
        const reader = new FileReader();
        reader.readAsDataURL(ev.target.files[0]);
        reader.onload = () => {
            sendMessage(null, {
                name: ev.target.files[0].name,
                data: reader.result,
            })
        };
    }

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
            <div className="bg-gray-50 w-1/3 flex flex-col ">
                <div className="flex-grow">
                    <Logo />
                    <br />
                    {/* Map para renderizar componentes Persons */}
                    {Object.keys(onlinePoepleExclOurUser).map(userId => (
                        <Persons
                            key={userId}
                            id={userId}
                            online={true}
                            username={onlinePoepleExclOurUser[userId]}
                            onClick={() => setSelectedUserId(userId)}
                            selected={userId === selectedUserId}
                        />
                    ))}
                    {/* Map para renderizar componentes Persons para usuarios offline */}
                    {Object.keys(offlinePeople).map(userId => (
                        <Persons
                            key={userId}
                            id={userId}
                            online={false}
                            username={offlinePeople[userId].username}
                            onClick={() => setSelectedUserId(userId)}
                            selected={userId === selectedUserId}
                        />
                    ))}
                </div>

                <div className="p-2 text-center flex items-center justify-center">
                    <span className="mr-2 text-sm text-blue-700 flex items-center">Welcome
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                        </svg>

                        {username}</span>
                    <button
                        onClick={logout}
                        className="text-ms bg-blue-50 py-1 px-2 text-gray-500 border rounded-sm "
                    >Logout</button>
                </div>
            </div>

            {/* segundo contenedor para mensages */}
            <div className="flex flex-col bg-gradient-to-tl hover:bg-gradient-to-tr from-blue-700 via-indigo-800 to-blue-950 w-2/3">
                <div className="flex-grow">
                    {!selectedUserId && (
                        <div className="flex flex-col items-center justify-center h-full flex-grow">
                        <img src="send-img.gif" alt="img-git" className="mb-2" width={400}/>
                        <div className="text-gray-400">&larr; Selected person from the sidebar</div>
                    </div>
                    
                    )}

                    {!!selectedUserId && (
                        <div className="relative h-full">
                            <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2 p-6">
                                {messagesWithoutDupes.map(message => (
                                    <div key={message._id} className={(message.sender === id ? 'flex justify-end' : 'flex justify-start')}>
                                        <div className={"relative p-2 my-2 rounded-md text-sm " + (message.sender === id ? 'bg-blue-400 text-white' : 'bg-white text-gray-500')}>
                                            {message.text}
                                            {message.file && (
                                                <div className="mt-1">
                                                    <a target="_blank" className="flex items-center gap-1 " href={axios.defaults.baseURL + '/uploads/' + message.file}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                                        </svg>
                                                        {message.file}
                                                    </a>
                                                </div>
                                            )}
                                            <div className={(message.sender === id ? 'absolute right-0 bottom-0' : 'absolute left-0 bottom-0')}>
                                                <div className={(message.sender === id ? 'w-0 h-0 border-r border-b' : 'w-0 h-0 border-l border-b')}></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={divUnderMessages}></div>
                            </div>

                        </div>


                    )}
                </div>

                {!!selectedUserId && (
                    <form className="flex gap-4 bg-sky-50 p-2" onSubmit={sendMessage}>

                        <label className="p-2 cursor-pointer">
                            <input type="file"
                                className="hidden"
                                onChange={sendFile}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                            </svg>

                        </label>
                        <input
                            value={newMessageText}
                            onChange={ev => setNewMessageText(ev.target.value)}
                            type="text"
                            className="bg-white border p-1 flex-grow rounded-lg border-blue-700"
                            placeholder="Type your message here"
                        />

                        <button type="submit" className="bg-transparent p-2 text-blue-700 rounded-full hover:shadow-md">
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