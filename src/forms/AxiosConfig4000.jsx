/* eslint-disable react-hooks/rules-of-hooks */
import axios from 'axios';
import { useEffect, useMemo } from 'react';
import { useGuest } from '../Context';

export const axiosInstance = () => {
    const { guest, setAuthMessage } = useGuest();

    const axiosInstance2 = useMemo(() => {
        const instance = axios.create({
            baseURL: 'https://car-shop-backend-auth-agashi01.onrender.com',
        });

        return instance;
    }, []);

    useEffect(() => {

        const requestInterceptor = axiosInstance2.interceptors.request.use(
            (config) => {

                config.headers['guest'] = typeof guest !== "undefined" ? String(guest) : delete config.headers['guest']

                return config
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
                return config
            },
            (error) => {
                const errMessage = error.response?.message
                if (errMessage && errMessage.success === false) {
                    setAuthMessage('Something went wrong, please refresh the page and log in again');
                    throw new axios.Cancel("request canceled because of the big error")
                }
                return Promise.reject(error)
            }
        )

        return () => {
            axiosInstance2.interceptors.response.eject(responseInterceptor)
        }

    }, [])


    return axiosInstance2;
};