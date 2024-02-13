"use client"

import { getTimeString } from "@/lib/getTimeString";
import { Comment } from "@/types/issues";
import { faCheckSquare, faEdit, faEye, faEyeSlash, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider } from "@mui/material";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Markdown from 'react-markdown';
import TextareaAutosize from 'react-textarea-autosize';
import ReactReactions from "./reactReactions";

export default function CommentBox({ slug }: { slug: string }) {
    const { data: session } = useSession() as { data: Session & { access_token: string, id: number } | null };
    const [comments, setComments] = useState<Comment[]>([])
    const [current, setCurrent] = useState<Comment | null>(null)
    const [preview, setPreview] = useState(false)
    const [newComment, setNewComment] = useState("")
    const [newCommentPreview, setNewCommentPreview] = useState(false)
    const handleUpdate = async (comment: Comment) => {
        fetch(`https://api.github.com/repos/coding-club-gct/blogs/issues/comments/${comment.id}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${session?.access_token}`
            }, body: JSON.stringify({ body: comment.body })
        }).then(() => {
            setComments(prev => prev.map(p => p.id === comment.id ? ({ ...p, body: comment.body }) : p))
            setCurrent(null)
        })
    }
    const handleDelete = async (comment: Comment) => {
        fetch(`https://api.github.com/repos/coding-club-gct/blogs/issues/comments/${comment.id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${session?.access_token}`
            }
        }).then(() => {
            setComments(comments => comments.filter(({ id }) => id !== comment.id))
        })
    }
    const postNewComment = async () => {
        if (!newComment) return
        fetch(`https://api.github.com/repos/coding-club-gct/blogs/${slug}/comments`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${session?.access_token}`
            }, body: JSON.stringify({ body: newComment })
        }).then(res => res.json()).then((json: Comment) => {
            setComments(prev => [...prev, json])
            setNewComment("")
            setNewCommentPreview(false)
        })
    }
    useEffect(() => {
        (async () => {
            const resp: Comment[] = await fetch(`https://api.github.com/repos/coding-club-gct/blogs/${slug}/comments`, {
                headers: {
                    "Authorization": `Bearer ${process.env.NEXT_PUBLIC_GITHUB_PAT}`
                }
            }).then(res => res.json())
            setComments(resp)
        })()
    }, [session])

    return <div className="flex flex-col gap-4 mb-12">
        <Divider />
        <div>
            <p className="text-xl font-medium"> Comment Section </p>
            <a href={`https://github.com/coding-club-gct/blogs/${slug}`} target="_blank" className="text-blue no-underline text-sm"> {slug} </a>
        </div>
        {!session && <p className="text-red text-sm"> Login to post a comment </p>}
        {comments.map((comment, i) => <div key={i} className="flex gap-4">
            <img src={comment.user.avatar_url} className="h-8 object-contain rounded-full mt-2" alt="" />
            <div className="flex w-full flex-col gap-1 bg-mantle py-2 px-4">
                <div className="flex gap-4 items-center">
                    <a target="_blank" href={comment.user.html_url} className="text-blue no-underline"> {comment.user.login} </a>
                    <p className="text-sm text-subtext0 ml-auto mr-4"> {getTimeString(comment.updated_at)} </p>
                </div>
                <ReactReactions slug={`issues/comments/${comment.id}`} />
                <div className="bg-base p-2">
                    {current?.id !== comment.id || (current?.id === comment.id && preview) ? <Markdown>
                        {current ? current.body : comment.body}
                    </Markdown> : <TextareaAutosize className="w-full min-h-[100px] resize-y border-0 outline-none bg-base text-text" value={current?.body} onChange={(e) => setCurrent(prev => prev ? ({ ...prev, body: e.target.value }) : prev)} />}
                </div>
                {comment.user.id === session?.id && <div className="flex gap-4 my-4">
                    {<FontAwesomeIcon onClick={() => handleDelete(comment)} icon={faTrash} className="bg-crust p-2 rounded-full text-red cursor-pointer" />}
                    <FontAwesomeIcon className="bg-crust p-2 rounded-full text-mauve cursor-pointer" onClick={() => current?.id === comment.id ? handleUpdate(current) : setCurrent(comment)} icon={current?.id === comment.id ? faCheckSquare : faEdit} />
                    {current?.id === comment.id && <FontAwesomeIcon className="bg-crust resize-none p-2 rounded-full text-mauve cursor-pointer" onClick={() => setPreview(prev => !prev)} icon={preview ? current?.id === comment.id ? faEyeSlash : faEye : faEye} />}
                </div>}
            </div>
        </div>)}
        {session && <div className="flex gap-4">
            <img className="h-8 object-contain rounded-full mt-2" src={session.user?.image!} alt="" />
            <div className="flex w-full flex-col gap-1 bg-mantle py-2 px-4">
                <div >
                    <div className="my-2">
                        {session ? <p> Comment as {session.user?.name} </p> : <p> Post a comment </p>}
                    </div>
                    <div className="p-2 bg-base">
                        {newCommentPreview ? <Markdown>
                            {newComment}
                        </Markdown> : <TextareaAutosize className="w-full min-h-[100px] resize-y border-0 outline-none text-text bg-base" value={newComment} onChange={e => setNewComment(e.target.value)} />}
                    </div>
                </div>
                <div className="flex gap-4 my-4">
                    <FontAwesomeIcon className="bg-crust p-2 rounded-full text-mauve cursor-pointer" icon={faCheckSquare} onClick={postNewComment} />
                    {newComment && <FontAwesomeIcon className="bg-crust resize-none p-2 rounded-full text-mauve cursor-pointer" onClick={() => setNewCommentPreview(prev => !prev)} icon={newCommentPreview ? faEyeSlash : faEye} />}
                </div>
            </div>
        </div>}
    </div>
}