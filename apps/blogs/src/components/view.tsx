import DarkModeSwitcher from "@/components/darkmodeSwitcher"
import { Logo } from "@/components/logo"
import { Tray } from "@/components/navbar"
import { OpenContext } from "@/context/open"
import { blogEntrySchema, fetchRepo, getBlogData, getRemoteSourceMetadata } from "@/lib/helpers"
import { faDiscord, faGithub, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons"
import { faBars, faClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, Divider, Link, useMediaQuery } from "@mui/material"
import { signIn, useSession } from "next-auth/react"
import { headers } from "next/headers"
import { ReactNode, useContext } from "react"
import lookup from "@/data/lookup.json"
import { octokit } from "@/lib/octokit"
import { GetResponseDataTypeFromEndpointMethod } from "@octokit/types"

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
    getAllBlogsRecursive()

    return <div className="w-full">
        <div className="flex min-h-screen gap-4">
            <div className="flex-1 min-w-sm">

            </div>
            <Divider className="self-stretch h-auto" orientation="vertical" />
            {children}
        </div>
        <div>

        </div>
    </div>
}

export const getAllBlogsRecursive = async () => {
    const data = lookup.map(async entry => {
        try {
            const { profile, blogs } = await import(`@/data/${entry}`)
            const blogEntry = blogEntrySchema.validateSync({ profile, blogs })
            blogEntry.blogs.map(async blog => {
                const { owner, repo: repoName } = getRemoteSourceMetadata(blog.remoteSource)
                const { data: rootLocation } = await octokit.repos.getContent({
                    owner,
                    repo: repoName,
                    path: ""
                })
                getAllBlogsRecursiveDFS(owner, repoName, rootLocation)
            })


        } catch (error) {

        }
    })
}

const getAllBlogsRecursiveDFS = async (owner: string, repo: string, currentLocation: GetResponseDataTypeFromEndpointMethod<typeof octokit.repos.getContent>): Promise<DirectoryNode> => {
    if (!Array.isArray(currentLocation)) {
        const fileNode: FileNode = {
            type: "file",
            name: currentLocation.name,
            download_url: currentLocation.download_url!
        }
        return {
            type: "dir",
            name: currentLocation.name,
            children: [fileNode]
        }

    } else {
        const directoryNode = {
            type: "dir",
            name: currentLocation.name,
            children: []
        }
        for (const location of currentLocation) {
            if (location.type === "dir") {
                const { data: locationResponse } = await octokit.repos.getContent({
                    owner,
                    repo,
                    path: location.path
                })
                const subDirContents = await getAllBlogsRecursiveDFS(owner, repo, locationResponse)
            } else {
                if (location.name.endsWith(".md") && location.type === "file") {

                }
            }
        }
    }
}

type FileNode = {
    type: "file",
    name: string,
    download_url: string
}

type DirectoryNode = {
    type: "dir",
    name: string,
    children: (FileNode | DirectoryNode)[]
}