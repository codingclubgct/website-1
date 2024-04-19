import { githubPat, owner, repo } from "@/lib/constants";
import { NextResponse } from "next/server";

export async function GET() {
    const res = fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
        headers: {
            "Accept": "application/vnd.github+json",
            "Authorization": `Bearer ${githubPat}`,
        },
    })
    return NextResponse.json(res)
}