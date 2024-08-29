"use client"

import React, {useEffect, useState} from 'react';
import {useRouter, useSearchParams} from "next/navigation";
import {useForm} from "react-hook-form";
import AuthAPI from "@/api/auth/authAPI";
import {swalAlert} from "@/utils/alert/swalAlert";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {TriangleAlert} from "lucide-react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {validationPassword} from "@/utils/validation";
import Spinner from "@/components/spinner/Spinner";

interface FormData {
    password: string;
    confirmPassword: string;
}

const ResetPassword = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const verificationCode = searchParams.get("code");

    const [isCodeValid, setIsCodeValid] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    useEffect(() => {
        const checkCodeValidity = async () => {
            console.log(verificationCode);
            if (verificationCode) {
                try {
                    const response = await AuthAPI.verifyResetPassword(verificationCode);
                    console.log("RESPONSE", response);
                    setIsCodeValid(response.data);
                } catch (error) {
                    setIsCodeValid(false);
                }
            } else {
                setIsCodeValid(false);
            }
        };
        checkCodeValidity();
    }, [verificationCode]);

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        try {
            const response = await AuthAPI.resetPassword(data.password, data.confirmPassword, verificationCode as string);
            await swalAlert({
                icon: "success",
                title: "Reset Password Success",
                text: "Click the button to go to homepage",
                showConfirmButton: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push("/");
                }
            });
        } catch (error: any) {
            await swalAlert({
                icon: "error",
                title: "Error",
                text: error.message,
                showConfirmButton: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-10">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                {!isCodeValid ? (
                    <Alert variant="destructive">
                        <TriangleAlert className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            Your verification code has expired. Please register again.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="password">New Password</Label>
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
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                {...register("confirmPassword", validationPassword)}
                                className={errors.confirmPassword ? "border-red-500" : ""}
                            />
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                            )}
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Spinner /> : 'Reset Password'}
                        </Button>
                    </form>
                )}
            </div>
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <Spinner />
                </div>
            )}
        </div>
    );
};

export default ResetPassword;