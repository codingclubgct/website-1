"use client"

import { CatppuccinContext } from "@/context/catppuccin"
import { githubPat } from "@/lib/constants"
import { Issue, Reaction } from "@/types/issues"
import { faHandsClapping } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Session } from "next-auth"
import { useSession } from "next-auth/react"
import { useContext, useEffect, useState } from "react"
import { useDetectClickOutside } from 'react-detect-click-outside'

type Reactions = {
    "total_count": number;
    '+1': number;
    '-1': number;
    "laugh": number;
    "hooray": number;
    "confused": number;
    "heart": number;
    "rocket": number;
    "eyes": number;
};

type ReactionMeta = {
    key: keyof Reactions,
    emoji: string
}

const reactionsMeta: ReactionMeta[] = [
    {
        key: "+1",
        emoji: "👍"
    },
    {
        key: "-1",
        emoji: "👎"
    },
    {
        key: "laugh",
        emoji: "😄"
    },
    {
        key: "hooray",
        emoji: "🎉"
    },
    {
        key: "confused",
        emoji: "😕"
    },
    {
        key: "heart",
        emoji: "❤️"
    },
    {
        key: "rocket",
        emoji: "🚀"
    },
    {
        key: "eyes",
        emoji: "👀"
    },

]

export default function ReactReactions({ slug }: { slug: string }) {
    const catppuccinColor = useContext(CatppuccinContext)
    const [current, setCurrent] = useState<string[]>([])
    const [reactions, setReactions] = useState<Reactions | null>()
    const [reactionsData, setReactionsData] = useState<Reaction[] | null>()
    const [totalReactions, setTotalReactions] = useState<number | null>(null)
    const [open, setOpen] = useState(false)
    const ref = useDetectClickOutside({ onTriggered: () => setOpen(false) });
    const { data: session } = useSession() as { data: Session & { access_token: string, id: number } | null };

    const getReactionsToDisplay = () => {
        if (!reactions) return []
        return reactionsMeta.filter(reactionMeta => reactions[reactionMeta.key] > 0).sort((a, b) => reactions[a.key] - reactions[b.key]).slice(0, 3)
    }

    const handleReact = async (content: keyof Reactions) => {
        const found = reactionsData?.find(c => c.content === content)
        if (found) {
            await fetch(`https://api.github.com/repos/coding-club-gct/blogs/${slug}/reactions/${found.id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${githubPat}`
                }
            }).then(() => {
                setReactions(prev => prev ? ({ ...prev, [content]: prev[content] - 1, total_count: prev.total_count - 1 }) : prev)
                setCurrent(prev => prev.filter(p => p !== found.content))
            })
            setReactionsData(reactionData => reactionData?.filter(r => r.content !== content))
        } else {
            const resp: Reaction = await fetch(`https://api.github.com/repos/coding-club-gct/blogs/${slug}/reactions`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${githubPat}`
                }, body: JSON.stringify({
                    content
                })
            }).then((res) => {
                setReactions(prev => prev ? ({ ...prev, [content]: prev[content] + 1, total_count: prev.total_count + 1 }) : prev)
                setCurrent(prev => [...prev, content])
                return res.json()
            })
            setReactionsData(prev => prev ? [...prev, resp] : prev)
        }
    }

    useEffect(() => {
        (async function () {
            const resp: Issue = await fetch(`https://api.github.com/repos/coding-club-gct/blogs/${slug}`, {
                headers: {
                    "Authorization": `Bearer ${githubPat}`
                }
            }).then(res => res.json())
            const githubReactionsData: Reaction[] = await fetch(resp.reactions.url, {
                headers: {
                    "Authorization": `Bearer ${githubPat}`
                }
            }).then(res => res.json())
            setReactionsData(githubReactionsData)
            const githubUserReactions = githubReactionsData.filter(({ user: { id } }) => id === session?.id).map(r => r.content)
            setCurrent(githubUserReactions)
            const { reactions }: { reactions: Reactions & { url: string } } = resp
            const { url, ...rest } = reactions
            setReactions(rest as Reactions)
        })()
    }, [session])

    return reactions ? <div className="flex gap-4 h-8 items-center">
        <div className="flex gap-1 items-center cursor-pointer" onClick={() => setOpen(prev => !prev)}>
            <p> {reactions.total_count} </p>
            {getReactionsToDisplay().length ? <div className="flex gap-1 items-center">
                {getReactionsToDisplay().map((reactionMeta, i) => <span key={i}>
                    {reactionMeta.emoji}
                </span>)}
            </div> : <FontAwesomeIcon icon={faHandsClapping} />}
        </div>
        {open && (session ? <div ref={ref} className="rounded-full relative z-10 shadow bg-mantle h-full p-1 flex gap-1 items-center"> {reactionsMeta.map((reactionMeta, i) => <div onClick={() => handleReact(reactionMeta.key)} style={{ background: current?.includes(reactionMeta.key) ? catppuccinColor.surface0 : undefined }} className="hover:bg-crust cursor-pointer rounded-full align-middle text-center flex justify-center items-center w-6 h-6 p-1" key={i}>
            <span className="text-sm">
                {reactionMeta.emoji}
            </span>
        </div>)} </div> : <p ref={ref} className="text-sm text-red"> Login to react </p>)}
    </div> : <div className="h-8"></div>
}