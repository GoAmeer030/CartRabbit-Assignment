/**
 * VerifyEmail Component
 * 
 * This component is responsible for handling the email verification process.
 * It extracts the verification code from the URL query parameters and sends it to the server
 * to verify the user's email. Depending on the server's response, it displays a message to the user.
 * The component also includes a button to return to the home page after the verification process.
 */

import { useEffect, useState } from "react"
import { useLocation, useNavigate } from 'react-router-dom';
import axios, { AxiosError } from "axios";

import { House } from 'lucide-react';
import { Button } from "@/components/ui/button";

import Navbar from "@/components/navbar"

export default function VerifyEmail() {
    const queryParams = new URLSearchParams(useLocation().search);
    const code = queryParams.get("code");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/auth/verify/${code}/`);
                setMessage(response.data.message);
            } catch (error) {
                if (error instanceof AxiosError && error.response && error.response.status === 400) {
                    setMessage(error.response.data.message);
                }
            }
        }
        fetchData();
        // eslint-disable-next-line
    }, []);

    const handleReturn = () => {
        navigate("/");
    }

    return (
        <>
            <Navbar />
            <div className="flex flex-col justify-center items-center h-screen w-screen">
                <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">{message}</h1>
                <Button onClick={handleReturn} className="mt-5">Return <House className="lg:h-5 lg:w-5 md:h-5 md:w-5 h-8 w-8 lg:ml-2 ml-1" /></Button>
            </div>
        </>
    )
}