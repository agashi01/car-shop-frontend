import React,{useEffect} from 'react';

export default function AuthMessage({authMessage,auth}){

  useEffect(() => {
    if (authMessage ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Clean up the overflow style when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [authMessage]);


    return(
        <div className="modal">
          <div className="logIn-again" onClick={e=>e.stopPropagation()}>
            {authMessage === "Unable to refresh token, please log in again!" ? (
              <>
                <p className="">{authMessage}</p>
                <button onClick={auth} className="btn2">
                  Log In
                </button>
              </>
            ) : authMessage === "Who are you? Can You please log in again!" ? (
              <>
                <p className="">{authMessage}</p>
                <button onClick={auth} className="btn2">
                  Log In
                </button>
              </>
            ) : authMessage ===
              "Something went wrong, can You please log in again!" ? (
              <>
                <p className="">{authMessage}</p>
                <button onClick={auth} className="btn2">
                  Log In
                </button>
              </>
            ) : authMessage ? (
              <>
                <p className="">Something went wrong, can You please log in again!</p>
                <button onClick={auth} className="btn2">
                  Log In
                </button>
              </>
            ) : null}
          </div>
        </div>
    )
}