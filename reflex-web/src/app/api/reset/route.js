import { NextResponse } from 'next/server';
import { configDotenv } from 'dotenv';
import { Octokit } from '@octokit/rest';

export async function POST(req) {
    const reqBodyObj = await req.json()
    
}