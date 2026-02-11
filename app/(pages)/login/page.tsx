'use client'

import { Login } from "@/actions";
import { useState } from "react";

export default function page(){

    const[password, setPassword] = useState('')
    const[error, setError] = useState('')
    const handleLogin = async () => {
        // Here you would typically handle authentication logic, such as sending a request to your backend to verify credentials.
        // For demonstration purposes, we'll just log a message to the console.
        console.log("Login button clicked");
        const result = await Login(password)
        if(result.error){
            setError(result.error)
        }
    }
    return(
        <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <h1 className="text-4xl font-bold mb-4">Login Page</h1>
            <p className="text-lg text-gray-600 mb-8">Please log in to access the home page.</p>
            {/* Add your login form or authentication logic here */}
                <input type="password" placeholder="Password" className="mb-4 px-4 py-2 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} />
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleLogin}>
                    Login
                </button>
        </div>
    )
}