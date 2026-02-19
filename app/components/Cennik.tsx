'use client'
import { deletePrice, handleAddNewPrice, updatePrices } from "@/actions";
import { Price } from "@/types";
import { useState } from "react";

type CennikProps = {
    prices: Price[]
}

function Cennik({ prices: initialPrices }: CennikProps) {

    const [prices, setPrices] = useState<Price[]>(initialPrices || [])
    const [error, setError] = useState("")
    const [name, setName] = useState("")
    const [price, setPrice] = useState(0)
    const [description, setDescription] = useState("")
    const [isEditing, setIsEditing] = useState(false)
   
    const handleAddPrice = async () => {
        const result = await handleAddNewPrice(name, price, description)
        if(result.error){
            setError(result.error)
            return
        }
        if(result.result){
            setPrices(prev => [...prev, result.result])
            setName("")
            setPrice(0)
            setDescription("")
        }

    }

    const handleSaveEdit = async () => {
        // tutaj można dodać logikę zapisywania edytowanych cen do bazy danych
        setIsEditing(false)
        const result = await updatePrices(prices)
        if(result.error){
            setError(result.error)
            return
        }
    }

    const handleDeletePrice = async (id: string) => {
        const result = await deletePrice(id)
        if(result.error){
            setError(result.error)
            return
        }
        setPrices(prev => prev.filter(price => price.id !== id))
    }
    return ( 
        <div className=" px-2 flex flex-col justify-center mx-auto py-16">
            <h1 className="text-4xl font-bold text-center">Cennik</h1>

            <div>
                <p className="text-lg font-bold">Dodaj nową cenę</p>
                <input type="text" placeholder="Nazwa usługi" className="border p-2 rounded w-full mb-2" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="number" placeholder="Cena" className="border p-2 rounded w-full mb-2" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
                <textarea placeholder="Opis usługi" className="border p-2 rounded w-full mb-2" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAddPrice}>Dodaj</button>
                {error && <p className="text-red-500">{error}</p>}
            </div>

            <div className="mt-16">
                <div className="flex justify-between items-center">
                    <p className="text-lg font-bold">Lista cen:</p>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setIsEditing(!isEditing)}>Edytuj ceny</button>
                </div>
                {prices.map(price => (
                    <div key={price.id} className="flex flex-col gap-8 mt-4">
                    { !isEditing && <div key={price.id} className="border-b py-4">
                        <div className="flex">
                            <div className="flex-1"> 
                                <h2 className="text-2xl font-semibold">{price.name} - {price.price} zł</h2>
                                <p>{price.description}</p>
                            </div>
                            <button onClick={() => handleDeletePrice(price.id)}>Usuń</button>
                        </div>


                    </div>}

                    {isEditing && 
                    <div key={price.id} className="py-4 flex flex-col justify-between items-center w-full bg-stone-900/25 rounded p">
                        <div className="flex flex-col w-full gap-2 px-2">
                            <div className="flex flex-col">
                                <label htmlFor={`name-${price.id}`}>Nazwa</label>
                                <input id={`name-${price.id}`} type="text" value={price.name} onChange={(e) => {
                                const newPrices = [...prices];
                                newPrices.find(p => p.id === price.id)!.name = e.target.value;
                                setPrices(newPrices);
                            }} className="border rounded pl-1"/>
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor={`price-${price.id}`}>Cena</label>
                                <input id={`price-${price.id}`} type="number" value={price.price} onChange={(e) => {
                                const newPrices = [...prices];
                                newPrices.find(p => p.id === price.id)!.price = Number(e.target.value);
                                setPrices(newPrices);
                                }} className="border rounded pl-1"/>
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor={`description-${price.id}`}>Opis</label>
                                <textarea id={`description-${price.id}`} value={price.description} onChange={(e) => {
                                const newPrices = [...prices];
                                newPrices.find(p => p.id === price.id)!.description = e.target.value;
                                setPrices(newPrices);
                            }} className="border rounded pl-1"></textarea>
                            </div>
                            
                        </div>
                    </div>}
                </div>))}
            </div>
            {isEditing && <button className="bg-green-500 text-white px-4 py-2 rounded mt-4 fixed bottom-4 right-4 left-4" onClick={handleSaveEdit}>Zapisz zmiany</button>}
        </div>
     );
}

export default Cennik;