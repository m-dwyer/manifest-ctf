// import { createContext, useContext, useEffect, useState } from "react";

// import { Session, SupabaseClient, User } from "@supabase/supabase-js";

// export const AuthContext = createContext<{
//   user: User | null;
//   session: Session | null;
//   signUp: null | ((email: string, password: string) => void);
// }>({ user: null, session: null, signUp: null });

// type AuthProviderProps = {
//   supabase: SupabaseClient;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   [x: string]: any;
// };

// export const AuthProvider = ({ supabase, ...props }: AuthProviderProps) => {
//   const [session, setSession] = useState<Session | null>(null);
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     const session = supabase.auth.session();
//     setSession(session);
//     setUser(session?.user ?? null);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{
//         session,
//         user,
//         signUp: (email, password) => supabase.auth.signUp({ email, password }),
//       }}
//       {...props}
//     />
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }

//   return context;
// };
