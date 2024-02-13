'use client'
import { faArrowUpRightFromSquare, faClock, faComment, faHandsClapping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Divider } from "@mui/material";
import React, { useEffect, useState } from "react";

type Issue = {
    url: string;
    repository_url: string;
    labels_url: string;
    comments_url: string;
    events_url: string;
    html_url: string;
    id: number;
    node_id: string;
    number: number;
    title: string;
    user: {
        login: string;
        id: number;
        node_id: string;
        avatar_url: string;
        gravatar_id: string;
        url: string;
        html_url: string;
        followers_url: string;
        following_url: string;
        gists_url: string;
        starred_url: string;
        subscriptions_url: string;
        organizations_url: string;
        repos_url: string;
        events_url: string;
        received_events_url: string;
        type: string;
        site_admin: boolean;
    };
    labels: string[];
    state: string;
    locked: boolean;
    assignee: null;
    assignees: string[];
    milestone: null;
    comments: number;
    created_at: string;
    updated_at: string;
    closed_at: null;
    author_association: string;
    active_lock_reason: null;
    body: null;
    reactions: {
        url: string;
        total_count: number;
        '+1': number;
        '-1': number;
        laugh: number;
        hooray: number;
        confused: number;
        heart: number;
        rocket: number;
        eyes: number;
    };
    timeline_url: string;
    performed_via_github_app: null;
    state_reason: null;
};

const BlogInfo = ({ issueNumber }: { issueNumber: number }) => {
    const [issue, setIssue] = useState<Issue | undefined>()
    useEffect(() => {
        fetch(`https://api.github.com/repos/coding-club-gct/blogs/issues/${issueNumber}`,{
            method : "GET",
            headers : {
                "Authorization" : process.env.NEXT_PUBLIC_GITHUB_TOKEN!
            }
        }).then(res => res.json()).then(data => setIssue(data))

    }, [])
    return issue ? <div className="flex gap-4">
        <p><span>{issue.comments}</span> <FontAwesomeIcon icon={faComment} className="w-4 ml-1"></FontAwesomeIcon></p>
        <p><span>{issue.reactions.total_count}</span><FontAwesomeIcon icon={faHandsClapping} className="w-4 ml-1"></FontAwesomeIcon></p>
    </div> : <></>
}

type BlogItem = {
    tags: string[],
    url: string,
    read: string,
    coverImage: string,
    title: string,
    githubData: {
        author: {
            name: string,
            blog: string | null
            html_url: string,
            email: string | null
            avatar_url: string
        },
        committer: {
            name: string,
            avatar_url: string,
            committed_date: string
        }
    },
    issueNumber: number
}
export default function Blog() {

    const [blogItems, setBlogItems] = useState<BlogItem[]>([])


    useEffect(() => {
        async function fetchBlogs() {

            const _blogItems: BlogItem[] = await fetch('https://blogs.codingclubgct.in/api').then(res => res.json())
            setBlogItems(_blogItems)
        }
        fetchBlogs()
    }, [])
    return (
        <div className=" flex  flex-col md:flex-row justify-between gap-12 px-4 w-full md:px-4 ">
            {blogItems.map((blogItem, i) => (
                <div key={i} className="flex flex-col   p-4 md:w-1/3 gap-2 bg-mantle rounded ">
                    <img src={`https://blogs.codingclubgct.in/${blogItem.coverImage}`} className="w-64 object-cover"></img>
                    <Divider className="my-4"></Divider>
                    <p className="text-text text-3xl font-medium">{blogItem.title}</p>
                    <p className="text-sm ">{blogItem.githubData.committer.committed_date}</p>
                    <div className="flex gap-2 items-center">
                        <FontAwesomeIcon icon={faClock} className="w-4 text-sm text-subtext0"></FontAwesomeIcon>
                        <p className="text-sm mr-2 ">{blogItem.read} read</p>
                        <BlogInfo issueNumber={blogItem.issueNumber}/>

                    </div>


                    <div className="flex">
                        <div className="flex items-center">
                            <img src={blogItem.githubData.author.avatar_url} className="w-12 object-contain rounded-full" alt="Avatar" />
                        </div>
                        <div className="flex flex-col m-4">
                            <p className="p-1">{blogItem.githubData.author.name}</p>
                            <div className="flex justify-evenly gap-8 m-2">
                                {blogItem.githubData.author.blog && <div className="flex bg-mantle text-pink cursor-pointer gap-1">
                                    <a href={blogItem.githubData.author.blog} className="no-underline bg-mantle text-pink">Website</a>
                                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="h-4 w-4 ml-2 mt-[3px]"></FontAwesomeIcon>
                                </div>}
                                <div className="flex bg-mantle text-yellow cursor-pointer rounded gap-1">
                                    <a href={blogItem.githubData.author.html_url} className="no-underline text-yellow ">GitHub</a>
                                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="w-4 h-4 ml-2 mt-[3px] "></FontAwesomeIcon>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        {blogItem.tags.map((tag, j) => (
                            <div key={j} >
                                <span className="text-sm text-subtext0 font-medium bg-crust rounded p-1" >{tag}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex  m-2">
                        <a href={`https://blogs.codingclubgct.in/${blogItem.url}`} target={"_blank"} className="text-blue no-underline">Read Now</a>

                    </div>
                </div>
            ))}
        </div>
    );
}