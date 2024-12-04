/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from "react";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { axiosInstance as useAxiosInstance } from "./AxiosConfig4000";


// eslint-disable-next-line react/prop-types
export default function Register() {
  const username = useRef(null);
  const emri = useRef(null);
  const mbiemri = useRef(null);
  const email = useRef(null);
  const password = useRef(null);
  const axiosInstance = useAxiosInstance();
  const navigate=useNavigate()

  const [backendError, setBackendError] = useState();
  const [backendMessage, setBackendMessage] = useState();

  const [error, setError] = useState({
    emri: "",
    mbiemri: "",
    email: "",
    password: "",
    username: "",
  });
  const [register, setRegister] = useState({
    emri: "",
    mbiemri: "",
    email: "",
    password: "",
    username: "",
  });

  const [type, setType] = useState("Buying");

  const arrowUp = (ref) => {
    ref.focus();
  };

  const arrowDown = (ref) => {
    ref.focus();
  };


  useEffect(() => {
    if (backendError) {
      axiosInstance
        .post("/sign-up", {
          name: register.emri,
          surname: register.mbiemri,
          email: register.email,
          password: register.password,
          username: register.username,
          type,
        })
        .then(() => {
          setBackendError(false);
          navigate("/After-register");
        })
        .catch((err) => {
          setBackendError(true);
          if (err?.response?.data === "email is already in use") {
            setError((current) => {
              return { ...current, email: "Email is already in use" };
            });
          } else if (err?.response?.data === "username is already in use") {
            setError((current) => {
              return { ...current, username: "Username is already in use" };
            });
          } else {
            setBackendMessage(err?.response?.data);
          }
        });
    }
  }, [backendError]);

  // function for prototype

  String.prototype.doesNotInclude = function () {
    for (let i = 0; i < this.length; i++) {
      if (!"QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm".includes(this[i])) {
        return true;
      }
    }
    return false;
  };

  // function for op[tions

  // function when user submits
  const registerConfirm = async (e) => {
    e.preventDefault();
    setError({ emri: "", mbiemri: "", email: "", password: "", username: "" });

    setError((current) => {
      if (!register.emri) {
        return { ...current, emri: "Enter your name!" };
      } else if (register.emri.doesNotInclude()) {
        // check again
        return { ...current, emri: "Name should contain only letters!" };
      } else {
        return { ...current, emri: " Correct form" };
      }
    });

    setError((current) => {
      if (!register.mbiemri) {
        return { ...current, mbiemri: "Enter your surname!" };
      } else if (register.mbiemri.doesNotInclude()) {
        // check again
        return { ...current, mbiemri: "Surname should contain only letters!" };
      } else {
        return { ...current, mbiemri: " Correct form" };
      }
    });

    setError((current) => {
      if (!register.username) {
        return { ...current, username: "Enter your username!" };
      } else {
        return { ...current, username: " Correct form" };
      }
    });

    setError((current) => {
      if (!register.email) {
        return { ...current, email: "Enter your email!" };
      } else if (!register.email.includes("@")) {
        return { ...current, email: "Invalid form of email!" };
      } else {
        return { ...current, email: " Correct form" };
      }
    });

    setError((current) => {
      if (!register.password) {
        return { ...current, password: "Enter your password!" };
      } else if (register.password.length < 8) {
        return { ...current, password: "Minimum 8 characters" };
      } else {
        return { ...current, password: " Correct form" };
      }
    });
  };

  useEffect(() => {
    const array = Object.values(error);
    let hasErrors = false;
    for (let key of array) {
      if (key !== " Correct form") {
        hasErrors = true;
        setBackendError(false);
        break;
      }
    }
    if (!hasErrors) {
      setBackendError(true);
    }
  }, [registerConfirm]);

  // function to see if user has typed
  const hasUserType = () => {
    return Object.values(register).some((value) => value);
  };

  // functions when user is typing
  const dynamicEmri = useCallback(() => {
    setError(
      (current) => {
        if (!register.emri) {
          if (hasUserType()) return { ...current, emri: "Enter your name" };
          else return { ...current, emri: "Stabil" };
        } else if (register.emri.doesNotInclude())
          return { ...current, emri: " Name should contain only letters!" };
        else return { ...current, emri: "Correct form" };
      },
      [register]
    );
  });

  const dynamicMbiemri = useCallback(() => {
    setError((current) => {
      if (!register.mbiemri) {
        if (hasUserType()) return { ...current, mbiemri: "Enter your surname" };
        else return { ...current, mbiemri: "Stabil" };
      } else if (register.mbiemri.doesNotInclude()) {
        return { ...current, mbiemri: " Surname should contain only letters!" };
      } else return { ...current, mbiemri: "Correct form" };
    });
  }, [register]);

  const dynamicUsername = useCallback(() => {
    setError((current) => {
      if (!register.username) {
        if (hasUserType()) return { ...current, username: "Enter your username" };
        else return { ...current, username: "Stabil" };
      } else return { ...current, username: "Correct form" };
    });
  }, [register]);

  const dynamicEmail = useCallback(() => {
    setError((current) => {
      if (!register.email) {
        if (hasUserType()) return { ...current, email: "Enter your email" };
        else return { ...current, email: "Stabil" };
      } else if (!register.email.includes("@"))
        return { ...current, email: " Invalid form of email!" };
      else return { ...current, email: "Correct form" };
    });
  }, [register]);

  const dynamicPassword = useCallback(() => {
    setError((current) => {
      if (!register.password) {
        if (hasUserType()) return { ...current, password: "Enter your password" };
        else return { ...current, password: "Stabil" };
      } else if (register.password.length < 8)
        return { ...current, password: " Minimum 8 characters" };
      else return { ...current, password: "Correct form" };
    });
  }, [register]);

  useEffect(() => {
    dynamicEmri();
    dynamicMbiemri();
    dynamicUsername();
    dynamicEmail();
    dynamicPassword();
  }, [register]);

  useEffect(() => {
    const arrowHandler = (ref1, ref2) => (event) => {
      switch (event.key) {
        case "ArrowUp":
          arrowUp(ref1);
          break;
        case "ArrowDown":
          arrowDown(ref2);
          break;
        default:
          break;
      }
    };
    const usernameRef = username.current;
    const emriRef = emri.current;
    const mbiemriRef = mbiemri.current;
    const emailRef = email.current;
    const passwordRef = password.current;

    usernameRef.addEventListener("keydown", arrowHandler(mbiemriRef, emailRef));
    emriRef.addEventListener("keydown", arrowHandler(passwordRef, mbiemriRef));
    mbiemriRef.addEventListener("keydown", arrowHandler(emriRef, usernameRef));
    emailRef.addEventListener("keydown", arrowHandler(usernameRef, passwordRef));
    passwordRef.addEventListener("keydown", arrowHandler(emailRef, emriRef));

    return () => {
      emriRef.removeEventListener("keydown", arrowHandler(passwordRef, mbiemriRef));
      mbiemriRef.removeEventListener("keydown", arrowHandler(emriRef, emailRef));
      emailRef.removeEventListener("keydown", arrowHandler(mbiemriRef, passwordRef));
      passwordRef.removeEventListener("keydown", arrowHandler(emailRef, emriRef));
    };
  }, [arrowDown, arrowUp]);

  // functions when user types
  const setEmri = (e) => {
    setRegister((current) => {
      return { ...current, emri: e.target.value };
    });
  };

  const setMbiemri = (e) => {
    setRegister((current) => {
      return { ...current, mbiemri: e.target.value };
    });
  };

  const setEmail = (e) => {
    setRegister((current) => {
      return { ...current, email: e.target.value };
    });
  };

  const setPassword = (e) => {
    setRegister((current) => {
      return { ...current, password: e.target.value };
    });
  };

  const setUsername = (e) => {
    setRegister((current) => {
      return { ...current, username: e.target.value };
    });
  };
  // function when user submits

  // functions for classnames
  const classNameEmri = () => {
    return backendMessage
      ? "prezantimi-register"
      : error.emri === "Enter your name!"
        ? "wrong-prezantimi-register"
        : error.emri === "Enter your name"
          ? "good-prezantimi-register"
          : error.emri === "Correct form"
            ? "good-prezantimi-register"
            : error.emri === " Correct form"
              ? "good-prezantimi-register"
              : error.emri === " Name should contain only letters!"
                ? "half-good-prezantimi"
                : error.emri === "Name should contain only letters!"
                  ? "wrong-prezantimi-register"
                  : "prezantimi-register";
  };

  const classNameMbiemri = () => {
    return backendMessage
      ? "prezantimi-register"
      : error.mbiemri === "Enter your surname!"
        ? "wrong-prezantimi-register"
        : error.mbiemri === "Enter your surname"
          ? "good-prezantimi-register"
          : error.mbiemri === "Correct form"
            ? "good-prezantimi-register"
            : error.mbiemri === " Correct form"
              ? "good-prezantimi-register"
              : error.mbiemri === " Surname should contain only letters!"
                ? "half-good-prezantimi"
                : error.mbiemri === "Surname should contain only letters!"
                  ? "wrong-prezantimi-register"
                  : "prezantimi-register";
  };

  const classNameUsername = () => {
    return backendMessage
      ? "prezantimi-register"
      : error.username === "Enter your username!"
        ? "wrong-prezantimi-register"
        : error.username === "Enter your username"
          ? "good-prezantimi-register"
          : error.username === "Correct form"
            ? "good-prezantimi-register"
            : error.username === " Correct form"
              ? "good-prezantimi-register"
              : error.username === "Username is already in use"
                ? "wrong-prezantimi-register"
                : "prezantimi-register";
  };

  const classNameEmail = () => {
    return backendMessage
      ? "prezantimi-register"
      : error.email === "Enter your email!"
        ? "wrong-prezantimi-register"
        : error.email === "Enter your email"
          ? "good-prezantimi-register"
          : error.email === "Invalid form of email!"
            ? "wrong-prezantimi-register"
            : error.email === " Invalid form of email!"
              ? "half-good-prezantimi"
              : error.email === "Correct form"
                ? "good-prezantimi-register"
                : error.email === " Correct form"
                  ? "good-prezantimi-register"
                  : error.email === "Email is already in use"
                    ? "wrong-prezantimi-register"
                    : "prezantimi-register";
  };

  const classNamePassword = () => {
    return backendMessage
      ? "prezantimi-register"
      : error.password === "Enter your password!"
        ? "wrong-prezantimi-register"
        : error.password === "Enter your password"
          ? "good-prezantimi-register"
          : error.password === "Minimum 8 characters"
            ? "wrong-prezantimi-register"
            : error.password === " Minimum 8 characters"
              ? "half-good-prezantimi"
              : error.password === "Correct form"
                ? "good-prezantimi-register"
                : error.password === " Correct form"
                  ? "good-prezantimi-register"
                  : "prezantimi-register";
  };
  // functions for errors

  const errorEmri = () => {
    return backendMessage ? null : error.emri === "Enter your name!" ? (
      <p className="wrong-sign-in">{error.emri}</p>
    ) : error.emri === "Enter your name" ? (
      <p className="good-sign-in">{error.emri}</p>
    ) : error.emri === "Name should contain only letters!" ? (
      <p className="wrong-sign-in">{error.emri}</p>
    ) : error.emri === " Name should contain only letters!" ? (
      <p className="half-good-sign-in">{error.emri}</p>
    ) : error.emri === "Correct form" ? (
      <p className="good-sign-in">{error.emri}</p>
    ) : error.emri === " Correct form" ? (
      <p className="good-sign-in">{error.emri}</p>
    ) : null;
  };

  const errorMbiemri = () => {
    return backendMessage ? null : error.mbiemri === "Enter your surname!" ? (
      <p className="wrong-sign-in">{error.mbiemri}</p>
    ) : error.mbiemri === "Enter your surname" ? (
      <p className="good-sign-in">{error.mbiemri}</p>
    ) : error.mbiemri === "Surname should contain only letters!" ? (
      <p className="wrong-sign-in">{error.mbiemri}</p>
    ) : error.mbiemri === " Surname should contain only letters!" ? (
      <p className="half-good-sign-in">{error.mbiemri}</p>
    ) : error.mbiemri === "Correct form" ? (
      <p className="good-sign-in">{error.mbiemri}</p>
    ) : error.mbiemri === " Correct form" ? (
      <p className="good-sign-in">{error.mbiemri}</p>
    ) : null;
  };

  const errorUsername = () => {
    return backendMessage ? null : error.username === "Enter your username!" ? (
      <p className="wrong-sign-in">{error.username}</p>
    ) : error.username === "Enter your username" ? (
      <p className="good-sign-in">{error.username}</p>
    ) : error.username === "Correct form" ? (
      <p className="good-sign-in">{error.username}</p>
    ) : error.username === " Correct form" ? (
      <p className="good-sign-in">{error.username}</p>
    ) : error.username === "Username is already in use" ? (
      <p className="wrong-sign-in">{error.username}</p>
    ) : null;
  };

  const errorEmail = () => {
    return backendMessage ? null : error.email === "Enter your email!" ? (
      <p className="wrong-sign-in">{error.email}</p>
    ) : error.email === "Enter your email" ? (
      <p className="good-sign-in">{error.email}</p>
    ) : error.email === "Invalid form of email!" ? (
      <p className="wrong-sign-in">{error.email}</p>
    ) : error.email === " Invalid form of email!" ? (
      <p className="half-good-sign-in">{error.email}</p>
    ) : error.email === "Email is already in use" ? (
      <p className="wrong-sign-in">{error.email}</p>
    ) : error.email === "Correct form" ? (
      <p className="good-sign-in">{error.email}</p>
    ) : error.email === " Correct form" ? (
      <p className="good-sign-in">{error.email}</p>
    ) : null;
  };

  const errorPassword = () => {
    return backendMessage ? (
      <p className="wrong-sign-in">{backendMessage ? backendMessage : null}</p>
    ) : error.password === "Enter your password!" ? (
      <p className="wrong-sign-in">{error.password}</p>
    ) : error.password === "Enter your password" ? (
      <p className="good-sign-in">{error.password}</p>
    ) : error.password === "Minimum 8 characters" ? (
      <p className="wrong-sign-in">{error.password}</p>
    ) : error.password === " Minimum 8 characters" ? (
      <p className="half-good-sign-in">{error.password}</p>
    ) : error.password === "Correct form" ? (
      <p className="good-sign-in">{error.password}</p>
    ) : error.password === " Correct form" ? (
      <p className="good-sign-in">{error.password}</p>
    ) : null;
  };

  return (
    <div className="div-box">
      <form id="register" onSubmit={registerConfirm}>
        <h2>Register</h2>
        <label htmlFor="emri">
          <input
            className={classNameEmri()}
            type="text"
            ref={emri}
            id="emri"
            value={register.emri}
            onChange={setEmri}
            placeholder="Enter your name"
            autoComplete="off"
          ></input>
        </label>
        <div className="error">{errorEmri()}</div>
        <label htmlFor="mbiemri">
          <input
            className={classNameMbiemri()}
            ref={mbiemri}
            type="text"
            value={register.mbiemri}
            onChange={setMbiemri}
            placeholder="Enter your surname"
            autoComplete="off"
          ></input>
        </label>
        <div className="error">{errorMbiemri()}</div>
        <label htmlFor="username">
          <input
            className={classNameUsername()}
            type="text"
            ref={username}
            id="username"
            value={register.username}
            onChange={setUsername}
            placeholder="Enter your username"
            autoComplete="off"
          ></input>
        </label>
        <div className="error">{errorUsername()}</div>
        <label htmlFor="email">
          <input
            className={classNameEmail()}
            type="email"
            name="email-address"
            ref={email}
            id="email"
            value={register.email}
            onChange={setEmail}
            placeholder="Enter your email"
          ></input>
        </label>
        <div className="error">{errorEmail()}</div>
        <label htmlFor="password">
          <input
            className={classNamePassword()}
            type="password"
            ref={password}
            id="password"
            value={register.password}
            onChange={setPassword}
            placeholder="Enter your password"
            autoComplete="off"
          ></input>
        </label>
        <div className="error">{errorPassword()}</div>
        <div className="type">
          <div className="next-to-select">
            <label htmlFor="user-type"></label>
            <select
            style={{cursor:'pointer'}}
              onChange={(e) => setType(e.target.value)}
              className="select"
              name="user-type"
              id="user-type"
            >
              <option value="Buying">Buying</option>
              <option value="Selling">Selling</option>
            </select>
          </div>

          <button className="register-button" type="submit">
            Register
          </button>
        </div>
      </form>
      <div className="register">
        <p
          className="text"
          style={{
            marginRight: 5,
          }}
        >
          Already have an account?{" "}
        </p>
        <button onClick={() => navigate("/Sign-in")} type="button">
          Sign In
        </button>
      </div>
    </div>
  );
}
