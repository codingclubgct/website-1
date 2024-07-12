import { Issue, Reaction } from "@/types/issues";
import { Blog, Profile } from "@/types/types";
import * as yup from "yup";
import { githubPat, owner, repo, url } from "./constants";
import { getTimeString } from "./getTimeString";
import { octokit } from "./octokit";
import { GetResponseDataTypeFromEndpointMethod } from "@octokit/types";

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
    const lookup = await fetch(`${url}/data/lookup.json`).then(res => res.json()) as string[]
    const promises = lookup.map(async entry => {
        try {
            const { profile, blogs } = await fetch(`${url}/data/${entry}`).then(res => res.json())
            return blogEntrySchema.validateSync({ profile, blogs })
        } catch (e) {
            console.error(e)
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
    const [nameSlug, folderSlug] = pathname.split("/").filter(Boolean)
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

export const replaceLast = (str: string, pattern: string | RegExp, replacement: string) => {
    const match =
        typeof pattern === 'string'
            ? pattern
            : (str.match(new RegExp(pattern.source, 'g')) || []).slice(-1)[0];
    if (!match) return str;
    const last = str.lastIndexOf(match);
    return last !== -1
        ? `${str.slice(0, last)}${replacement}${str.slice(last + match.length)}`
        : str;
};

export type FileNode = {
    type: "file",
    name: string,
    download_url: string | null,
    path: string,
    level: number,
    absolutePath: string,
}

export type DirectoryNode = {
    type: "dir",
    name: string,
    children: (FileNode | DirectoryNode)[],
    path: string,
    level: number,
    absolutePath: string
}

export const fetchAllFilesForAllUsers = async () => {
    const allFilesPromise = await getAllBlogs().then(allBlogs => allBlogs.map(async entry => {
        const { profile, blogs } = entry
        const data = []
        for (const blog of blogs) {
            const repo = await fetchRepo(blog.remoteSource)
            if (!repo) return null
            const files = await fetchAllFiles(repo)
            data.push({
                ...blog,
                files: files
            })
        }
        return { profile, blogs: data }

    }))
    return Promise.all(allFilesPromise).then(res => res.filter(Boolean) as { profile: Profile, blogs: (Blog & { files: DirectoryNode })[] }[])
}

const fetchAllFiles = async (repo: GetResponseDataTypeFromEndpointMethod<typeof octokit.repos.get>) => {
    const dfs = async (path: string = "", level: number = 0, parentAbsolutePath: string = ""): Promise<DirectoryNode> => {
        const { data } = await octokit.repos.getContent({
            owner: repo.owner.login,
            repo: repo.name,
            path
        })

        const currentDirName = path.split('/').pop() || ""
        const absolutePath = parentAbsolutePath ? `${parentAbsolutePath}/${currentDirName}` : currentDirName

        const node: DirectoryNode = {
            type: "dir",
            name: currentDirName,
            children: [],
            level,
            path,
            absolutePath
        }

        if (Array.isArray(data)) {
            for (const file of data) {
                if (file.type === "file" && file.name.endsWith(".md")) {
                    node.children.push({
                        type: "file",
                        name: file.name,
                        download_url: file.download_url,
                        path: file.path,
                        level: level + 1,
                        absolutePath: `${absolutePath}/${file.name}`
                    } as FileNode)
                } else if (file.type === "dir") {
                    const childNode = await dfs(file.path, level + 1, absolutePath)
                    if (childNode.children.length > 0) {
                        node.children.push(childNode)
                    }
                }
            }
        }

        return node
    }

    return dfs()
}