import { fetchAllFilesForAllUsers, fetchRepo, getAllBlogs } from "@/lib/helpers"
import { octokit } from "@/lib/octokit"
import { Blog, Profile } from "@/types/types"
import { faDiscord, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons"
import { Divider } from "@mui/material"
import { GetResponseDataTypeFromEndpointMethod } from "@octokit/types"
import { headers } from "next/headers"
import { ReactNode } from "react"
import Accordion, { AccordionLabel } from "./accordion"


const links = [
    {
        label: "Homepage",
        href: "https://codingclubgct.in"
    }, {
        label: "GitHub",
        href: "https://github.com/coding-club-gct"
    }, {
        label: "Coding Club App",
        href: "https://play.google.com/store/apps/details?id=com.codingclubgct.app&pcampaignid=web_share"
    }, {
        label: "Algolab",
        href: "https://algolab.codingclubgct.in"
    }
]

const socials = [
    {
        icon: faDiscord,
        href: ""
    }, {
        icon: faLinkedin,
        href: ""
    }, {
        icon: faInstagram,
        href: ""
    },
]

const howTo = [
    {
        label: "How to blog?",
        href: "/how-to-blog"
    }, {
        label: "License",
        href: ""
    }
]

export default async function View({ children }: { children: ReactNode }) {
    const headersList = headers()
    const url = new URL(headersList.get("x-url")!)

    return <div className="w-full">
        <div className="flex min-h-screen">
            <div className="flex-1 max-w-[300px]">
                <Navbar />
            </div>
            <Divider className="self-stretch h-auto" orientation="vertical" />
            {children}
        </div>
        <div>

        </div>
    </div>
}

const Navbar = async () => {
    const allFiles = await fetchAllFilesForAllUsers()
    const allVisibleFiles = allFiles.map(entry => ({
        profile: entry.profile,
        blogs: entry.blogs.filter(blog => !blog.hidden)
    })).filter(entry => entry.blogs.length > 0)

    return <div className="flex flex-col gap-8 p-4">
        {allVisibleFiles.map((entry, i) => <div key={i} className="flex flex-col gap-4">
            <AccordionLabel node={entry.blogs[0].files} useFolderSlug />
            <Divider />
            {entry.blogs.map((blog, j) => <div key={j} className="flex flex-col gal-4">
                {blog.files.children.map((node, k) => <Accordion key={k} node={node} />)}
            </div>)}
        </div>)}
    </div>
}