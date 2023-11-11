import NextAuth from "next-auth";
import GitHub from "next-auth/providers/GitHub";

export const { handlers, auth, signOut } = NextAuth({ providers: [GitHub] });
