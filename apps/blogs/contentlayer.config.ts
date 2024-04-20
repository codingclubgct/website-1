import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import GithubSlugger from "github-slugger"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"
import rehypePrettyCode from "rehype-pretty-code"
import { getTimeString } from './src/lib/getTimeString'
import { Issue } from './src/types/issues'
import { Blog as BlogType } from 'contentlayer/generated'
import { githubPat, owner, repo } from './src/lib/constants'
import { visit } from 'unist-util-visit';

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

async function getIssueNumber(title: string) {
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

async function getGithubDataforBlog(pathname: string): Promise<GithubDataForBlog | undefined> {
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

export const Blog = defineDocumentType(() => ({
    name: "Blog",
    contentType: "mdx",
    filePathPattern: "**/*.mdx",
    fields: {
        tags: {
            type: "list",
            of: {
                type: "string"
            },
        }, title: {
            type: "string",
            required: true
        }, coverImage: {
            type: "string",
            required: true
        }, hideAuthor: {
            type: "boolean"
        }, read: {
            type: "string",
            required: true
        }, description: {
            type: "string",
            required: true
        }
    },
    computedFields: {
        url: {
            type: 'string', resolve: (doc) => doc._raw.sourceFilePath.replace(/\.mdx$/, ""),
        },
        headings: {
            type: "json",
            resolve: async (doc: BlogType) => {
                const regXHeader = /\n(?<flag>#{1,6})\s+(?<content>.+)/g;
                const slugger = new GithubSlugger()
                const headings = Array.from(doc.body.raw.matchAll(regXHeader)).map(
                    ({ groups }) => {
                        const content = groups?.content;
                        return {
                            text: content,
                            slug: content ? slugger.slug(content) : undefined
                        };
                    }
                );
                return headings;
            },
        },
        githubData: {
            type: "json",
            resolve: async (doc) => {
                const pathname = doc._raw.sourceFilePath.replace(/\.mdx$/, "")
                return await getGithubDataforBlog(pathname)
            }
        },
        issueNumber: {
            type: "number",
            resolve: async (doc) => {
                const pathname = doc._raw.sourceFilePath.replace(/\.mdx$/, "")
                return await getIssueNumber(pathname)
            }
        }
    }
}))

export default makeSource({
    contentDirPath: 'src/blogs',
    documentTypes: [Blog],
    mdx: {
        rehypePlugins: [
            rehypeSlug,
        ],
        remarkPlugins: [remarkGfm]
    },
})