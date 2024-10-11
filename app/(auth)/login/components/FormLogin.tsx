"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { swalAlert } from "@/utils/alert/swalAlert";
import { useLocationContext } from "@/hooks/context/LocationProvider";

type FormData = {
  email: string;
  password: string;
};

const FormLogin = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { clearLocationData } = useLocationContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const result = await signIn("credentials", {
        username: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        console.error("error", result.error);
        await swalAlert({
          icon: "error",
          title: "Error",
          text: result.error,
          showConfirmButton: true,
        });
      } else {
        clearLocationData();

        // const updatedSession = await fetch("/api/auth/session").then((res) =>
        //   res.json()
        // );
        //
        // console.log("FETCHING FROM AUTH SESSION: ", updatedSession);

        await swalAlert({
          title: "Success",
          icon: "success",
          text: "Welcome",
          timer: 2500,
          showConfirmButton: false,
        });

        // if (updatedSession?.user?.scope === "super_admin") {
        //   router.push("/dashboard");
        // } else if (updatedSession?.user?.scope === "store_admin") {
        //   router.push("/dashboard/stores/1");
        // } else {
        //   router.push("/");
        // }
      }
    } catch (error) {
      console.error("An error occurred during sign in:", error);
      // Handle unexpected errors
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
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
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="password">Password</Label>
          <Link href="/" className="ml-auto inline-block text-sm underline">
            Forgot your password?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          className={errors.password ? "border-red-500" : ""}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full">
        Login
      </Button>
    </form>
  );
};

export default FormLogin;
