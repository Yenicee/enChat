import { useContext, useState } from "react"
import axios from "axios"
import { UserContext } from "../component/UserContext"

export default function RegisterAndLoginForm() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoginOrRegister, setIsLoginOrRegister] = useState('register')
    const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);

    async function handleSubmit(ev) {
        ev.preventDefault();
        const url = isLoginOrRegister === 'register' ? 'register' : 'login';
        const { data } = await axios.post(url, { username, email, password });
        setLoggedInUsername(username);
        setId(data.id);
    }

    return (
        <div className="flex items-center h-screen bg-gradient-to-b from-purple-600 via-indigo-900 to-sky-950">
            <div className="max-w-md mx-auto relative overflow-hidden z-10 bg-gray-800 p-8 shadow-md before:w-24 before:h-24 before:absolute before:bg-purple-600 before:rounded-full before:-z-10 before:blur-2xl after:w-32 after:h-32 after:absolute after:bg-sky-400 after:rounded-full after:-z-10 after:blur-xl after:top-1/4 after:-right-12">
                <form onSubmit={handleSubmit} className="flex flex-col items-center">
                    <h1 className="font-extrabold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 to-blue-500 mb-4">Welcome <span className="text-green-600/80">enChat!</span></h1>

                    <label className="text-sm font-medium text-gray-300">Username</label>
                    <input
                        value={username}
                        onChange={ev => setUsername(ev.target.value)}
                        type="text"
                        className="block w-full rounded-sm p-2 mb-2 bg-gray-700 text-white"
                    />

                    {isLoginOrRegister === 'register' && (
                        <div className="text-center mb-2">
                            <label className="text-sm font-medium text-gray-300">Email</label>
                            <input
                                value={email}
                                onChange={ev => setEmail(ev.target.value)}
                                type="email"
                                className="block w-full rounded-sm p-2 mb-2 bg-gray-700 text-white"
                            />
                        </div>
                    )}

                    <label className="text-sm font-medium text-gray-300">Password</label>
                    <input
                        value={password}
                        onChange={ev => setPassword(ev.target.value)}
                        type="password"
                        className="block w-full rounded-sm p-2 mb-4 bg-gray-700 text-white"
                    />

                    <button className="py-2 px-5 rounded-sm p-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg">
                        {isLoginOrRegister === 'register' ? 'Register' : 'Login'}
                    </button>

                    <div className="text-sm mt-3 font-medium text-gray-300">
                        {isLoginOrRegister === 'register' && (
                            <div>
                                Already a member?
                                <button onClick={() => setIsLoginOrRegister('Login')}>Login here</button>
                            </div>
                        )}
                        {isLoginOrRegister === 'Login' && (
                            <div>
                                Don't have an account?
                                <button onClick={() => setIsLoginOrRegister('register')}>Register here</button>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );

}

