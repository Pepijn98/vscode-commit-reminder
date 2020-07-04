import vscode from "vscode";
import SimpleGit from "simple-git/promise";
import Yukikaze from "yukikaze";

const workspace =
    vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
        ? vscode.workspace.workspaceFolders[0].uri.fsPath
        : process.cwd();

const git = SimpleGit(workspace);
const interval = new Yukikaze();

/**
 * Check for changes every x minutes
 *
 * @param minutes x amount of minutes to check for new changes
 */
function startInterval(minutes: number, minimumFileChanges: number, minimumChanges: number): void {
    interval.run(async () => {
        try {
            const result = await git.diffSummary();
            const totalChanges = result.insertions + result.deletions;
            if (result.changed >= minimumFileChanges || totalChanges >= minimumChanges) {
                vscode.window.showInformationMessage(`Don't forget to commit your new changes | ${result.changed} ${result.changed === 1 ? "file" : "files"} to commit`);
            }
        } catch (err) {
            vscode.window.showErrorMessage(err ? err.toString() : "Error");
        }
    }, 1000 * 60 * minutes, false);
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
            console.error("vscode-commit-reminder - no git repository found");
            return false;
        }
    } catch (error) {
        console.error(`vscode-commit-reminder - no git repository found: ${error.name} ${error.message}`);
        return false;
    }
}

/**
 * If interval minutes is changed stop and restart interval
 */
const onConfigurationChanged = vscode.workspace.onDidChangeConfiguration(async (event) => {
    if (event.affectsConfiguration("commitReminder.interval")
        || event.affectsConfiguration("commitReminder.minimumFileChanges")
        || event.affectsConfiguration("commitReminder.minimumChanges")) {
        interval.stop();

        const config = vscode.workspace.getConfiguration();
        const minutes = config.get<number>("commitReminder.interval") ?? 30;
        const minimumFileChanges = config.get<number>("commitReminder.minimumFileChanges") ?? 2;
        const minimumChanges = config.get<number>("commitReminder.minimumChanges") ?? 10;

        const isRepo = await checkIsRepo();
        if (isRepo) {
            startInterval(minutes, minimumFileChanges, minimumChanges);
        }
    }
});

/**
 * Runs on extension activation
 *
 * @param context context of the extension
 */
export async function activate(context: vscode.ExtensionContext): Promise<void> {
    context.subscriptions.push(onConfigurationChanged);

    const config = vscode.workspace.getConfiguration();
    const minutes = config.get<number>("commitReminder.interval") ?? 30;
    const minimumFileChanges = config.get<number>("commitReminder.minimumFileChanges") ?? 2;
    const minimumChanges = config.get<number>("commitReminder.minimumChanges") ?? 10;

    const isRepo = await checkIsRepo();
    if (isRepo) {
        startInterval(minutes, minimumFileChanges, minimumChanges);
    }
}

/**
 * Runs on extension deactivate
 */
export function deactivate(): void {
    interval.stop();
}
