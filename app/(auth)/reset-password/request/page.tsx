"use client"

import React from 'react';
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import AuthAPI from "@/api/auth/authAPI";
import {swalAlert} from "@/utils/alert/swalAlert";

interface FormData {
    email: string;
}

const ResetPasswordRequest = () => {
    const {register, handleSubmit, formState: {errors}} = useForm<FormData>()

    const onSubmit = async (data: FormData) => {
        try {
            const response = await AuthAPI.requestResetPassword(data.email);

            if (!response.success) {
                await swalAlert({
                    title: "Reset Password Failed",
                    text: response.message,
                    icon: "error",
                    showConfirmButton: true
                });
                return;
            }

            await swalAlert({
                title: "Reset",
                icon: "success",
                text: "Check your email for the next step",
                timer: 2000,
            });
        } catch (error: any) {
            console.error("An error occurred:", error.message);
            await swalAlert({
                title: "An Error Occurred",
                text: error.message || "Something went wrong. Please try again.",
                icon: "error",
                showConfirmButton: true,
            });
        }

    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-10">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                    <div className="grid gap-2">
                        <h3>Request Reset Password</h3>
                        <p className="text-xs pb-4">You need to put email that you register</p>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Invalid email address",
                                }
                            })}
                            className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email.message}</p>
                        )}
                    </div>
                    <Button type="submit"
                            className="w-full">
                        Request Reset
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordRequest;