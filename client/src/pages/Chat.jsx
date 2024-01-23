import { useContext, useEffect, useState } from "react";
import Avatar from "./Avatar";
import Logo from "./Logo";
import { UserContext } from "../component/UserContext";

export default function Chat() {
    const [ws, setWs] = useState(null);
    const [onlinePoeple, setOnlinePeople] = useState({});
    const [selectedUserId, setSelectedUserId] = useState(null);
    const { username, id } = useContext(UserContext);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:4040');

        // Almacenar la instancia del WebSocket en el estado
        setWs(ws);

        // Manejar el evento 'message'
        ws.addEventListener('message', handleMessage);

        // Limpiar el WebSocket cuando el componente se desmonta
        return () => {
            ws.removeEventListener('message', handleMessage);

        };
    }, []);

    function showOnLinePeople(peopleArray) {
        const people = {};
        peopleArray.forEach(({ userId, username }) => {
            people[userId] = username;
        });
        setOnlinePeople(people);
        console.log('Updated online people:', people);
    }


    function handleMessage(ev) {
        const messageData = JSON.parse(ev.data)
        console.log('Received WebSocket message data:', messageData);
        if ('online' in messageData) {
            showOnLinePeople(messageData.online);
        }
    }

    const onlinePoepleExclOurUser = {...onlinePoeple};
    //delete onlinePoepleExclOurUser[id];
   
    return (

        <div className="flex h-screen">
            <div className="bg-gray-50 w-1/3 ">
                <Logo />
                {Object.keys(onlinePoepleExclOurUser).map(userId => (
                    <div key={userId} onClick={() => setSelectedUserId(userId)}
                        className={"border-b border-black-100 flex items-center gap-2 cursor-pointer" + (userId === selectedUserId ? 'bg-blue-800' : '')}>
                        {userId === selectedUserId && (
                            <div className="w-1 bg-green-600 h-10 rounded-r-md "></div>
                        )}

                        <div className="flex gap-2 py-2 pl-4 items-center">
                            <Avatar username={onlinePoeple[userId]} userId={userId} />
                            <span className="text-gray-800">{onlinePoeple[userId]}</span>
                        </div>
                    </div>
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
                </div>

                <div className="flex gap-2">
                    <input
                        type="text"
                        className="bg-white border p-1 flex-grow rounded-lg"
                        placeholder="Type your message here"
                    />

                    <button className="bg-transparent p-2 text-white rounded-full hover:shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                        </svg>
                    </button>

                </div>
            </div>
        </div>
    );
}