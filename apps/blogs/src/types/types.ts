export type Profile = {
    name: string,
    nameSlug: string,
    github?: string,
    avatar?: string,
}

export type Blog = {
    folderName: string,
    folderSlug: string,
    remoteSource: string,
    hidden: boolean,
    issuesUrl?: string,
}