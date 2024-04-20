import { Blog, allBlogs } from 'contentlayer/generated'

// Function to transform blogs data
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
}));

export function GET(req: Request) {
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

    // Transform the filtered blogs data
    const transformedData = transform(filteredBlogs);

    // Return the response with CORS headers
    const jsonResponse = JSON.stringify({ data: transformedData });
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

