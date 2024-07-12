import { githubPat, owner, repo } from "@/lib/constants";
import { octokit } from "@/lib/octokit";
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
    const { issuesUrl, newComment, access_token } = await req.json()
    if (!extractGithubIssueDetails(issuesUrl!)) return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
    const { owner, repo, issueNumber } = extractGithubIssueDetails(issuesUrl)!

    const res = fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${access_token}`
        }, body: JSON.stringify({ body: newComment })
    })
    return NextResponse.json(res)
}

export async function GET(req: Request) {
    const reqUrl = new URL(req.url)
    const issuesUrl = reqUrl.searchParams.get("issuesUrl")
    if (!extractGithubIssueDetails(issuesUrl!)) return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
    const { owner, repo, issueNumber } = extractGithubIssueDetails(issuesUrl!)!
    const { data } = await octokit.issues.listComments({
        owner, repo, issue_number: parseInt(issueNumber)
    })
    return NextResponse.json(data)
}

const extractGithubIssueDetails = (url: string) => {
    const match = url.match(/https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/issues\/(\d+)/);
    return match ? { owner: match[1], repo: match[2], issueNumber: match[3] } : null;
};