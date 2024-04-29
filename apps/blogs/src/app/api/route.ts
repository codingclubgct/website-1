import { Reactions } from '@/components/reactReactions';
import { Issue } from '@/types/issues';
import { Blog, allBlogs } from 'contentlayer/generated'
import { _getReactions } from './reactions/route';

export async function GET(req: Request) {
    // Parse the request URL
    const url = new URL(req.url);

    // Extract query parameters
    const author = url.searchParams.get("author");
    const filterBlogsStringified = url.searchParams.get("blogs");
    const filterBlogs = filterBlogsStringified ? JSON.parse(filterBlogsStringified) as string[] : undefined;

    // Filter blogs based on query parameters
    let filteredBlogs = allBlogs;
    if (filterBlogs) {
        filteredBlogs = allBlogs.filter(blog => filterBlogs.includes(blog.url));
    }
    if (author) {
        filteredBlogs = filteredBlogs.filter(blog => blog.githubData?.author.name.toLowerCase() === author.toLowerCase());
    }

    const reactionPromises: Promise<{ issuesRes: Issue }>[] = filteredBlogs.map(blog => _getReactions(`issues/${blog.issueNumber}`))
    const reactionsData = await Promise.all(reactionPromises)
    const data = reactionsData.map(({ issuesRes }) => {
        const { reactions, comments } = issuesRes
        const { url, ...rest } = reactions
        const blog = filteredBlogs.find(blog => blog.issueNumber === issuesRes.number)!
        return {
            tags: blog.tags,
            url: blog.url,
            read: blog.read,
            coverImage: blog.coverImage,
            title: blog.title,
            githubData: blog.githubData,
            issueNumber: blog.issueNumber,
            date: blog.githubData.date,
            description: blog.description,
            reactions: rest,
            comments: comments
        }
    })

    // Return the response with CORS headers
    const jsonResponse = JSON.stringify({ data });
    return new Response(jsonResponse, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*', // Allow requests from all origins
            'Access-Control-Allow-Methods': 'GET', // Specify the allowed HTTP methods
            'Access-Control-Allow-Headers': 'Content-Type', // Specify the allowed headers
            "Accept": "application/json",
        }
    });
}

