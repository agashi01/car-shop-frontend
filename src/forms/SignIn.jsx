/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance as useAxiosInstance } from "./AxiosConfig4000";

// eslint-disable-next-line react/prop-types
export default function SignInForm({ dealer, guest, id, username }) {
  const [signIn, setSignIn] = useState({ email: "", password: "" });
  const [error, setError] = useState({ email: "", password: "" });
  const [backendError, setBackendError] = useState(null);
  const [backendMessage, setBackendMessage] = useState(null);
  const axiosInstance = useAxiosInstance();
  const navigate = useNavigate()

  const email = useRef(null);
  const password = useRef(null);

  const arrowUp = (ref) => {
    ref.focus();
  };

  const arrowDown = (ref) => {
    ref.focus();
  };

  useEffect(() => {
    if (backendError) {
      axiosInstance
        .post("/log-in", {
          email: signIn.email,
          password: signIn.password,
        })
        .then((res) => {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("refreshToken", res.data.refresh);
          setBackendError(false);
          setError({ email: "stabil", password: "stabil" });
          dealer(res.data?.user?.type);
          username(res.data?.user?.username);
          guest(false)
          id(res.data?.user?.id)
          navigate("/");
        })
        .catch((err) => {
          console.log(err);
          if (err.response?.data === "wrong password") {
            setError((current) => {
              return { ...current, password: "Wrong password !" };
            });
          } else if (err.response?.data === "wrong email") {
            setError((current) => {
              return { ...current, email: "This email do not have a registered account !" };
            });
          } else {
            setBackendMessage(err?.response?.data);
          }
        });
    }
  }, [backendError]);

  // function whne the user submits
  async function signInConfirm(e) {
    setError((current) => {
      return { ...current, email: "", password: "" };
    });

    e.preventDefault();

    setError((current) => {
      if (signIn.email.length === 0) {
        return { ...current, email: "Enter your email !" };
      } else if (!signIn.email.includes("@")) {
        return { ...current, email: "Invalid form of email !" };
      } else {
        return { ...current, email: "Stabil" };
      }
    });

    setError((current) => {
      if (signIn.password.length === 0) {
        return { ...current, password: "Enter your password !" };
      } else if (signIn.password.length < 8) {
        return { ...current, password: "Minimum 8 characters !" };
      } else {
        return { ...current, password: "Stabil" };
      }
    });
  }

  useEffect(() => {
    const array = Object.values(error);

    let hasErrors = false;
    for (let key of array) {
      if (key !== "Stabil") {
        hasErrors = true;
        setBackendError(false);

        break;
      }
    }
    if (!hasErrors) {
      setBackendError(true);
    }
  }, [signInConfirm]);

  // function when the user is typing
  const dynamicEmail = useCallback(() => {
    setError((current) => {
      if (signIn.email.length === 0) {
        return { ...current, email: "Stabil" };
      } else if (!signIn.email.includes("@")) {
        return { ...current, email: " Invalid form of email !" };
      } else {
        return { ...current, email: "Correct form" };
      }
    });
  }, [signIn.email]);
  // function when the user is typing
  const dynamicPassword = useCallback(() => {
    setError((current) => {
      if (signIn.password.length === 0) {
        return { ...current, password: "Stabil" };
      } else if (signIn.password.length < 8) {
        return { ...current, password: " Minimum 8 characters !" };
      } else {
        return { ...current, password: "Correct form" };
      }
    });
  }, [signIn.password]);

  useEffect(() => {
    dynamicEmail();
    dynamicPassword();
  }, [dynamicEmail, dynamicPassword]);

  useEffect(() => {
    const arrowHandler = (ref1) => (event) => {
      switch (event.key) {
        case "ArrowUp":
          arrowUp(ref1);
          break;
        case "ArrowDown":
          arrowDown(ref1);
          break;

        default:
          break;
      }
    };

    const emailRef = email.current;
    const passwordRef = password.current;

    emailRef.addEventListener("keydown", arrowHandler(passwordRef));
    passwordRef.addEventListener("keydown", arrowHandler(emailRef));

    return () => {
      emailRef.removeEventListener("keydown", arrowHandler(passwordRef));
      passwordRef.removeEventListener("keydown", arrowHandler(emailRef));
    };
  }, []);

  // function when the user is typing
  function signInEmail(text) {
    setSignIn((current) => {
      return { ...current, email: text };
    });
  }
  // function when the user is typing
  function signInPassword(text) {
    setSignIn((current) => {
      return { ...current, password: text };
    });
  }
  // function when the user is typing

  const errorEmail = () => {
    switch (true) {
      case backendMessage:
        return null;
      case error.email === "Wrong email !":
        return <p className="wrong-sign-in">{error.email}</p>;

      case error.email === "Enter your email !":
        return <p className="wrong-sign-in">{error.email}</p>;

      case error.email === "Invalid form of email !":
        return <p className="wrong-sign-in">{error.email}</p>;

      case error.email === " Invalid form of email !":
        return <p className="half-good-sign-in">{error.email}</p>;

      case error.email === "Correct" || error.email === "Correct form":
        return <p className="good-sign-in">{error.email}</p>;

      default:
        return null;
    }
  };

  const errorPassword = () => {
    switch (true) {
      case backendMessage:
        console.log(backendMessage);
        return <p className="wrong-sign-in">{backendMessage}</p>;

      case error.password === "Wrong password !":
        return <p className="wrong-sign-in">{error.password}</p>;

      case error.password === "Minimum 8 characters !":
        return <p className="wrong-sign-in">{error.password}</p>;

      case error.password === " Minimum 8 characters !":
        return <p className="half-good-sign-in">{error.password}</p>;

      case error.password === "Enter your password !":
        return <p className="wrong-sign-in">{error.password}</p>;

      case error.password === "Correct":
        return <p className="good-sign-in">{error.password}</p>;

      case error.password === "Correct form":
        return <p className="good-sign-in">{error.password}</p>;

      default:
        return null;
    }
  };

  // function fir className
  const classnameEmail = () => {
    switch (true) {
      case backendMessage:
        return "prezantimi-register";

      case error.email === "Wrong email !" ||
        error.email === "Enter your email !" ||
        error.email === "Invalid form of email !":
        return "wrong-prezantimi-register";

      case error.email === " Invalid form of email !":
        return "half-good-prezantimi";

      case error.email === "Correct" || error.email === "Correct form":
        return "good-prezantimi-register";

      default:
        return "prezantimi-register";
    }
  };

  const classnamePassword = () => {
    switch (true) {
      case backendMessage:
        return "prezantimi-register";

      case error.password === "Wrong password !" ||
        error.password === "Enter your password !" ||
        error.password === "Minimum 8 characters !":
        return "wrong-prezantimi-register";

      case error.password === " Minimum 8 characters !":
        return "half-good-prezantimi";

      case error.password === "Correct" || error.password === "Correct form":
        return "good-prezantimi-register";

      default:
        return "prezantimi-register";
    }
  };

  return (
    <div className="div-box">
      <form id="sign-in" onSubmit={ signInConfirm}>
        <h2>Sign In</h2>
        <label htmlFor="email">
          <input
            className={classnameEmail()}
            type="email"
            name="email-address"
            onChange={(e) => {
              signInEmail(e.target.value);
            }}
              autoComplete="on"
            value={signIn.email}
            id="email"
            placeholder="Enter your email"
            ref={email}
          ></input>
        </label>
        <div className="error">{errorEmail()}</div>
        <label htmlFor="password">
          <input
            className={classnamePassword()}
            type="password"
            name='password'
            onChange={(e) => {
              signInPassword(e.target.value);
            }}
              autoComplete="on"
            value={signIn.password}
            id="password"
            placeholder="Enter your password"
            ref={password}
          ></input>
        </label>
        <div className="error">{errorPassword()}</div>
        <button className="register-button" type="submit" >
          Sign in
        </button>
      </form>
      <div className="register">
        <div className="correct-guest">
          <p
            className="text"
            style={{
              fontSize: 13,
              marginRight: 5,
            }}
          >
            Do not have an account?{" "}
          </p>
          <p
            className="text2"
            style={{
              fontSize: 13,
              marginRight: 5,
            }}
          >
            Go as guest{" "}
          </p>
        </div>

        <div className="go-as-guest">
          <button onClick={() => navigate("/Register")} type="btn">
            Register
          </button>
          <button
            onClick={() => {
              guest(true)
              navigate("/");
            }}
            type="btn"
          >
            Go as guest
          </button>
        </div>
      </div>
    </div>
  );
}
