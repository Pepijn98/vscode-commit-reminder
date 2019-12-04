import * as vscode from "vscode";
import Yukikaze from "yukikaze";

const interval = new Yukikaze();

// this method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	interval.run(() => {
		vscode.window.showInformationMessage("Don't forget to commit your new changes");
	}, 1000 * 60 * 30); // Every 30 minutes 1800000 milliseconds
}

// this method is called when your extension is deactivated
export function deactivate() {
	interval.stop();
}
