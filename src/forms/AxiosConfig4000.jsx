/* eslint-disable react-hooks/rules-of-hooks */
import axios from 'axios';
import { useEffect, useMemo } from 'react';
import { useGuest } from '../Context';

export const axiosInstance = () => {
    const { guest} = useGuest();

    const axiosInstance2 = useMemo(() => {
        const instance = axios.create({
            baseURL: 'http://localhost:4000',
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


    return axiosInstance2;
};