import { NextResponse } from 'next/server';
import { configDotenv } from 'dotenv';

export async function GET() {
    console.log("route GET called")
    return NextResponse.json({ message: 'Hello from API!' });
}

export async function POST(req) {
    console.log("route POST called");
    const headers = req.headers;
    const content_type = await headers.get("content-type");
    
    const data =  await req.json(); 
    console.log(data);
    console.log(content_type);
    console.log(data.username + " <<<>>> " + data.pass);
    return NextResponse.json({ name : "THis is awesome" });
}
