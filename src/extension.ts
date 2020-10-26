import vscode from "vscode";
import SimpleGit from "simple-git";
import Yukikaze from "yukikaze";
import { Config } from "./types";

const workspace = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0 ? vscode.workspace.workspaceFolders[0].uri.fsPath : process.cwd();

const git = SimpleGit(workspace);
const interval = new Yukikaze();

const logger = vscode.window.createOutputChannel("Commit Reminder");

/**
 * Returns the extensions config values
 */
function getConfig(): Config {
    const config = vscode.workspace.getConfiguration();
    const intervalUnit = config.get<string>("commitReminder.intervalUnit") || "minutes";
    const interval = config.get<number>("commitReminder.interval") ?? 30;
    const minFileChanges = config.get<number>("commitReminder.minimumFileChanges") ?? 2;
    const minChanges = config.get<number>("commitReminder.minimumChanges") ?? 10;
    return { intervalUnit, interval, minFileChanges, minChanges };
}

/**
 * Check for changes every x [seconds, minutes, hours]
 */
function startInterval(): void {
    const config = getConfig();

    let multiplier = 1000 * 60;
    switch (config.intervalUnit) {
        case "seconds":
            multiplier = 1000;
            break;
        case "hours":
            multiplier = 1000 * 60 * 60;
            break;
    }

    // prettier-ignore
    interval.run(async () => {
        try {
            const result = await git.diffSummary();
            const totalChanges = result.insertions + result.deletions;
            if (result.changed >= config.minFileChanges || totalChanges >= config.minChanges) {
                vscode.window.showInformationMessage(`Don't forget to commit your new changes | ${result.changed} ${result.changed === 1 ? "file" : "files"} to commit`);
            }
        } catch (err) {
            vscode.window.showErrorMessage(err ? err.toString() : "Error");
        }
    }, multiplier * config.interval, false);
}

/**
 * Check if workspace is a git repo
 *
 * @returns Whether the workspace is a repo
 */
async function checkIsRepo(): Promise<boolean> {
    try {
        const isRepo = await git.checkIsRepo();
        if (isRepo) {
            return true;
        } else {
            logger.appendLine("vscode-commit-reminder - no git repository found");
            return false;
        }
    } catch (error) {
        logger.appendLine(`vscode-commit-reminder - no git repository found: ${error.name} ${error.message}`);
        return false;
    }
}

/**
 * If interval minutes is changed stop and restart interval
 */
const onConfigurationChanged = vscode.workspace.onDidChangeConfiguration(async (event) => {
    const unitChanged = event.affectsConfiguration("commitReminder.intervalUnit");
    const intervalChanged = event.affectsConfiguration("commitReminder.interval");
    const minFilesChanged = event.affectsConfiguration("commitReminder.minimumFileChanges");
    const minChangesChanged = event.affectsConfiguration("commitReminder.minimumChanges");

    // Restart interval if any ofter config options are affected by the changes
    if (unitChanged || intervalChanged || minFilesChanged || minChangesChanged) {
        interval.stop();

        // Check if current workspace is a git repo
        const isRepo = await checkIsRepo();
        if (isRepo) {
            startInterval();
        }
    }
});

/**
 * Runs on extension activation
 *
 * @param context context of the extension
 */
export async function activate(context: vscode.ExtensionContext): Promise<void> {
    context.subscriptions.push(onConfigurationChanged); // Add config change listener

    // Check if current workspace is a git repo
    const isRepo = await checkIsRepo();
    if (isRepo) {
        startInterval();
    }
}

/**
 * Runs on extension deactivate
 */
export function deactivate(): void {
    interval.stop();
}
