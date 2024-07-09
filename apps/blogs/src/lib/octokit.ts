import { Octokit } from "@octokit/rest";
import { githubPat } from "./constants";

export const octokit = new Octokit({
    auth: githubPat
})