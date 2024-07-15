import { octokit } from "@/lib/octokit";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
    const { comment_id, body, owner, repo } = await req.json()
    const { data } = await octokit.issues.updateComment({
        comment_id: Number(comment_id),
        body,
        owner,
        repo
    })
    return NextResponse.json(data)
}

export async function DELETE(req: Request) {
    const { id, owner, repo } = await req.json()
    const { data } = await octokit.issues.deleteComment({
        owner, repo, comment_id: Number(id)
    })
    return NextResponse.json(data)
}

export async function POST(req: Request) {
    const { body, owner, repo, issueNumber } = await req.json()

    const { data } = await octokit.issues.createComment({
        owner, repo, issue_number: Number(issueNumber), body
    })
    return NextResponse.json(data)
}

export async function GET(req: Request) {
    const reqUrl = new URL(req.url)
    const owner = reqUrl.searchParams.get("owner")
    const repo = reqUrl.searchParams.get("repo")
    const issue_number = reqUrl.searchParams.get("issue_number")

    if (!owner || !repo || !issue_number) return NextResponse.json({ error: "owner, repo and issue_number are required" }, { status: 400 })

    const { data } = await octokit.issues.listComments({
        owner, repo, issue_number: Number(issue_number)
    })
    return NextResponse.json(data)
}