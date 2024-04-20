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
        return new Response(JSON.stringify({ data: transform(data) }), {
                headers: {
                        'Content-Type': 'application/json',
                        "Accept": "application/json",
                }
        })
}