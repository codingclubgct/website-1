import Pre from "@/components/mdx-components/pre";
import { getAllBlogs, fetchRepo, fetchAllFilesForAllUsers, DirectoryNode, FileNode } from "@/lib/helpers";
import { octokit } from "@/lib/octokit";
import { GetResponseDataTypeFromEndpointMethod, GetResponseTypeFromEndpointMethod } from "@octokit/types";
import { MDXComponents } from "mdx/types";
import { githubPat } from "@/lib/constants";
import { MDXRemote } from "next-mdx-remote-client/rsc"
import { plugins, TocItem } from "@ipikuka/plugins";
import { serialize } from "next-mdx-remote-client/serialize";
import { notFound } from "next/navigation";
import { NextResponse } from "next/server";
import { Divider } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { Blog, Profile } from "@/types/types";
import CommentBox from "@/components/commentBox";

const components: MDXComponents = {
    pre: Pre,
    icon: () => <></>
};

// export async function generateStaticParams2() {
//     const allFilesForUsers = await fetchAllFilesForAllUsers();

//     const traverse = (node: DirectoryNode | FileNode, profile: Profile, blog: Blog, parentPath: string = ""): { slug: string[] }[] => {
//         if (node.type === 'file') {
//             const finalSlug = node.absolutePath.replace("README.md", "")
//             return [{
//                 slug: [profile.nameSlug, blog.folderSlug, ...finalSlug.split('/')]
//             }];
//         } else if (node.type === 'dir') {
//             return node.children.flatMap(child => traverse(child, profile, blog, `${parentPath}/${node.name}`));
//         }
//         return [];
//     };

//     const params = allFilesForUsers.flatMap(({ profile, blogs }) =>
//         blogs.flatMap(blog => traverse(blog.files, profile, blog))
//     );

//     return params;
// }


export default async function Page({ params }: { params: { slug: string[] } }) {

    const allBlogs = await getAllBlogs()
    const [nameSlug, folderSlug] = params.slug

    const user = allBlogs.find(entry => entry.profile.nameSlug === nameSlug)
    const blog = user?.blogs.find(blog => blog.folderSlug === folderSlug)
    if (!user || !blog) return notFound()

    const repo = await fetchRepo(blog.remoteSource)
    if (!repo) return new NextResponse("Internal Server Error", { status: 500 })
    const markdown = await fetchMarkdown(params, repo)

    if (!markdown) return notFound()

    const { scope: { toc }, frontmatter } = await serialize<FrontMatterData | {}, { toc?: TocItem[] }>({
        source: markdown,
        options: {
            mdxOptions: {
                ...plugins({
                    format: "md"
                })
            },
            vfileDataIntoScope: ["toc"],
            parseFrontmatter: true
        }
    })

    const rootLevelHeadings = toc?.filter(item => item.parent === "root") ?? []

    return <div>
        <div className="flex">
            <div className="container flex flex-row justify-center">
                <div className="w-full">
                    {isFrontMatterData(frontmatter) ? <BlogHeader frontmatter={frontmatter} repo={repo} /> : <div className="h-8" />}
                    <div className="mx-auto prose my-4 px-4">
                        <MDXRemote
                            source={markdown}
                            components={components}
                            options={{
                                mdxOptions: {
                                    ...plugins({
                                        format: "md"
                                    })
                                },
                                parseFrontmatter: true
                            }}
                        />
                    </div>
                </div>
            </div>
            <Divider orientation="vertical" className="self-stretch h-auto" />
            <div className="flex-1 max-w-[300px] my-4">
                <TOC toc={rootLevelHeadings} />
            </div>
        </div>
        {blog.issuesUrl &&
            <div className="">
                <Divider className="mb-12" />
                <div className="p-4">
                    <CommentBox issuesUrl={blog.issuesUrl} />
                </div>
            </div>}
    </div>
}

const TOC = ({ toc }: { toc: TocItem[] }) => {
    return <div className="pl-8 flex flex-col gap-8 py-8">
        <p className="text-xl font-bold">Table of contents</p>
        {toc.map((item, i) => {
            return <div key={i} className="">
                <a href={item.href} className="flex gap-4 no-underline">
                    <span>{i + 1}</span>
                    <span>{item.value}</span>
                </a>
            </div>
        })}
    </div>
}

const BlogHeader = async ({ frontmatter, repo }: { frontmatter: FrontMatterData, repo: GetResponseDataTypeFromEndpointMethod<typeof octokit.repos.get> }) => {
    const { title, cover, tags, read } = frontmatter
    const contributors = await fetchRepoContributors(repo)
    const finalContributors = contributors.filter(contributor => contributor.type === "User")

    const finalTags = tags.split(",").map(tag => tag.trim())

    const finalCoverImage = cover.startsWith("http") ? cover : `https://raw.githubusercontent.com/${repo.owner.login}/${repo.name}/main/${cover}`
    return <div className="w-full py-4 flex flex-col gap-8">
        <div className="flex flex-col gap-8 [&>*]:px-4">
            <p className="text-3xl md:text-5xl font-bold">{title}</p>
            <img src={finalCoverImage} className="w-full object-contain !px-0" />
            <div className="flex flex-wrap gap-4 items-center">
                {finalTags.map((tag, i) => <span key={i} className="bg-surface0 px-2 py-1 rounded-xl">{tag}</span>)}
            </div>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <p>Read time: {read}</p>
                <div className="flex flex-col gap-2 min-w-[300px]">
                    <p className="">Brought to you by,</p>
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        {finalContributors.map((contributor, i) => <div key={i} className="flex-col gap-2">
                            <div className="flex gap-2 items-center">
                                <Image src={contributor.avatar_url!} alt={"contributor"} width={30} height={30} className="rounded-full" />
                                <Link href={contributor.html_url!} className="text-sm">{contributor.login}</Link>
                            </div>
                        </div>)}
                    </div>
                </div>
            </div>
        </div>
        <Divider />
    </div>
}

const fetchMarkdown = async (params: { slug: string[] }, repo: GetResponseDataTypeFromEndpointMethod<typeof octokit.repos.get>) => {
    const [, , ...rest] = params.slug

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

const fetchRepoContributors = async (repo: GetResponseDataTypeFromEndpointMethod<typeof octokit.repos.get>): Promise<GetResponseDataTypeFromEndpointMethod<typeof octokit.repos.listContributors>> => {
    const data = await octokit.paginate(octokit.repos.listContributors, {
        owner: repo.owner.login,
        repo: repo.name,
        per_page: 100,
    })
    return data
}

type FrontMatterData = {
    title: string
    cover: string
    tags: string
    read: string
}

const isFrontMatterData = (data: any): data is FrontMatterData => {
    return typeof data.title === "string" && typeof data.cover === "string" && typeof data.tags === "string" && typeof data.read === "string"
}