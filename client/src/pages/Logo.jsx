export default function Logo() {
    return (
        <div>
            <h2 className="text-blue-500 font-bold">enChat</h2>
            <div className="flex flex-row gap-1 rounded-md py-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.4" stroke="currentColor" className="w-4 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <input type="text" className="" placeholder="Search for your user" />
            </div>
        </div>
    )
}