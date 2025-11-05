import { NextResponse } from 'next/server';
import { configDotenv } from 'dotenv';
import { Octokit } from '@octokit/rest';

export async function POST(req) {
    try {
        // Initialize Octokit with your personal access token
        const octokit = new Octokit({
            auth: process.env.GITHUB_TOKEN
        });

        // request body parse 
        const reqBodyObj = await req.json();

        // var
        const { username, id: userID, indexPgJSX, commitTag } = reqBodyObj;
        const repo = process.env.GITHUB_REPO;
        const owner = process.env.GITHUB_OWNER;
        const fpath_index = process.env.FILE_PATH_INDEX;
        const branch_prod = process.env.GITHUB_PROD_REF;
        const branch_new = `user-branch/${username}-${userID}`;

        // user branch last commit ref declaration
        var refCommitUserBranchLast;

        // user branch exist ?
        try {
            refCommitUserBranchLast = await octokit.git.getRef({
                owner,
                repo,
                ref: `heads/${branch_new}`
            });
            console.log("user branch found")

        } catch (error) {
            if (error.status === 404) {
                // USER BRANCH DOES NOT EXIST
                console.log("user branch was not found")

                // prod branch last ref commit
                const refCommitProdLast = await octokit.git.getRef({
                    owner,
                    repo,
                    ref: `heads/${branch_prod}`
                });
                // create new branch and ref commit
                refCommitUserBranchLast = await octokit.git.createRef({
                    owner,
                    repo,
                    ref: `refs/heads/${branch_new}`,
                    sha: refCommitProdLast.data.object.sha
                });
            }
        }

        // Userbranch last Commit
        const { data: commitUserBranchLast } = await octokit.rest.git.getCommit({
            owner,
            repo,
            commit_sha: refCommitUserBranchLast.data.object.sha,
        });

        // upadated content blob
        const { data: blob } = await octokit.rest.git.createBlob({
            owner,
            repo,
            content: Buffer.from(indexPgJSX).toString("base64"),
            encoding: "base64",
        });

        // create new tree
        const { data: treeNewChanges } = await octokit.rest.git.createTree({
            owner,
            repo,
            base_tree: commitUserBranchLast.tree.sha,
            tree: [
                {
                    path: fpath_index,
                    mode: "100644",
                    type: "blob",
                    sha: blob.sha,
                },
            ],
        });

        // push commit
        const { data: refCommitUserBranchNew } = await octokit.rest.git.createCommit({
            owner,
            repo,
            message: commitTag,
            tree: treeNewChanges.sha,
            parents: [refCommitUserBranchLast.data.object.sha],
        });

        // update new branch head
        await octokit.rest.git.updateRef({
            owner,
            repo,
            ref: `heads/${branch_new}`,
            sha: refCommitUserBranchNew.sha,
        });

        // response
        return NextResponse.json({
            status: 201,
            msg: `Successfully Added New Commit ${refCommitUserBranchNew.sha}`
        });

    } catch (err) {
        console.log("push-code error : ", err.message);

        // response
        return NextResponse.json({
            status: 500,
            msg: "Backend Error"
        });
    }
}
