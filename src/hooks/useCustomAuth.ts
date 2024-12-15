import { useAuth } from "@clerk/clerk-react";

export function useCustomAuth() {
  const { getToken, isSignedIn, signOut, isLoaded, userId } = useAuth();

  return { getToken, isSignedIn, signOut, isLoaded, userId };
}
