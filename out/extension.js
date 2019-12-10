"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __importStar(require("vscode"));
const promise_1 = __importDefault(require("simple-git/promise"));
const yukikaze_1 = __importDefault(require("yukikaze"));
const git = promise_1.default((_a = vscode.workspace.rootPath, (_a !== null && _a !== void 0 ? _a : process.cwd())));
const interval = new yukikaze_1.default();
// this method is called when your extension is activated
function activate(context) {
    var _a;
    const config = vscode.workspace.getConfiguration();
    const minutes = (_a = config.get("commitReminder.interval"), (_a !== null && _a !== void 0 ? _a : 30));
    startInterval(minutes);
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration((e) => {
        var _a;
        if (e.affectsConfiguration("commitReminder.interval")) {
            interval.stop();
            const config = vscode.workspace.getConfiguration();
            const minutes = (_a = config.get("commitReminder.interval"), (_a !== null && _a !== void 0 ? _a : 30));
            startInterval(minutes);
        }
    }));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
    interval.stop();
}
exports.deactivate = deactivate;
function startInterval(minutes) {
    interval.run(() => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield git.diffSummary();
            if (result.changed > 0) {
                vscode.window.showInformationMessage(`Don't forget to commit your new changes | ${result.changed} ${result.changed === 1 ? "file" : "files"} to commit`);
            }
        }
        catch (err) {
            vscode.window.showErrorMessage(err ? err.toString() : "Error");
        }
    }), 1000 * minutes); // 1000 * 60 * minutes
}
//# sourceMappingURL=extension.js.map