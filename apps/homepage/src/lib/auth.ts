import NextAuth, { NextAuthOptions, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from 'next-auth/providers/discord'



export type SessionType = Session & { access_token: string, provider: string }

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET!,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    },
    callbacks: {
        session: async ({ session, token }) => {
            if (session) {
                session = Object.assign({}, session, { access_token: token.access_token, provider: token.provider }) as SessionType
            }
            return session
        },
        jwt: async ({ token, account, profile }) => {
            if (account) {
                token = Object.assign({}, token, { access_token: account.access_token, provider: account.provider })
            }
            return token
        }
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: "identify guilds.join"
                }
            }
        })
    ],

}

export default NextAuth(authOptions)