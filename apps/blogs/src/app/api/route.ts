import { Blog, allBlogs } from 'contentlayer/generated'
import { NextResponse } from 'next/server'

const transformer = (blogs: Blog[]) => blogs.map(blog => ({
        tags: blog.tags,
        url: blog.url,
        read: blog.read,
        coverImage: blog.coverImage,
        title: blog.title,
        githubData: blog.githubData,
        issueNumber: blog.issueNumber
}))

export function GET(req: Request) {
        const url = new URL(req.url)
        const author = url.searchParams.get("author")
        return author ? NextResponse.json(transformer(allBlogs.filter(blog => blog.githubData.author.name === author))) : NextResponse.json(transformer(allBlogs))
}