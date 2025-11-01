"use client";

import { useState, useEffect, createContext, useRef } from "react";
import Editor from "@monaco-editor/react";
import { fetchCodeFromGitHub, getUser, isUserSaved, pushCode, removeUser, resetServerContainer } from "./utils/util";

export default function Home() {
  const isFirstRun = useRef(true);
  const [code, setCode] = useState("// LOADING PAGE ....");
  const [username, setUsername] = useState("");
  const [commitTag, setCommitTag] = useState("");
  const [userID, setUserID] = useState(0);
  const [branch, setBranch] = useState('');
  const [commitSha, setCommitSha] = useState('');
  const [isUserPersisted, setIsUserPersisted] = useState(false);
  const [nortificationAreaVisible, setNortificationAreaVisible] = useState(false);
  const [nortificationArr, setNortificationArr] = useState([]);


  // init setup run 
  useEffect(_setup, []);

  // nortification update
  useEffect(()=>{
    if(isFirstRun.current){
      isFirstRun.current = false;
      return;
    }
    _nortificationUpdate();
  }, [nortificationArr]);

  return (
    <main className="bg-fuchsia-300 w-full h-screen overflow-y-scroll flex flex-row justify-center">
      <div className="bg-green-400 w-full max-w-5xl flex flex-col gap-y-3 p-3">
        <div className="header-container">
          {/* Logo Art */}
          <img src="./logo_art.svg" height="60px" />
          {/* TITLE */}
          <h1 className="text-lime-300 page-title">Reflex CI / CD  </h1>
        </div>
        {/* SUBTILE */}
        <h2 className="page-subtitle">Self Reflecting System Pipeline</h2>

        {/* Commit Details */}
        <div className="container-commit-details">Viewing [ page.jsx ] of branch:{branch} | Commit:{commitSha}
          {isUserPersisted && <button className="btn-reset-server" onClick={() => {
            // reset server container
            resetServerContainer()
          }}>Reset Server</button>}
        </div>

        {/* EDITOR */}
        <div className="editor-wrapper">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            value={code}
            theme="vs-dark"
            onChange={(value) => setCode(value || "")}
          />
        </div>

        {/* DETAILS */}
        <div className="push-details-container">
          {/* lbl username */}
          <div>Username</div>
          {/* username input */}
          <input type="text" value={username} onChange={(v) => {
            setUsername(v.target.value)
            setUserID(Math.floor(Math.random() * 99999));
          }} />
          {/* user id auto generate field */}
          {username && <input value={userID} readOnly={true} />}
          {/* delete user button */}
          {isUserPersisted && <button onClick={() => {
            removeUser();
            setUsername(""); setCommitTag(""); setUserID(0);
            setIsUserPersisted(false);
          }}>Remove User</button>}

          {/* lbl Commit tag */}
          <div>Commit Tag</div>
          {/* commit tag input */}
          <input type="text" value={commitTag} onChange={(v) => setCommitTag(v.target.value)} />
        </div>

        {/* PUSH COMMIT TO REPO BTN */}
        <button className="btn-pushcode" onClick={() => {
          // Validating Input
          var { isValidated, sanitizedUsername } = validateInput();
          if (isValidated) {
            // push updated code to API
            pushCode(sanitizedUsername, userID, code, commitTag)
          } else {
            console.log("Input Not Validated")
          }
          setIsUserPersisted(true);
        }}>Push Code</button>

        {/* GitHub Activity Link */}
        {isUserPersisted && <a href={`https://github.com/dhakiweere/reflex-ci-cd/activity?ref=user-branch/${username}-${userID}`}
          target="_blank"
          rel="noopener noreferrer">
          GitHub Branch Activity
        </a>}

        {/* message windows */}
        <div className="w-fit h-full bg-[#002a2a2a] fixed right-0 top-0 z-20 
        flex flex-row
        ">
          {/* expand button */}
          <button className="bg-amber-400 w-fit h-fit p-3 sticky right-0 bottom-0" onClick={() => {
            console.log("close click")
            setNortificationAreaVisible(!nortificationAreaVisible);
          }}>close
          </button>

          {/* nortification area */}
          <div>
            <ul className={`${nortificationAreaVisible ? "max-w-96" : "max-w-0"}
            h-full bg-blue-300 flex flex-col justify-end duration-300 overflow-hidden
            `}>
              {console.log(nortificationArr)}
              {nortificationArr.map( obj => (<li key={nortificationArr.indexOf(nortificationArr.indexOf((obj)))}>{obj.nTime + " " + obj.nMsg}</li>))}
            </ul>
          </div>

        </div>

        <p>{nortificationAreaVisible ? "is visible" : "is not visible"}</p>
      </div>
    </main>
  );

  // hoisted setup function declaration
  function _setup() {
    // load code content from github
    (async () => {
      const data = await fetchCodeFromGitHub(setBranch, setCommitSha, addNewNortification);
      setCode(data);
    })();

    // load user from cookies if exist
    if (isUserSaved()) {
      const userObj = getUser();
      setUsername(userObj.username);
      setUserID(userObj.id);
      setIsUserPersisted(true);
    }
  }

  // nortification update function declaration
  function _nortificationUpdate() {
    if (!nortificationAreaVisible ) {
      setNortificationAreaVisible(true);
      setTimeout(() => setNortificationAreaVisible(false), 2000);
    }
  }

  // add new nortification
  function addNewNortification(msg){
    let date = new Date();
    setNortificationArr([...nortificationArr, {
      nTime: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
      nMsg: msg 
    }]);
  }

  // hoisted inpt validation func declaration
  function validateInput() {
    const isNotEmpty = [code, username, userID, commitTag].every(
      (val) => val != null && String(val).trim() !== ""
    );

    var sanitizedUsername = "";

    if (isNotEmpty) {
      // INPUT FIELDS ARE NOT EMPTY

      // Remove leading dots
      sanitizedUsername = username.replace(/^\.*/, "");

      // Remove trailing slashes
      sanitizedUsername = sanitizedUsername.replace(/\/+$/, "");

      // replace spaces with dashes
      sanitizedUsername = sanitizedUsername.replace(/\s+/g, "-");
      setUsername(sanitizedUsername);
    }

    return { isValidated: isNotEmpty, sanitizedUsername: sanitizedUsername };
  }

}
