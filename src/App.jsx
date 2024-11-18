import React from "react";
import { useState, useEffect } from "react";
// import { useEffect } from 'react'
import Logo from "./Logo.jsx";
// import GetStarted from "./GetStarted.jsx";
import SignInForm from "./forms/SignIn.jsx";
import Register from "./forms/Register.jsx";
import Home from "./forms/Home.jsx";
import AfterRegister from "./forms/AfterRegister.jsx";
import Add from "./forms/Add.jsx";
import AfterAdd from "./forms/AfterAdd.jsx";
import AppLogo from "./forms/AppLogo.jsx";
import AuthMessage from "./forms/AuthMessage.jsx";
import { useGuest } from "./Context.jsx";
import { axiosInstance as useAxiosInstance } from "./forms/AxiosConfig4000.jsx";
import "./App.css";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

export default function App() {
    const [dealer, setDealer] = useState(false);
    const { guest, setGuest } = useGuest()
    const [id, setId] = useState(null);
    const { authMessage, setAuthMessage } = useGuest();
    const [username, setUsername] = useState("");
    const axiosInstance = useAxiosInstance();
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        document.title = "Car Shop"; // Replace with your desired title
      }, []);

    useEffect(() => {
        localStorage.setItem('lastPath', location.pathname)
    }, [location])

    useEffect(() => {

        const token = localStorage.getItem('token')

        if (token) { // if not logged in
            axiosInstance.post('/log-in-token', { token })
                .then(res => {
                    setDealer(res.data?.type);
                    setUsername(res.data?.username);
                    setGuest(false)
                    setId(res.data?.id)
                })
                .catch(err => {
                    const refreshToken = localStorage.getItem('refreshToken')
                    if (err.response?.data === "Token has expired") {
                        if (refreshToken) {
                            axiosInstance.post('/token', { refreshToken })
                                .then(res => {
                                    localStorage.setItem('token', res.data)
                                    axiosInstance.post('/log-in-token', { token: res.data })
                                        .then(secondRes => {
                                            setDealer(secondRes.data?.type);
                                            setUsername(secondRes.data?.username);
                                            setGuest(false)
                                            setId(secondRes.data?.id)
                                        })
                                })

                                .catch(secondErr => {
                                    console.log(secondErr, 'secondErr')
                                    setAuthMessage('Something went wrong, can you please refresh the page and log in again!')
                                })
                        }

                    } else if (err.response?.data === 'Invalid Token') {
                        console.log(err)
                        setAuthMessage('Who are you? Please log in again!')
                    }
                })
        }
    }, [])

    const auth = () => {
        setAuthMessage("");

        axiosInstance
            .post("/sign-out", {
                token: localStorage.getItem("refreshToken"),
            })
            .then(() => {
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("token");
                localStorage.removeItem('checkboxStates')
                setDealer(false);
                setGuest(true)
                setId(null);
                setAuthMessage('')
                setUsername("");

            })
            .catch((err) => {
                console.log(err);
            });
        navigate("/sign-in");
    };

    return (
        <>
            <Routes>
                <Route
                    element={
                        <AppLogo />
                    }
                >
                    <Route
                        path="/Sign-in"
                        element={
                            <SignInForm
                                guest={setGuest}
                                dealer={setDealer}
                                id={setId}
                                username={setUsername}
                            />
                        }
                    ></Route>
                    <Route path="/Add" element={<Add id={id} />}></Route>
                    <Route path="/After-add" element={<AfterAdd />}></Route>
                    <Route path="/After-register" element={<AfterRegister />}></Route>
                    <Route path="/Register" element={<Register />}></Route>
                </Route>

                <Route
                    path="/"
                    element={
                        <Home
                            auth={auth}
                            dealer={dealer}
                            guest={guest}
                            id={id}
                            logo3={Logo}
                            username={username}
                        />
                    }
                ></Route>
            </Routes>

            {authMessage && <AuthMessage auth={auth} authMessage={authMessage} />}
        </>
    );
}
