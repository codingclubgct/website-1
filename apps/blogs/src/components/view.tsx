import { fetchAllFilesForAllUsers, fetchRepo, getAllBlogs } from "@/lib/helpers"
import { octokit } from "@/lib/octokit"
import { Blog, Profile } from "@/types/types"
import { faDiscord, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons"
import { Divider } from "@mui/material"
import { GetResponseDataTypeFromEndpointMethod } from "@octokit/types"
import { headers } from "next/headers"
import { ReactNode } from "react"
import Accordion, { AccordionLabel } from "./accordion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Logo } from "./logo"


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
    return <div className="min-h-screen w-full">
        {children}
        <Footer />
    </div>
}

const Footer = () => {
    return <div className="w-full">
        <Divider />
        <div className="px-4 mx-auto container flex flex-col md:flex-row justify-evenly gap-8 md:gap-0 py-8" id="#about">
            <div className="flex flex-col justify-center">
                <p> Blogs from <span className="text-yellow text-sm"> Coding Club GCT </span> </p>
                <p className="text-subtext0 text-sm"> Ideas Unleashed</p>
                <Logo />
            </div>
            <div className="flex flex-col gap-2">
                <p> Useful links </p>
                {links.map(({ href, label }, i) => <a key={i} href={href} target="_blank" className="text-subtext0 no-underline text-sm">
                    {label}
                </a>)}
            </div>
            <div className="flex flex-col gap-2">
                <p> Connect with us </p>
                <div className="flex gap-4">
                    {socials.map(({ icon, href }, i) => <a className="text-subtext0 no-underline" key={i} href={href}>
                        <FontAwesomeIcon icon={icon} className="text-subtext0 w-4 h-4" />
                    </a>)}
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <p> Support </p>
                {howTo.map(({ href, label }, i) => <a key={i} href={href} target="_blank" className="text-subtext0 no-underline text-sm">
                    {label}
                </a>)}
            </div>
        </div>
        <div className="flex justify-center mb-4">
            <a className="text-center no-underline" href="https://github.com/coding-club-gct/blogs"> Source Code </a>
        </div>
    </div>
}