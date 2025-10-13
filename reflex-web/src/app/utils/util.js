import Cookies from "js-cookie";

// fetch code from github from [api/get-code]
export async function fetchCodeFromGitHub() {
    try {
        const response = await fetch('/api/get-code');
        // response success ?
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // JSON
        const jsonData = await response.json();

        // return the code
        return jsonData.jsxContent;
    } catch (error) {
        console.error('Error fetching code:', error);
        throw error;
    }
}

// push code to [api/push-code]
export function pushCode(username, userID) {
    // create / update users
    createUser(username, userID)

    // async call to api
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