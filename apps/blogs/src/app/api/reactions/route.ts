import { githubPat, owner, repo } from "@/lib/constants";
import { _getReactions } from "@/lib/helpers";
import { Issue, Reaction } from "@/types/issues";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    const { slug, id } = await req.json()

    const res = fetch(`https://api.github.com/repos/${owner}/${repo}/${slug}/reactions/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${githubPat}`
        }
    })
    return NextResponse.json(res)
}

export async function POST(req: Request) {
    const { content, slug } = await req.json()

    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/${slug}/reactions`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${githubPat}`
        }, body: JSON.stringify({
            content
        })
    })
    return res
}

export async function GET(req: Request) {
    const url = new URL(req.url)
    const slug = url.searchParams.get("slug")
    if (!slug) {
        return NextResponse.json({ error: "Slug is required" }, { status: 400 })
    }
    const data = await _getReactions(slug)
    return NextResponse.json(data)
}