import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

export async function GET(request) {
  try {
    // octokit init
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });

    // Fetch the file from GitHub
    const { data } = await octokit.repos.getContent({
      owner: process.env.GITHUB_OWNER,
      repo: process.env.GITHUB_REPO,
      path: process.env.FILE_PATH_INDEX,
       // branch
      ref: process.env.GITHUB_PROD_REF,
    });

    // Decode the base64 content
    const jsxContent = Buffer.from(data.content, 'base64').toString('utf-8');

    // Return the HTML content in JSON response
    return NextResponse.json({
      success: true,
      fileName: data.name,
      path: data.path,
      jsxContent: jsxContent,
      sha: data.sha, // You'll need this for updates later
      size: data.size
    });

  } catch (error) {
    console.error('Error fetching file from GitHub:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error.message,
        details: error.response?.data || 'Unknown error'
      }, 
      { status: error.status || 500 }
    );
  }
}
