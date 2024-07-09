import { Issue, Reaction } from "@/types/issues";
import { githubPat, owner, repo } from "./constants";
import { getTimeString } from "./getTimeString";
import lookup from "@/data/lookup.json"
import * as yup from "yup";
import { Blogs as Blog, Profile } from "@/types/types";
import { GetResponseDataTypeFromEndpointMethod } from "@octokit/types"
import { octokit } from "./octokit";

export const getIssueNumberFromString = (slug: string) => slug.match(/\d+/)?.[0];

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

async function getProfileFromUsername(username: string) {
    const profile = await fetch(`https://api.github.com/users/${username}`, {
        method: "GET",
        headers: {
            "Authorization": `token ${githubPat}`,
            "Content-Type": "application/json"
        },
        cache: "force-cache"
    }).then(res => res.json())
    return profile
}

export async function getIssueNumber(title: string) {
    const issues: Issue[] = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
        headers: {
            "Accept": "application/vnd.github+json",
            "Authorization": `Bearer ${githubPat}`,
        },
    }).then(res => res.json());
    const found = issues.find(issue => issue.title === title)
    if (!found) {
        const { id } = await fetch("https://api.github.com/user", {
            method: "GET",
            headers: {
                "Authorization": `token ${githubPat}`,
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
        if (id === 80976002) { // User id of Joel Samuel
            const resp: Issue = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
                method: "POST",
                headers: {
                    "Accept": "application/vnd.github+json",
                    "Authorization": `Bearer ${githubPat}`
                }, body: JSON.stringify({
                    title,
                    body: "Using this space as comment section for the blog post of above pathname",
                })
            }).then(res => res.json())
            return resp.number
        }
        return 20
    }
    return found.number
}

export type GithubDataForBlog = {
    author: {
        name: string,
        blog: string,
        html_url: string,
        email: string,
        avatar_url: string
        date: string
    }, committer: {
        name: string,
        avatar_url: string
        committed_date: string
    }
}

export async function getGithubDataforBlog(pathname: string): Promise<GithubDataForBlog | undefined> {
    const filePathName = `apps/blogs/src/blogs/${pathname}.mdx`
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits?path=${filePathName}`
    console.log(apiUrl)
    const resp = await fetch(apiUrl, {
        method: "GET",
        headers: {
            "Authorization": `token ${githubPat}`,
            "X-GitHub-Api-Version": "2022-11-28"
        },
        cache: "force-cache"
    }).then(res => res.json())
    if (!resp.length) {
        console.log(resp)
        return undefined
    }
    const { committer } = resp[0]
    const { author, commit: initialCommit } = resp[resp.length - 1]
    const { name, blog, html_url, email } = await getProfileFromUsername(author.login)
    const { name: committerName } = await getProfileFromUsername(committer.login)
    return {
        author: { name, blog, html_url, email, avatar_url: author.avatar_url, date: getTimeString(initialCommit.author.date) },
        committer: { name: committerName, avatar_url: committer.avatar_url, committed_date: getTimeString(resp[0].commit.committer.date) }
    }
}

export const getAllBlogs = async () => {
    const promises = lookup.map(async entry => {
        try {
            const { profile, blogs } = await import(`@/data/${entry}`)
            return blogEntrySchema.validateSync({ profile, blogs })
        } catch (e) {
            // console.error(e)
            return null
        }
    })
    return Promise.all(promises).then(res => res.filter(Boolean)) as Promise<Entry[]>
}

export const blogEntrySchema = yup.object<Entry>().shape({
    profile: yup.object().shape({
        name: yup.string().required(),
        nameSlug: yup.string().matches(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/, "Incorrect format for a slug").required(),
        github: yup.string().required(),
        avatar: yup.string()
    }),
    blogs: yup.array().of(yup.object().shape({
        title: yup.string().required(),
        folderName: yup.string().required(),
        folderSlug: yup.string().matches(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/, "Incorrect format for a slug").required(),
        hidden: yup.boolean().default(false),
        remoteSource: yup.string().url().required(),
        issuesUrl: yup.string().url()
    })).required()
})

type Entry = {
    profile: Profile,
    blogs: Blog[]
}

export const fetchRepo = async (url: string) => {
    const { owner, repo } = getRemoteSourceMetadata(url)
    if (!owner || !repo) return null

    return octokit.repos.get({
        owner: owner,
        repo
    }).then(res => res.data)
}

export const getBlogData = async (pathname: string) => {
    const [nameSlug, folderSlug] = pathname.split("/")
    const blogs = await getAllBlogs()
    const user = blogs.find(entry => entry.profile.nameSlug === nameSlug)
    const blog = user?.blogs.find(blog => blog.folderSlug === folderSlug)
    if (!user || !blog) return null
    const repo = await fetchRepo(blog.remoteSource)
    if (!repo) return null
    return { user, blog, repo }
}

export const getRemoteSourceMetadata = (url: string) => {
    const [, owner, repo] = url.match(/github\.com\/([^\/]+)\/([^\/]+)/) ?? [];
    return { owner, repo }
}