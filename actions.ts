'use server'

import { sql } from "@vercel/postgres"
import { v4 } from "uuid"
import { Image, InfoType, Price } from "./types"
import { redirect } from "next/navigation"
import { cookies } from 'next/headers'

// import dotenv from 'dotenv';
// dotenv.config();

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

let date = new Date()

export const getImages = async () => {
    const result = await sql`
        SELECT * FROM julkapazy ORDER BY date DESC
    `
    return result.rows as Image[]
}

export const addImage = async (publicId: string) => {

    const objInfoType:InfoType = {
        importance: 1,
        should_be_on_front_page: false,
        tags: [],
        date: new Date()
    }
    
    try{
        const result = await sql`
            INSERT INTO julkapazy (id,public_id,info,date) VALUES (${v4()},${publicId},${JSON.stringify(objInfoType)},${JSON.stringify(new Date())}) RETURNING *
        `
        console.log(result.rows[0])
        return result.rows[0] as Image
    }catch(error){
        console.error("Error adding image:", error);
    }

}
export const getDate = async () => {
    return date
}

export const updateDate = async() => {
    date = new Date()
    return date
} 

export const Login = async (password: string) => {
    const cookieStore = await cookies()
    if(password === process.env.LOGIN_PASSWORD){
        const jwt = require('jsonwebtoken');
        const token = jwt.sign({ password }, process.env.JWT_SECRET, { expiresIn: '1h' });
        cookieStore.set('jwt', token, { path: '/', maxAge: 3600 });
        redirect('/home')
    }
    return { error: 'Złe hasło' };
}

export const deleteImages = async (ids: string[]) => {

    try{
        const result = await sql.query(`
            DELETE FROM julkapazy
            WHERE public_id = ANY($1::text[])
        `,[ids]);

        cloudinary.api.delete_resources(ids, function(error: any, result: any) {
            console.log(result, error);
        });
        // return result
    }catch(error){
        console.error("Error deleting images:", error);
    }
}

export const updateImagesInfo = async (images: Image[]) => {

    try{
        const result = await sql.query(`
            UPDATE julkapazy AS j
            SET info = v.info
            FROM(
                SELECT * 
                FROM unnest($1::jsonb[], $2::uuid[])
                AS v(info, id)
            ) AS v 
            WHERE j.id = v.id
        `,[images.map(img => JSON.stringify(img.info)), images.map(img => img.id)]);
        return result.rows[0] as Image
    }catch(error){
        console.error("Error updating image info:", error);
    }
}

export const handleAddNewPrice = async (name: string, price: number, description: string) => {
    if(!name || !price || !description){
        return { error: 'Wszystkie pola są wymagane' };
    }
    try{
        const result = await sql`
            INSERT INTO julkaprices (id,name,price,description) VALUES (${v4()},${name},${price},${description}) RETURNING *
        `
        return { result: result.rows[0] as Price, error: '' }
    }catch(e){
        return { error: 'Błąd podczas dodawania usługi' };    
    }   
}

export const getPrices = async () => {
    const result = await sql`
        SELECT * FROM julkaprices
        `
    return result.rows as Price[]
}

export const updatePrices = async (prices: Price[]) => {
    try{
        const result = await sql.query(`
            UPDATE julkaprices AS j
            SET name = v.name,
                price = v.price,
                description = v.description
            FROM(
                SELECT * 
                FROM unnest($1::text[], $2::numeric[], $3::text[], $4::uuid[])
                AS v(name, price, description, id)
            ) AS v 
            WHERE j.id = v.id
        `,[prices.map(p=>p.name), prices.map(p=>p.price), prices.map(p => p.description), prices.map(p => p.id)]);
        return { result: result.rows[0] as Price, error: '' }
    }catch(error){
        console.error("Error updating prices:", error);
        return { result: null, error: 'Błąd podczas aktualizacji cen' };
    }
}

export const deletePrice = async (id: string) => {
    try{
        const result = await sql`
            DELETE FROM julkaprices
            WHERE id = ${id}
        `
        return { error: '' }
    }catch(error){
        console.error("Error deleting price:", error);
        return { error: 'Błąd podczas usuwania ceny' };
    }
}