import NextAuth, { NextAuthOptions, Session } from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET!,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    },
    providers: [
        GithubProvider({
            clientId: process.env.NEXT_PUBLIC_GITHUB_ID!,
            clientSecret: process.env.NEXT_PUBLIC_GITHUB_SECRET!,
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