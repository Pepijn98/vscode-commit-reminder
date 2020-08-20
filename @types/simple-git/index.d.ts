import { SimpleGitTaskCallback, DiffResult, Response } from "simple-git";

declare module "simple-git" {
    interface SimpleGit {
        diffSummary(callback?: SimpleGitTaskCallback<DiffResult>): Response<DiffResult>;
    }
}
