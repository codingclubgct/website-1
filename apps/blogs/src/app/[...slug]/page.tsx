import Pre from "@/components/mdx-components/pre";
import { getAllBlogs, fetchRepo, fetchAllFilesForAllUsers, DirectoryNode, FileNode, fetchAllFiles, capitalizeFolderSlug } from "@/lib/helpers";
import { octokit } from "@/lib/octokit";
import { GetResponseDataTypeFromEndpointMethod, GetResponseTypeFromEndpointMethod } from "@octokit/types";
import { MDXComponents } from "mdx/types";
import { githubPat } from "@/lib/constants";
import { MDXRemote } from "next-mdx-remote-client/rsc"
import { plugins, TocItem } from "@ipikuka/plugins";
import { serialize } from "next-mdx-remote-client/serialize";
import { notFound } from "next/navigation";
import { NextResponse } from "next/server";
import { Button, Divider, Drawer } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { Blog, Profile } from "@/types/types";
import CommentBox from "@/components/commentBox";
import Accordion from "@/components/accordion";
import { ReactNode } from "react";
import { UserBox } from "@/components/user-box";
import MobileHeader from "@/components/mobile";

const components: MDXComponents = {
    pre: Pre,
    icon: () => <></>
};

export const revalidate = 60

export async function generateStaticParams() {
    const allFilesForUsers = await fetchAllFilesForAllUsers();

    const traverse = (node: DirectoryNode | FileNode, profile: Profile, blog: Blog, parentPath: string = ""): { slug: string[] }[] => {
        if (node.type === 'file') {
            const finalSlug = node.absolutePath.replace("README.md", "")
            return [{
                slug: [profile.nameSlug, blog.folderSlug, ...finalSlug.split('/')].filter(Boolean)
            }];
        } else if (node.type === 'dir') {
            return node.children.flatMap(child => traverse(child, profile, blog, `${parentPath}/${node.name}`));
        }
        return [];
    };

    const params = allFilesForUsers.flatMap(({ profile, blogs }) =>
        blogs.flatMap(blog => traverse(blog.files, profile, blog))
    );

    return params;
}


export default async function Page({ params }: { params: { slug: string[] } }) {

    const allBlogs = await getAllBlogs()

    const [nameSlug, folderSlug] = params.slug

    const user = allBlogs.find(entry => entry.profile.nameSlug === nameSlug)
    const blog = user?.blogs.find(blog => blog.folderSlug === folderSlug)
    if (!user || !blog) return notFound()

    const repo = await fetchRepo(blog.remoteSource)
    if (!repo) return new NextResponse("Internal Server Error", { status: 500 })

    const allFiles = await fetchAllFiles(repo, blog.basePath)
    const markdown = await fetchMarkdown(params, repo, blog.basePath)

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

    const Chapters = () => {
        return <div className="flex w-[300px] p-4 sticky h-screen top-0 flex-col justify-between">
            <div>
                <p className="text-xl font-bold py-4">Chapters</p>
                <Link href={`/${nameSlug}/${folderSlug}`} className="no-underline text-subtext0 hover:bg-surface0 hover:text-text p-2 block">{capitalizeFolderSlug(folderSlug)}</Link>
                <Navbar node={allFiles} />
            </div>
            <div className="mt-auto mb-0">
                <UserBox />
            </div>
        </div>
    }

    const TOCComponent = () => {
        return <div className="w-[300px] my-4 sticky h-screen top-0">
            <TOC toc={rootLevelHeadings} />
        </div>
    }

    return <div className="flex w-full">
        <div className="hidden md:block">
            <Chapters />
        </div>
        <Divider orientation="vertical" className="self-stretch h-auto hidden md:block" />
        <div className="flex-grow flex flex-col gap-12 py-8">
            <MobileHeader Chapter={<Chapters />} TOC={<TOCComponent />} />
            {isFrontMatterData(frontmatter) && <BlogHeader frontmatter={frontmatter} repo={repo} />}
            <Wrapper>
                <div className="mx-auto prose my-4 px-4 max-w-none">
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
            </Wrapper>
            <Divider />
            <Wrapper>
                {blog.issuesUrl && <div className="">
                    <div className="p-4 md:mx-auto">
                        <CommentBox issuesUrl={blog.issuesUrl} />
                    </div>
                </div>}
            </Wrapper>
        </div>
        <Divider orientation="vertical" className="self-stretch h-auto hidden md:block" />
        <div className="hidden md:block">
            <TOCComponent />
        </div>
    </div>
}

const Wrapper = ({ children }: { children: ReactNode }) => {
    return <div className="md:container w-full mx-auto">
        <div className="max-w-4xl mx-auto">
            {children}
        </div>
    </div>
}

const TOC = ({ toc }: { toc: TocItem[] }) => {
    return <div className="p-4 flex flex-col gap-8">
        <p className="text-xl font-bold">Table of contents</p>
        <div className="flex flex-col gap-2">
            {toc.map((item, i) => {
                return <div key={i} className="">
                    <a href={item.href} className="flex gap-4 no-underline">
                        <span>{i + 1}</span>
                        <span>{item.value}</span>
                    </a>
                </div>
            })}
        </div>
    </div>
}


const Navbar = async ({ node }: { node: DirectoryNode }) => {
    return <div className="">
        {node.children.map((leaf, k) => <Accordion key={k} node={leaf} />)}
    </div>
}

const BlogHeader = async ({ frontmatter, repo }: { frontmatter: FrontMatterData, repo: GetResponseDataTypeFromEndpointMethod<typeof octokit.repos.get> }) => {
    const { title, cover, tags, read } = frontmatter
    const contributors = await fetchRepoContributors(repo)
    const finalContributors = contributors.filter(contributor => contributor.type === "User")
    const finalTags = tags.split(",").map(tag => tag.trim())
    const finalCoverImage = cover.startsWith("http") ? cover : `https://raw.githubusercontent.com/${repo.owner.login}/${repo.name}/main/${cover}`

    return <div className="w-full py-4 flex flex-col gap-8">
        <div className="flex flex-col gap-8 [&>*]:px-4 max-w-6xl mx-auto">
            <p className="text-3xl md:text-5xl font-bold">{title}</p>
            <img src={finalCoverImage} className="w-full object-contain !px-0" />
            <div className="flex flex-wrap gap-4 items-center">
                {finalTags.map((tag, i) => <span key={i} className="bg-surface0 px-2 py-1 rounded-xl">{tag}</span>)}
            </div>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <p>Read time: {read}</p>
                <div className="flex flex-col gap-2 md:min-w-[300px]">
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

const fetchMarkdown = async (params: { slug: string[] }, repo: GetResponseDataTypeFromEndpointMethod<typeof octokit.repos.get>, basePath: string = "") => {
    const [, , ...rest] = params.slug

    const filePath = rest.join("/")
    const pathToSearch = filePath.endsWith(".md") ? filePath : filePath + "/README.md"

    try {
        const { data } = await octokit.repos.getContent({
            owner: repo.owner.login,
            repo: repo.name,
            path: basePath + pathToSearch
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