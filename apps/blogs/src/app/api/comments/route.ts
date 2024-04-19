import { githubPat, owner, repo } from "@/lib/constants";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
    const { id, access_token, body } = await req.json()
    const res = fetch(`https://api.github.com/repos/${owner}/${repo}/issues/comments/${id}`, {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${access_token}`
        }, body: JSON.stringify({ body })
    })
    return NextResponse.json(res)
}

export async function DELETE(req: Request) {
    const { id, access_token } = await req.json()
    const res = fetch(`https://api.github.com/repos/${owner}/${repo}/issues/comments/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${access_token}`
        }
    })
    return NextResponse.json(res)
}

export async function POST(req: Request) {
    const { slug, newComment, access_token } = await req.json()

    const res = fetch(`https://api.github.com/repos/${owner}/${repo}/${slug}/comments`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${access_token}`
        }, body: JSON.stringify({ body: newComment })
    })
    return NextResponse.json(res)
}

export async function GET(req: Request) {
    const reqUrl = new URL(req.url)
    const slug = reqUrl.searchParams.get("slug")
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/${slug}/comments`, {
        headers: {
            "Authorization": `Bearer ${githubPat}`
        }
    }).then(res => res.json())
    return NextResponse.json(res)
}