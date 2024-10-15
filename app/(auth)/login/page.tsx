"use client"
import React from "react"
import Image from "next/image"
import Link from "next/link"
import {Button} from "@/components/ui/button"
import FormLogin from "@/app/(auth)/login/components/FormLogin";
import {signIn} from "next-auth/react";
import {useLocationContext} from "@/hooks/context/LocationProvider";

function Login() {

    const handleGoogleSignIn = async () => {
        await signIn('google', {
            callbackUrl: '/dashboard',
        });
    }

    return (
        <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Login</h1>
                        <p className="text-balance text-muted-foreground">
                            Enter your email below to login to your account
                        </p>
                    </div>
                    <FormLogin/>
                    <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
                        Login with Google
                    </Button>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="/registration" target={"_blank"} className="underline">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
            <div className="hidden bg-muted lg:block">
                <Image
                    src="/logo-transformed.webp"
                    alt="Image"
                    width={1920}
                    height={1080}
                    style={{objectFit: "contain"}}
                    className="h-full w-full object-contain mix-blend-normal"
                />
            </div>
        </div>
    )
}

export default Login;
