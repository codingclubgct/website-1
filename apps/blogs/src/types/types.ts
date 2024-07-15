export type Profile = {
    name: string,
    nameSlug: string,
    github?: string,
    avatar?: string,
}

export type Blog = {
    folderSlug: string,
    remoteSource: string,
    hidden: boolean,
    basePath?: string,
    issuesUrl?: string,
}