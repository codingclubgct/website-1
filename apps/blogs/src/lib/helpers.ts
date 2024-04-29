import { Issue, Reaction } from "@/types/issues";
import { githubPat, owner, repo } from "./constants";

export const getIssueNumber = (slug: string) => slug.match(/\d+/)?.[0];

export async function _getReactions(slug: string) {
    const issuesRes: Issue = await fetch(`https://api.github.com/repos/${owner}/${repo}/${slug}`, {
        headers: {
            "Authorization": `Bearer ${githubPat}`
        },
        cache: "no-store"
    }).then(res => res.json())
    const reactionsRes: Reaction[] = await fetch(issuesRes.reactions.url, {
        headers: {
            "Authorization": `Bearer ${githubPat}`
        }
    }).then(res => res.json())
    return { issuesRes, reactionsRes }
}
