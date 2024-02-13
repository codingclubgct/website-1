import CommentBox from "@/components/commentBox";
import ReactReactions from "@/components/reactReactions";
import { faArrowUpRightFromSquare, faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider } from "@mui/material";
import { Blog, allBlogs } from "contentlayer/generated";
import { getMDXComponent } from "next-contentlayer/hooks";
import { notFound } from "next/navigation";

function Chip({ textColor, text, href }: { textColor: string, href: string, text: string }) {
    return <div className={`${textColor} text-sm rounded flex gap-2 items-center bg-mantle p-1 cursor-pointer`}>
        <a target="_blank" href={href} className="text-inherit no-underline">
            {text}
        </a>
        <FontAwesomeIcon className="text-inherit w-4 h-4" icon={faArrowUpRightFromSquare} />
    </div>
}

export default async function Page({ params }: { params: { slug: string[] } }) {
    const blog: Blog | undefined = allBlogs.find((blog) => blog.url === params.slug.join("/"));
    if (!blog) notFound()
    const MDXContent = getMDXComponent(blog.body.code)
    const { githubData, issueNumber } = blog
    return <div>
        <div className="flex gap-4 w-full">
            <div className="md:w-[calc(100%-300px)] flex flex-col gap-8 p-4 md:px-0">
                <img className="w-full object-contain" src={blog.coverImage} alt="" />
                <div className="flex flex-col gap-2">
                    <p className="text-6xl font-bold"> {blog.title} </p>
                    <div className="flex gap-2 items-center">
                        <FontAwesomeIcon className="" icon={faClock}></FontAwesomeIcon>
                        <p className="text-sm text-subtext0"> {blog.read} Read</p>
                        <ReactReactions slug={`issues/${issueNumber}`} />
                    </div>
                    {blog.tags ? <div className="flex gap-2 items-center">
                        {blog.tags.map((tag, i) => <span className="text-sm rounded bg-mantle p-1" key={i}> {tag} </span>)}
                    </div> : <></>}
                </div>
                {githubData ? <div className="w-full flex flex-col gap-4">
                    {!Boolean(blog.hideAuthor) && <div className="w-full flex flex-col md:flex-row md:items-center gap-4">
                        <img className="rounded-full w-20 h-20 object-contain" src={githubData.author.avatar_url} alt="" />
                        <div className="flex flex-col justify-between">
                            <p> {githubData.author.name} </p>
                            <div className="flex gap-2">
                                <Chip textColor="text-yellow" text="GitHub" href={githubData.author.html_url} />
                                {githubData.author.blog && <Chip textColor="text-pink" text="Website" href={githubData.author.blog} />}
                                {githubData.author.email && <Chip textColor="text-rosewater" text="Email" href={githubData.author.email} />}
                            </div>
                        </div>
                    </div>}
                    <div className="flex justify-end items-center">
                        <div className="text-sm">
                            <p> Last edited by, </p>
                            <div className="flex items-center gap-2">
                                <img className="w-6 h-6 object-contain rounded-full" src={githubData.committer.avatar_url} alt="" />
                                <p> {githubData.committer.name} </p>
                            </div>
                            <p className="text-subtext1"> {githubData.committer.committed_date} </p>
                        </div>
                    </div>
                    <div className="relative md:hidden">
                        <Divider />
                        <div className="w-[300px] flex flex-col gap-4 py-4 overflow-y-scroll scrollbar-hide sticky top-0">
                            <p> Table of Contents </p>
                            {blog.headings.map(({ text, slug }: { text: string, slug: string }, i: number) =>
                                <a key={i} className="text-sm no-underline" href={`#${slug}`}>{text}</a>
                            )}
                        </div>
                    </div>
                </div> : <></>}
                <MDXContent />
                <CommentBox slug={`issues/${issueNumber}`} />
            </div>
            <div className="hidden md:flex gap-4">
                <Divider orientation="vertical"></Divider>
                <div className="relative">
                    <div className="w-[300px] h-screen flex flex-col gap-4 py-4 overflow-y-scroll scrollbar-hide sticky top-0">
                        <p> Table of Contents </p>
                        {blog.headings.map(({ text, slug }: { text: string, slug: string }, i: number) =>
                            <a key={i} className="text-sm no-underline" href={`#${slug}`}>{text}</a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
}
