/* eslint-disable react-hooks/rules-of-hooks */
import axios from "axios";
import { useEffect, useMemo } from "react";
import { useGuest } from "../Context";

export const axiosInstance = () => {
  const { guest, setAuthMessage } = useGuest();

  const axiosInstance2 = useMemo(() => {
    const instance = axios.create({
      baseURL: "http://localhost:3000",
    });

    return instance;
  }, []);

  useEffect(() => {

    const requestInterceptor = axiosInstance2.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");

        config.headers["Authorization"] = token && `Bearer ${token}`;

        config.headers["guest"] =
          typeof guest !== "undefined" ? String(guest) : delete config.headers["guest"];

        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axiosInstance2.interceptors.request.eject(requestInterceptor);

    };
  }, [guest]);

  useEffect(() => {

    const responseInterceptor = axiosInstance2.interceptors.response.use(
      (config) => {
        return config;
      },
      async (error) => {
        const original = error.config;
        const errMessage = error.response?.data;
        if(errMessage.success===false){
          setAuthMessage('Something went wrong, please refresh the page and log in again');
          throw new axios.Cancel('request canceled because of the big Error')
        }
  
        if (!original._retry) {
          original._retry = 0;
        }
  
        if (original._retry < 1 && errMessage === "Token has expired") {
          original._retry += 1;
  
          try {
            const refreshToken = localStorage.getItem("refreshToken");
  
            const response = await axios.post("http://localhost:4000/token", { refreshToken });
  
            const newToken = response.data;
            localStorage.setItem('token', newToken);
  

            original.headers['Authorization'] = `Bearer ${newToken}`;
  

            return axiosInstance2(original);
          } catch (err) {

            console.log(err);
            if (err.response?.data === 'Invalid token') {
              setAuthMessage('Who are you? Please refresh the page and log in again!');
            } else if (err.response?.data === 'Token has expired') {
              setAuthMessage('Unable to refresh token, please refresh the page and log in again');
            } else if(errMessage==="you dont have a token in authorization"){
              setAuthMessage('Who are you? Please log in again!');
              return Promise.reject(error);
            } else {
              setAuthMessage('Something went wrong, please refresh the page and log in again');
            }
            return Promise.reject(err);
          }
        } else if (original._retry < 1 && errMessage === 'Invalid token') {
          original._retry += 1;
          setAuthMessage('Who are you? Please log in again!');
          return Promise.reject(error);
        }else if( errMessage==='Token verification failed'){
          original._retry += 1;
        setAuthMessage('Something went wrong, can you please refresh the page and log in again!');
        return Promise.reject(error);
        }else if(errMessage==="you dont have a token in authorization"){
          setAuthMessage('Who are you? Please log in again!');
          return Promise.reject(error);
        }
       
        return Promise.reject(error);
      }
    );
  
    return () => {
      axiosInstance2.interceptors.response.eject(responseInterceptor);
    }
  }, []);
  






  return axiosInstance2;
};
