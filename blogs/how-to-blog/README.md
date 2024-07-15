## How to Blog: A Beginner's Guide

Blogging is a fantastic way to share your thoughts, expertise, and experiences with the world. Whether you're writing about technology, travel, or personal development, having a structured approach can make your blogging journey smoother and more enjoyable. Here’s a step-by-step guide to get started:

### 1. Create a GitHub Repository for Your Blogs

GitHub provides an excellent platform not only for code but also for hosting markdown files, making it perfect for blogging. Follow these steps to set up your blogging repository:

- **Create a New Repository**: Name it something like `my-blog`.
- **Add Markdown Files**: Write your blog posts in markdown format. Each post should ideally be a separate `.md` file.

### 2. Structure Your Blog Repository

Organize your repository to keep it clean and easy to navigate:

- **Create Folders**: Organize your markdown files into folders based on categories or dates. For example, `tech`, `travel`, `2024`, etc.
- **README.md**: Write an introduction to your blog in the `README.md` file. Include a brief description of your blog’s theme or your writing style.

### 3. Create Your User-specific JSON Configuration

To manage your blogging profile and posts effectively, create a JSON configuration file named `<yourusername>.json` with the following structure. Optionally, include a `basePath` in each `blogs` entry to specify where markdown files are located:

```json
{
    "profile": {
        "github": "yourgithubusername",
        "name": "Your Name",
        "nameSlug": "your-name"
    },
    "blogs": [
        {
            "folderName": "Tech",
            "folderSlug": "tech",
            "basePath": "blogs/tech", // Optional basePath example
            "remoteSource": "https://github.com/yourgithubusername/my-blog/tech/",
            "issuesUrl": "https://github.com/yourgithubusername/my-blog/issues/1",
            "hidden": false
        },
        {
            "folderName": "Travel",
            "folderSlug": "travel",
            "basePath": "blogs/travel", // Optional basePath example
            "remoteSource": "https://github.com/yourgithubusername/my-blog/travel/",
            "issuesUrl": "https://github.com/yourgithubusername/my-blog/issues/2",
            "hidden": false
        }
        // Add more blog entries as needed
    ]
}
```

### 4. Add Your Entry to `lookup.json`

To make your blog posts searchable and categorized, add each blog post entry to the `lookup.json` file within your repository. Here’s how an example `lookup.json` might look:

```json
[
    "useEffects.json",
    "pavithra.json",
    "_.json", // club's blog posts
    "<yourusername>.json"
]
```

### 5. Utilize Your Blogs in Your Portfolio

You can leverage your setup to display a list of your blogs and related information on your portfolio. We store `lookup.json` and the entry files in the `public` directory hence available @ https://blogs.codingclubgct.in/lookup.json and https://blogs.codingclubgct.in/[yourusename].json. This way, you can dynamically list your blogs, showcase your writing skills, and provide links for readers to explore your content further.

### 6. Enjoy Writing and Sharing!

With your GitHub repository set up and configured, start writing! Markdown is simple yet powerful for formatting text, adding links, images, and more. Once you’re done writing a post:

- **Commit and Push**: Save your changes to GitHub using commits and push them to the repository.
- **Publish**: Share your blog post by providing others with the link to your markdown file on GitHub.

### Conclusion

Blogging on GitHub gives you control over your content, versioning through commits, and the ability to collaborate if desired. Follow these steps to get started, and enjoy your blogging journey!

Happy blogging!