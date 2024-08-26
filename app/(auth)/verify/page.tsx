"use client"

import React, {useEffect, useState} from 'react';
import {useRouter, useSearchParams} from "next/navigation";
import {useForm} from "react-hook-form";
import {signIn} from "next-auth/react";
import {swalAlert} from "@/utils/alert/swalAlert";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import AuthAPI from "@/api/auth/authAPI";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {TriangleAlert} from "lucide-react";
import Spinner from "@/components/spinner/Spinner";

interface FormData {
    password: string
    confirmPassword: string
}

const validationPassword = {
    required: "Password is required",
    minLength: {
        value: 8,
        message: "Password must be at least 8 characters",
    },
    pattern: {
        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        message: "Password must include at least one uppercase letter, one number, and one special character",
    }
}

const Verify = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const verificationCode = searchParams.get("code");
    console.log('VERIFICATION CODE', verificationCode);

    const [isCodeValid, setIsCodeValid] = useState<boolean | null>(null)

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<FormData>()

    useEffect(() => {
        const checkCodeValidity = async () => {
            console.log(verificationCode);
            if (verificationCode){
                try {
                    const response = await AuthAPI.verifyCode(verificationCode);
                    console.log("RESPONSE", response);
                    setIsCodeValid(response.data)
                } catch (error) {
                    setIsCodeValid(false)
                }
            } else {
                setIsCodeValid(false)
            }
        }
        checkCodeValidity();
    }, [verificationCode]);


    const onSubmit = async (data: FormData) => {
        try {
            const response = await AuthAPI.setPassword(data.password, data.confirmPassword, verificationCode as string);
            await swalAlert({
                icon: "success",
                title: "Register Success",
                text: "Click the button to go to homepage",
                showConfirmButton: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push("/");
                }
            })
        } catch (error: any) {
            await swalAlert({
                icon: "error",
                title: "Error",
                text: error.message,
                showConfirmButton: false,
                timer: 2000
            })
        }
    }

    if (isCodeValid === null) {
        return <Spinner/>
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-10">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                {
                    !isCodeValid ? (
                        <Alert variant="destructive">
                            <TriangleAlert className="h-4 w-4"/>
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                Your verification code has expired. Please register again.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    {...register("password", validationPassword)}
                                    className={errors.password ? "border-red-500" : ""}
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-500">{errors.password.message}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    {...register("confirmPassword", validationPassword)}
                                    className={errors.password ? "border-red-500" : ""}
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-500">{errors.password.message}</p>
                                )}
                            </div>
                            <Button type="submit"
                                    className="w-full">
                                Set Password
                            </Button>
                        </form>
                    )
                }
            </div>
        </div>
    );
};

export default Verify;