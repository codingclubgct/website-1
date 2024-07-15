import { octokit } from "@/lib/octokit";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    const { comment_id, owner, repo, reaction_id } = await req.json()
    const { data } = await octokit.reactions.deleteForIssueComment({
        comment_id: Number(comment_id),
        owner,
        repo,
        reaction_id: Number(reaction_id)
    })

    return NextResponse.json(data)
}

export async function POST(req: Request) {
    const { content, comment_id, owner, repo } = await req.json()
    const { data } = await octokit.reactions.createForIssueComment({
        comment_id: Number(comment_id),
        content,
        owner,
        repo
    })
    return NextResponse.json(data)
}

export async function GET(req: Request) {

    const url = new URL(req.url)
    const owner = url.searchParams.get("owner")
    const repo = url.searchParams.get("repo")
    const comment_id = url.searchParams.get("comment_id")

    if (!owner || !repo || !comment_id) return NextResponse.json({ error: "owner, repo and comment_id are required" }, { status: 400 })

    const { data } = await octokit.reactions.listForIssueComment({
        owner, repo, comment_id: Number(comment_id)
    })

    return NextResponse.json(data)
}