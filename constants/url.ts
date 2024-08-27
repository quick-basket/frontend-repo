export const config = {
    BASE_URL: process.env.BASE_URL || 'http://localhost:8080/api/v1',
    endpoints: {
        auth: {
            login: "/auth/login",
            register: "/auth/register",
            logout: "/auth/logout",
            checkEmail: "/auth/check-email",
            generateToken: "/auth/generate-token",
            loginGoogle: "/auth/google-signin",
            verifyCode: "/auth/verify",
            setPassword: "/auth/set-password",
        }
    }
}