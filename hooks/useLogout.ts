import {signOut} from "next-auth/react";
import {useCallback} from "react";
import {useLocationContext} from "@/hooks/context/LocationProvider";
import {useQueryClient} from "@tanstack/react-query";
import AuthAPI from "@/api/auth/authAPI";
import {queryKeys} from "@/constants/queryKey";

export function useLogout() {
    const {clearLocationData, setIsLoggedIn} = useLocationContext()
    const queryClient = useQueryClient();

    return useCallback(() => {
        const logout = async () => {
            try {
                setIsLoggedIn(false);

                // clear location data
                clearLocationData();

                queryClient.clear();
                //logout backend
                await AuthAPI.logout();

                // Clear the custom 'sid' cookie
                document.cookie = 'sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

                // Invalidate and refetch the location query to get the nearest store for non-logged in state
                queryClient.invalidateQueries({
                    queryKey: [queryKeys.location.GET_LOCATION]
                });

                // Sign out using NextAuth
                await signOut({ callbackUrl: '/' });
            } catch (error) {
                console.error('Logout failed:', error);
            }
        };

        return logout();
    }, [clearLocationData, queryClient, setIsLoggedIn]);
}