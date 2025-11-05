"use client";

import { useState, useEffect, createContext, useRef } from "react";
import Editor from "@monaco-editor/react";
import { fetchCodeFromGitHub, getUser, isUserSaved, pushCode, removeUser, resetServerContainer } from "./utils/util";

export default function Home() {
  const isFirstRun = useRef(true);
  const codePages = useRef(["page.jsx"]);
  const code = useRef("// LOADING PAGE ....");

  const [username, setUsername] = useState("");
  const [commitTag, setCommitTag] = useState("");
  const [userID, setUserID] = useState(0);
  const [branch, setBranch] = useState('');
  const [commitSha, setCommitSha] = useState('');
  const [isUserPersisted, setIsUserPersisted] = useState(false);
  const [isPushDetailsValidated, setIsPushDetailsValidated] = useState(false);
  const [nortificationAreaVisible, setNortificationAreaVisible] = useState(false);
  const [nortificationArr, setNortificationArr] = useState([]);
  const [isNortificationsEnabled, setIsNortificationsEnabled] = useState(false);


  // init setup run 
  useEffect(_setup, []);

  // nortification update
  // useEffect(() => {
  //   if (isFirstRun.current) {
  //     isFirstRun.current = false;
  //     return;
  //   }
  // CHANGE ADDAPTED TO LATER USEEFFECT HOOK
  //   _nortificationUpdate();
  // }, [nortificationArr]);

  useEffect(() => {
    if (!isFirstRun.current) {
      let { isValidated } = validateInput();
      if (isValidated) {
        setIsPushDetailsValidated(true);
      } else {
        setIsPushDetailsValidated(false);
      }
    }
  }, [username, commitTag]);

  useEffect(() => {
    if (isFirstRun.current) isFirstRun.current = false;
  }, []);

  return (
    <div className="container-top w-full h-screen overflow-y-scroll">

      {/* HEADER */}
      <header className="container-header w-full max-w-7xl h-[10vh] sticky top-0 left-0">
        {/* Logo Art */}
        <img src="./logo_art.svg" className="h-10 bg-accent" />
        {/* TITLE */}
        <h1 className="title">Reflex CI / CD</h1>
      </header>

      {/* CONTAINER-ACTUAL */}
      <main className="container-actual max-w-7xl w-full">

        {/* CONTAINER PG 1 */}
        <div className="container-pg1 w-full h-[90vh]">
          <div className="h-full w-full flex flex-col gap-y-3 md:justify-center">
            {/* subtitle*/}
            <h2 className="subtitle w-full text-start">Self<br /> Reflecting<br /> System<br /> Pipeline</h2>
            {/* desc */}
            <p className="h-fit w-[40ch] text-md md:text-xl font-semibold flex flex-col text-start">
              This project is a concept demonstration of a full-duplex CI/CD pipeline, exploring how deployment
              pipelines can evolve beyond the traditional one-way flow. In a typical setup, changes move from
              the GitHub repository to the running application. Here, the process is bidirectional — the web
              application itself can push commits or configuration updates back to the GitHub repo, which in
              turn triggers GitHub Actions workflows, creating a self-sustaining feedback loop.
            </p>
          </div>
          <div className="h-full w-full flex flex-col gap-y-4 md:justify-center md:items-center">
            <p className="hidden md:block text-xl font-bold font-mono text-shadow-accent">
              Start making changes to this very page
            </p>
            <button className="w-fit h-fit p-4 btn accent-btn" onClick={() => {
              document.getElementById('c-pg2').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }}>
              Start Editing
            </button>
          </div>

        </div>

        {/* CONTAINER PG 2*/}
        <div id="c-pg2" className="container-pg2 w-full h-[90vh]">

          {/* Commit Details */}
          <div className="commit-details w-full h-fit overflow-x-hidden">
            <div className="flex flex-row">
              <p className="w-[10ch]">Viewing</p>:
              <select className="border border-white text-accent p-2 ms-2">
                {codePages.current.map(page => (<option value={page} key={codePages.current.indexOf(page)}>{page}</option>))}
              </select>
            </div>
            <div className="flex flex-row"><p className="w-[10ch]">Branch</p>:&nbsp;{branch} </div>
            <div className="flex flex-row w-full h-fit">
              <p className="w-[10ch] shrink-0">Commit</p>
              <p>:&nbsp;{commitSha}</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:gap-x-4">
            {/* editor */}
            <div className="editor-wrapper">
              <Editor
                height="100%"
                defaultLanguage="javascript"
                value={code.current}
                theme="vs-dark"
                onChange={(value) => code.current = value || ""}
              />
            </div>

            <div>
              {/* details */}
              <div className="flex flex-col gap-y-4 p-3">
                <div className="flex flex-row justify-start gap-x-2">
                  {/* lbl username */}
                  <div className="w-[12ch] font-bold">Username</div>
                  {/* username input */}
                  <input className='inpt w-[15ch]' type="text" value={username} onChange={(v) => {
                    setUsername(v.target.value)
                    setUserID(Math.floor(Math.random() * 99999));
                  }} />
                  {/* user id auto generate field */}
                  {username && <input className="inpt w-[6ch]" value={userID} readOnly={true} />}
                </div>
                <div className="flex flex-row justify-start gap-x-2">
                  {/* lbl Commit tag */}
                  <div className="w-[12ch] font-bold">Commit Tag</div>
                  {/* commit tag input */}
                  <input className='inpt w-[15ch]' type="text" value={commitTag} onChange={(v) => setCommitTag(v.target.value)} />
                </div>
              </div>

              {/* btn & links */}
              <div className="flex flex-row md:flex-col md:gap-y-3 md:items-center gap-x-2">
                {/* push code btn */}
                <button className={`btn ${isPushDetailsValidated ? 'accent-sq-btn btn' : 'btn-disabled'}`} onClick={() => {
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

                {/* delete user button */}
                {isUserPersisted && <button className={`btn accent2-sq-btn`} onClick={() => {
                  removeUser();
                  setUsername(""); setCommitTag(""); setUserID(0);
                  setIsUserPersisted(false);
                }}>Remove User</button>}

                {/* GitHub Activity Link */}
                {isUserPersisted && <a className="btn accent3-sq-btn" href={`https://github.com/dhakiweere/reflex-ci-cd/activity?ref=user-branch/${username}-${userID}`}
                  target="_blank"
                  rel="noopener noreferrer">
                  GitHub Branch
                </a>}
              </div>

            </div>

          </div>

        </div>

        {/* NORTIFICATION SIDEBAR */}
        <div className={` ${isNortificationsEnabled ? 'flex' : 'hidden'} w-fit h-full bg-transparent fixed right-0 top-0 z-20
         flex-row
        `}>
          {/* expand button */}
          <button className="bg-amber-400 w-fit h-fit p-3 sticky right-0 top-0" onClick={() => {
            console.log("close click")
            setNortificationAreaVisible(!nortificationAreaVisible);
          }}>close
          </button>

          {/* nortification area */}
          <div>
            <ul className={`${nortificationAreaVisible ? "max-w-96" : "max-w-0"}
            h-full bg-blue-300 flex flex-col justify-end duration-300 overflow-hidden
            `}>
              {nortificationArr.map(obj => (<li className="w-[35ch]" key={nortificationArr.indexOf(nortificationArr.indexOf((obj)))}>{obj.nTime + " " + obj.nMsg}</li>))}
            </ul>
          </div>

        </div>



      </main>
    </div>
  );

  // hoisted setup function declaration
  function _setup() {
    // load code content from github
    (async () => {
      await fetchCodeFromGitHub(setBranch, setCommitSha, addNewNortification, code);
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
    if (!nortificationAreaVisible) {
      setNortificationAreaVisible(true);
      setTimeout(() => setNortificationAreaVisible(false), 2000);
    }
  }

  // add new nortification
  function addNewNortification(msg) {
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
