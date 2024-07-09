export type Profile = {
    name: string,
    nameSlug: string,
    github?: string,
    avatar?: string,
}

export type Blogs = {
    title: string,
    description: string,
    folderName: string,
    folderSlug: string,
    remoteSource: string,
    hidden: boolean,
    issuesUrl?: string,
}