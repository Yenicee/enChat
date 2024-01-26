export default function Logo() {
    return (
        <div>
            <h2 className="text-blue-500 font-bold text-2xl m-4">enChat</h2>

            <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.4" stroke="currentColor" className="w-4 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <input
                    type="text"
                    className="pl-8 py-2 pr-2 m-2 w-full sm:w-64 md:w-96 rounded-md border-0 text-sm focus:ring-0 focus:border-blue-700"
                    placeholder="Search for your user"
                />
            </div>



            <div className="m-4 flex">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-900">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                </svg>
                <p className="ml-2">Archived</p>
            </div>
        </div>

    )
}