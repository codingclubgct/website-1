import { Issue, Reaction } from "@/types/issues";
import { Blog, Profile } from "@/types/types";
import * as yup from "yup";
import { githubPat, url } from "./constants";
import { octokit } from "./octokit";
import { GetResponseDataTypeFromEndpointMethod } from "@octokit/types";

export const getIssueNumberFromString = (slug: string) => slug.match(/\d+/)?.[0];

// export async function _getReactions(url: string) {
//     const issuesRes: Issue = await fetch(`https://api.github.com/repos/${owner}/${repo}/${slug}`, {
//         headers: {
//             "Authorization": `Bearer ${githubPat}`
//         },
//         cache: "no-store"
//     }).then(res => res.json())
//     const reactionsRes: Reaction[] = await fetch(issuesRes.reactions.url, {
//         headers: {
//             "Authorization": `Bearer ${githubPat}`
//         }
//     }).then(res => res.json())
//     return { issuesRes, reactionsRes }
// }

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

export const getAllBlogs = async () => {
    const lookup = await fetch(`${url}/data/lookup.json`).then(res => res.json()) as string[]
    const promises = lookup.map(async entry => {
        try {
            const { profile, blogs } = await fetch(`${url}/data/${entry}`).then(res => res.json())
            return blogEntrySchema.validateSync({ profile, blogs })
        } catch (error) {
            console.error({ error })
            return null
        }
    })
    return Promise.all(promises).then(res => res.filter(Boolean)) as Promise<Entry[]>
}

export const blogEntrySchema = yup.object<Entry>().shape({
    profile: yup.object().shape({
        name: yup.string().required(),
        nameSlug: yup.string().required(),
        github: yup.string().required(),
        avatar: yup.string()
    }),
    blogs: yup.array().of(yup.object().shape({
        folderSlug: yup.string().matches(/^[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*$/, "Incorrect format for a slug").required(),
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
            const files = await fetchAllFiles(repo, blog.basePath)
            data.push({
                ...blog,
                files: files
            })
        }
        return { profile, blogs: data }

    }))
    return Promise.all(allFilesPromise).then(res => res.filter(Boolean) as { profile: Profile, blogs: (Blog & { files: DirectoryNode })[] }[])
}

export const fetchAllFiles = async (repo: GetResponseDataTypeFromEndpointMethod<typeof octokit.repos.get>, basePath: string = "") => {

    const dfs = async (path: string = basePath, level: number = 0, parentAbsolutePath: string = ""): Promise<DirectoryNode> => {

        const { data } = await octokit.repos.getContent({
            owner: repo.owner.login,
            repo: repo.name,
            path
        })

        const currentDirName = path.split('/').pop() || ""
        let absolutePath = parentAbsolutePath ? `${parentAbsolutePath}/${currentDirName}` : currentDirName

        if (basePath) {
            absolutePath = absolutePath.replace(new RegExp(`^${basePath}/?`), '').replace(/^\/+/, '');
        }

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
                    let fileAbsolutePath = `${absolutePath}/${file.name}`.replace(/^\/+/, '');
                    if (basePath) {
                        fileAbsolutePath = fileAbsolutePath.replace(new RegExp(`^${basePath}/?`), '').replace(/^\/+/, '');
                    }
                    node.children.push({
                        type: "file",
                        name: file.name,
                        download_url: file.download_url,
                        path: file.path,
                        level: level + 1,
                        absolutePath: fileAbsolutePath
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

export const capitalizeFolderSlug = (folderSlug: string) => {
    return folderSlug.split("-").map((word, i) => {
        if (i !== 0) return word
        return word[0].toUpperCase() + word.slice(1)
    }).join(" ")
}