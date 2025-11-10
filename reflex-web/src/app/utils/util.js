import Cookies from "js-cookie";
import { textContent } from "../data/textContent";

// fetch code from github from [api/get-code]
export async function fetchCodeFromGitHub(setBranch, setCommitSha, addNewNortificaiton, code, codePages) {
    try {
        const response = await fetch('/api/get-code');
        // response success ?
        if (!response.ok) {
            addNortification(`Error fetching code from github : ${response.statusText}`)
            return;
        }
        // JSON
        const jsonData = await response.json();

        // set commit and branch
        setBranch(jsonData.branch); 
        setCommitSha(jsonData.commitSha);

        // set code to ref variabe
        code.current = jsonData.codeContent;

        // add new nortification
        addNewNortificaiton(textContent.nortificationContent.codeGetSuccess, true);

    } catch (error) {
        console.error('Error fetching code:', error);
        addNewNortificaiton(textContent.nortificationContent.codeGetFail, false);
        throw error;
    }
}

// push code to [api/push-code]
export async function pushCode(username, userID, indexPgCode, commitTag) {
    // create / update users
    createUser(username, userID);

    // async call to api
    try {
        const resp = await fetch("/api/push-code", {
            method: "POST",
            body: JSON.stringify({
                username: username,
                id: userID,
                indexPgJSX: indexPgCode,
                commitTag: commitTag
            })
        });

        if (!resp.ok) {
            console.Error("error pushing code", resp.status);
        }

        console.log(await resp.json())

    } catch (error) {
        console.error("Error trying to push code", error);
    }
}

// reset server locally
export function resetServerContainer(){
    console.log("reset server container pressed");
}


// create and save username \ userID
export function createUser(username, id) {
    // remove existing user
    removeUser();

    // save cookies
    Cookies.set("username", username);
    Cookies.set("userID", id);
}


// get user from cookies ?
export function getUser() {
    const username = Cookies.get("username");
    const userID = Cookies.get("userID");
    return { username: username, id: userID };
}


// remove saved user and id from cookie
export function removeUser() {
    // remove existing cookies
    Cookies.remove("username");
    Cookies.remove("userID")
}


// user saved in cookies ? 
export function isUserSaved() {
    const userObj = getUser();
    return (userObj.username && userObj.id);
}
