export async function POST(req: Request) {
    const { access_token, nick } = await req.json()
    const status = await fetch("https://discord.com/api/users/@me", {
        headers: {
            "Authorization": `Bearer ${access_token}`
        }
    }).then(res => res.json()).then(async (user) => {
        return await fetch(`https://discord.com/api/guilds/1008950812778704897/members/${user.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bot ${process.env.DISCORD_TOKEN}`
            },
            body: JSON.stringify({
                access_token,
                nick,
                roles: ["1199063468897218641"]
            })
        }).then(async (res) => {
            if (res.status === 204) {
                await fetch(`https://discord.com/api/guilds/1008950812778704897/members/${user.id}/roles/1199063468897218641`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bot ${process.env.DISCORD_TOKEN}`
                    }
                })
                return await fetch(`https://discord.com/api/guilds/1008950812778704897/members/${user.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bot ${process.env.DISCORD_TOKEN}`
                    }, body: JSON.stringify({
                        nick
                    })
                }).then(_ => 202)
            }
            else return 200
        })
    })
    return new Response(null, { status })
}