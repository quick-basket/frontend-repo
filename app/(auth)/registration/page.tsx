"use client"

import React, {useState} from 'react';
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {string} from "prop-types";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {useForm} from "react-hook-form";
import AuthAPI, {RegistrationBody} from "@/api/auth/authAPI";
import {swalAlert, swalConfirm} from "@/utils/alert/swalAlert";
import Swal from "sweetalert2";
import {signIn} from "next-auth/react";
import Spinner from "@/components/spinner/Spinner";

const Registration = () => {
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<RegistrationBody>();

    const onSubmit = async (data: RegistrationBody) => {
        setIsLoading(true); // Start loading spinner

        try {
            const response = await AuthAPI.registration(data);
            console.log("RESPONSE", response);

            if (!response.success) {
                await swalAlert({
                    icon: "error",
                    title: "Registration Failed",
                    text: response.message,
                    showConfirmButton: true,
                });
                return;
            }

            await swalConfirm(response.message, "Check your email for verification");
        } catch (error: any) {
            console.error("An error occurred:", error.message);
            if (error.message.includes("social account")) {
                await Swal.fire({
                    icon: "error",
                    title: "Account Already Exists",
                    text: error.message,
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Log in with Google",
                    cancelButtonText: "Cancel",
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Redirect to social login
                        signIn("google");
                    }
                });
            } else {
                await swalAlert({
                    icon: "error",
                    title: "Registration Failed",
                    text: error.message,
                    showConfirmButton: true,
                });
            }
        } finally {
            setIsLoading(false); // Stop loading spinner
        }
    };

    return (
        <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Register</h1>
                        <p className="text-balance text-muted-foreground">
                            Create your account by entering your details below
                        </p>
                    </div>
                    {isLoading ? (
                        <Spinner/>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    {...register("name", {
                                        required: "Name is required",
                                    })}
                                    className={errors.name ? "border-red-500" : ""}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">{errors.name.message}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="+1234567890"
                                    {...register("phone", {
                                        required: "Phone number is required",
                                        pattern: {
                                            value: /^(\+?62|0)[1-9]\d{7,11}$/,
                                            message: "Invalid phone number",
                                        },
                                    })}
                                    className={errors.phone ? "border-red-500" : ""}
                                />
                                {errors.phone && (
                                    <p className="text-sm text-red-500">{errors.phone.message}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                            message: "Invalid email address",
                                        },
                                    })}
                                    className={errors.email ? "border-red-500" : ""}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email.message}</p>
                                )}
                            </div>
                            <Button type="submit" className="w-full">
                                Verify Email
                            </Button>
                        </form>
                    )}
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="underline">
                            Login
                        </Link>
                    </div>
                </div>
            </div>
            <div className="hidden bg-muted lg:block">
                <img
                    src="/logo-transformed.webp"
                    alt="Image"
                    width={1920}
                    height={1080}
                    className="h-full w-full object-contain mix-blend-normal"
                />
            </div>
        </div>
    );
}

export default Registration;