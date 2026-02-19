'use client'

import { useRouter } from "next/navigation";

function Navigator() {
    const navigation = useRouter()

    const func = (path:string) => {
        navigation.push(path)
    }
    return ( 
        <nav className="text-white flex justify-center gap-4 py-2">
            <button onClick={() => func("/home")} className=" bg-black px-4 py-2 rounded">Strona Główna</button>
            <button onClick={() => func("/home/cennik")} className=" bg-black px-4 py-2 rounded">Cennik</button>
        </nav>
     );
}

export default Navigator;