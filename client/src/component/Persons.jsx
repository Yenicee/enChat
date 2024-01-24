import Avatar from "../pages/Avatar"

export default function Persons({ id, username, onClick, selected, online}) {
    return (
        <div key={id} onClick={() => onClick(id)}
            className={"border-b border-black-100 flex items-center gap-2 cursor-pointer" + (selected ? 'bg-blue-800' : '')}>
            {selected && (
                <div className="w-1 bg-green-600 h-10 rounded-r-md "></div>
            )}

            <div className="flex gap-2 py-2 pl-4 items-center">
                <Avatar online={online} username={username} userId={id} />
                <span className="text-gray-800">{username}</span>
            </div>
        </div>
    )
}