import * as vscode from "vscode";
import SimpleGit from "simple-git/promise";
import Yukikaze from "yukikaze";

const git = SimpleGit(vscode.workspace.rootPath ?? process.cwd());

const interval = new Yukikaze();

// this method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	const config = vscode.workspace.getConfiguration();
	const minutes = config.get<number>("commitReminder.interval") ?? 30;
	startInterval(minutes);

	context.subscriptions.push(vscode.workspace.onDidChangeConfiguration((e) => {
		if (e.affectsConfiguration("commitReminder.interval")) {
			interval.stop();
			const config = vscode.workspace.getConfiguration();
			const minutes = config.get<number>("commitReminder.interval") ?? 30;
			startInterval(minutes);
		}
	}));
}

// this method is called when your extension is deactivated
export function deactivate() {
	interval.stop();
}

function startInterval(minutes: number) {
	interval.run(async () => {
		try {
			const result = await git.diffSummary();
			if (result.changed > 0) {
				vscode.window.showInformationMessage(`Don't forget to commit your new changes | ${result.changed} ${result.changed === 1 ? "file" : "files"} to commit`);
			}
		} catch (err) {
			vscode.window.showErrorMessage(err ? err.toString() : "Error");
		}
	}, 1000 * minutes); // 1000 * 60 * minutes
}
