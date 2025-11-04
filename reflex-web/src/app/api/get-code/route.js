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
      ref: process.env.GIT_BRANCH,
    
    });

    // Decode the base64 content
    const codeContent = Buffer.from(data.content, 'base64').toString('utf-8');

    // Return the HTML content in JSON response
    return NextResponse.json({
      success: true,
      fileName: data.name,
      path: data.path,
      codeContent: codeContent,
      branch: process.env.GIT_BRANCH,
      commitSha: process.env.GIT_COMMIT,
      sha: data.sha, 
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
