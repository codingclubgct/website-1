import { Blog, allBlogs } from 'contentlayer/generated'

const transform = (blogs: Blog[]) => blogs.map(blog => ({
    tags: blog.tags,
    url: blog.url,
    read: blog.read,
    coverImage: blog.coverImage,
    title: blog.title,
    githubData: blog.githubData,
    issueNumber: blog.issueNumber,
    date: blog.githubData.date,
    description: blog.description
}))

export function GET(req: Request) {
    const url = new URL(req.url)
    const author = url.searchParams.get("author")
    const data = author ? allBlogs.filter(blog => blog.githubData?.author.name.toLowerCase() === author.toLowerCase()) : allBlogs
    
    const jsonResponse = JSON.stringify({ data: transform(data) });
    
    return new Response(jsonResponse, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            "Accept": "application/json",
        }
    })
}