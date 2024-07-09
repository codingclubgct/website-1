import { GetResponseDataTypeFromEndpointMethod } from '@octokit/types';
import { NextResponse } from 'next/server';
import path from 'path-browserify';
import { octokit } from './lib/octokit';
import { fetchRepo, getAllBlogs } from './lib/helpers';

export async function middleware(request: Request) {

    const url = new URL(request.url);
    const origin = url.origin;
    const pathname = url.pathname;
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-url', request.url);
    requestHeaders.set('x-origin', origin);
    requestHeaders.set('x-pathname', pathname);

    const segments = pathname.split('/').filter(Boolean);
    if (segments.length >= 2) {
        requestHeaders.set('x-nameSlug', segments[0]);
        requestHeaders.set('x-folderSlug', segments[1]);

        if (pathname.endsWith("README.md")) {
            return NextResponse.redirect(pathname.replace("README.md", ""));
        }

        if (segments.length > 2) {
            const [, , ...rest] = segments
            const ext = path.extname(rest[rest.length - 1])
            if (ext && ext !== ".md") {
                const asset = await fetchAssets(pathname)
                if (asset) {
                    return NextResponse.redirect(asset)
                }
            }
        }
    }

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        }
    });
}

const fetchAssets = async (pathname: string) => {
    const allBlogs = await getAllBlogs()
    const [nameSlug, folderSlug, ...rest] = pathname.split('/').filter(Boolean)
    const user = allBlogs.find(entry => entry.profile.nameSlug === nameSlug)
    const blog = user?.blogs.find(blog => blog.folderSlug === folderSlug)

    if (user && blog) {
        const repo = await fetchRepo(blog.remoteSource)
        if (repo) {
            try {
                const { data } = await octokit.repos.getContent({
                    owner: repo.owner.login,
                    repo: repo.name,
                    path: rest.join('/')
                })
                if (!Array.isArray(data)) {
                    return data.download_url
                }
            } catch (error) {
                return null
            }
        }
    }

}
