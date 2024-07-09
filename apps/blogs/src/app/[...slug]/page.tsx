import Pre from "@/components/mdx-components/pre";
import { getAllBlogs, fetchRepo } from "@/lib/helpers";
import { octokit } from "@/lib/octokit";
import { GetResponseDataTypeFromEndpointMethod, GetResponseTypeFromEndpointMethod } from "@octokit/types";
import { MDXComponents } from "mdx/types";
import { githubPat } from "@/lib/constants";
import { MDXRemote } from "next-mdx-remote-client/rsc"
import { plugins, TocItem } from "@ipikuka/plugins";
import { serialize } from "next-mdx-remote-client/serialize";
import { notFound, redirect } from "next/navigation";
import dynamic from "next/dynamic";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Divider } from "@mui/material";

const components: MDXComponents = {
    pre: Pre,
};

export default async function Page({ params }: { params: { slug: string[] } }) {
    const allBlogs = await getAllBlogs()
    const [nameSlug, folderSlug, ...rest] = params.slug

    const headersList = headers()
    const url = new URL(headersList.get("x-url")!)


    const user = allBlogs.find(entry => entry.profile.nameSlug === nameSlug)
    const blog = user?.blogs.find(blog => blog.folderSlug === folderSlug)
    if (!user || !blog) return notFound()

    const repo = await fetchRepo(blog.remoteSource)
    if (!repo) return new NextResponse("Internal Server Error", { status: 500 })
    const markdown = await fetchMarkdown(params, repo)

    if (!markdown) return notFound()

    const { scope: { toc } } = await serialize<{}, { toc: TocItem[] }>({
        source: markdown,
        options: {
            mdxOptions: {
                ...plugins({
                    format: "md"
                })
            },
            vfileDataIntoScope: ["toc"]
        }
    })

    const rootLevelHeadings = toc.filter(item => item.parent === "root")

    return <>
        <div className="container flex flex-row justify-center">
            <div className="w-[600px] mx-auto prose">
                <MDXRemote
                    source={markdown}
                    components={components}
                    options={{
                        mdxOptions: {
                            ...plugins({
                                format: "md"
                            })
                        }
                    }}
                />
            </div>
        </div>
        <Divider orientation="vertical" className="self-stretch h-auto" />
        <div className="flex-1">
            <TOC toc={rootLevelHeadings} />
        </div>
    </>
}

const TOC = ({ toc }: { toc: TocItem[] }) => {
    return <div>
        {toc.map((item, i) => {
            return <div key={i}>
                <a href={item.href}>{item.value}</a>
            </div>
        })}
    </div>
}

const fetchMarkdown = async (params: { slug: string[] }, repo: GetResponseDataTypeFromEndpointMethod<typeof octokit.repos.get>) => {
    const [nameSlug, folderSlug, ...rest] = params.slug

    const filePath = rest.join("/")
    const pathToSearch = filePath.endsWith(".md") ? filePath : filePath + "/README.md"

    try {
        const { data } = await octokit.repos.getContent({
            owner: repo.owner.login,
            repo: repo.name,
            path: pathToSearch
        }) as GetResponseTypeFromEndpointMethod<typeof octokit.repos.getContent>
        if (!Array.isArray(data)) {
            const content = await downloadContent(data.download_url!)
            return content
        } else {
            const found = data.find(d => d.name === "README.md")
            if (!found) return null
            return await downloadContent(found.download_url!)
        }
    } catch (error) {
        return null
    }
}

const downloadContent = async (path: string) => {
    const content = await fetch(path, {
        headers: {
            "Authorization": `token ${githubPat}`
        },
        cache: "no-store"
    }).then(res => res.text())
    return content
}