export const getIssueNumber = (slug: string) =>  slug.match(/\d+/)?.[0];
