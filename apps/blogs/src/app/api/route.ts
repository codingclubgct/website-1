import { allBlogs } from 'contentlayer/generated'
import { NextResponse } from 'next/server'

export function GET() {
        return NextResponse.json(allBlogs.map(blog => ({tags: blog.tags, url: blog.url,read: blog.read,  coverImage: blog.coverImage, title: blog.title, githubData: blog.githubData, issueNumber: blog.issueNumber})))
}