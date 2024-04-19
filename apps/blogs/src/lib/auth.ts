import NextAuth, { NextAuthOptions, Session } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { githubId, githubSecret, nextAuthSecret } from "./constants";

export const authOptions: NextAuthOptions = {
    secret: nextAuthSecret,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    },
    providers: [
        GithubProvider({
            clientId: githubId!,
            clientSecret: githubSecret!,
            authorization: {
                params: {
                    scope: "read:user user:email repo"
                }
            }
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                const { id } = await fetch(`https://api.github.com/user`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${account.access_token}`
                    }
                }).then(res => res.json())
                token = Object.assign({}, token, { access_token: account.access_token, id: id });
            }
            return token
        },
        async session({ session, token }) {
            if (session) {
                session = Object.assign({}, session, { access_token: token.access_token, id: token.id }) as Session & { access_token: string, id: number }
            }
            return session
        }
    }
}

export default NextAuth(authOptions)