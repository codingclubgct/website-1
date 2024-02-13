import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Divider } from "@mui/material"
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

async function getProfileFromUsername(username: string) {
    const profile = await fetch(`https://api.github.com/users/${username}`, {
        method: "GET",
        headers: {
            "Authorization": `token ${process.env.NEXT_PUBLIC_GITHUB_PAT!}`,
            "Content-Type": "application/json"
        },
        cache: "force-cache"
    }).then(res => res.json())
    return profile
    
}
function getTimeString(timestamp: string) {
    const utcDate = new Date(timestamp);
    const istDate = new Date(utcDate.getTime());
    return istDate.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        weekday: 'short',
        year: '2-digit',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    }).replaceAll(",", " ");
}

function Chip({ textColor, text, href }: { textColor: string, href: string, text: string }) {
    return <a target="_blank" href={href} className={`rounded flex gap-2 items-center bg-mantle p-1 no-underline cursor-pointer text-sm ${textColor}`
    }>
        {text}
        <FontAwesomeIcon className={textColor} icon={faArrowUpRightFromSquare} />
    </a>
}

export const BlogHeader = async ({ pathname, hideAuthor }: { pathname: string, hideAuthor?: boolean }) => {
    const filePathName = `src/blogs/${pathname}.mdx`
    const apiUrl = `https://api.github.com/repos/coding-club-gct/blogs/commits?path=${filePathName}`
    const resp = await fetch(apiUrl, {
        method: "GET",
        headers: {
            "Authorization": `token ${process.env.NEXT_PUBLIC_GITHUB_PAT!}`,
            "X-GitHub-Api-Version": "2022-11-28"
        },
        cache: "force-cache"
    }).then(res => res.json())
    if (!resp.length) {
        return <div className="text-red mb-8"> {JSON.stringify(resp)} </div>
    }
    const { author } = resp[0]
    const { committer } = resp[resp.length - 1]
    const { name, blog, html_url, email } = await getProfileFromUsername(author.login)
    const { name: committerName } = await getProfileFromUsername(committer.login)
    return <div className="w-full flex flex-col gap-4 mt-4 mb-8">
        {!Boolean(hideAuthor) && <div className="w-full flex flex-col md:flex-row md:items-center gap-4">
            <img className="rounded-full w-20 h-20 object-contain" src={author.avatar_url} alt="" />
            <div className="flex flex-col justify-between">
                <p> {name} </p>
                <div className="flex gap-2">
                    <Chip textColor="text-yellow" text="GitHub" href={html_url} />
                    {blog && <Chip textColor="text-pink" text="Website" href={blog} />}
                    {email && <Chip textColor="text-rosewater" text="Email" href={email} />}
                </div>
            </div>
        </div>}
        <Divider />
        <div className="flex justify-end items-center">
            <div className="text-sm">
                <p> Last edited by, </p>
                <div className="flex items-center gap-2">
                    <img className="w-6 h-6 object-contain rounded-full" src={committer.avatar_url} alt="" />
                    <p> {committerName} </p>
                </div>
                <p className="text-subtext1"> {getTimeString(resp[resp.length - 1].commit.committer.date)} </p>
            </div>
        </div>
    </div>
}