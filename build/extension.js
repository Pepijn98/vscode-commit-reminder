"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const promise_1 = __importDefault(require("simple-git/promise"));
const yukikaze_1 = __importDefault(require("yukikaze"));
const git = promise_1.default((_a = vscode.workspace.rootPath) !== null && _a !== void 0 ? _a : process.cwd());
const interval = new yukikaze_1.default();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    }), 5000);
    // }, 1000 * 60 * minutes);
}
function activate(context) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const config = vscode.workspace.getConfiguration();
        const minutes = (_a = config.get("commitReminder.interval")) !== null && _a !== void 0 ? _a : 30;
        try {
            const isRepo = yield git.checkIsRepo();
            if (isRepo) {
                startInterval(minutes);
            }
        }
        catch (error) {
            console.error(`vscode-commit-reminder - no git repository found: ${error.name} ${error.message}`);
        }
        context.subscriptions.push(vscode.workspace.onDidChangeConfiguration((e) => {
            var _a;
            if (e.affectsConfiguration("commitReminder.interval")) {
                interval.stop();
                const config = vscode.workspace.getConfiguration();
                const minutes = (_a = config.get("commitReminder.interval")) !== null && _a !== void 0 ? _a : 30;
                startInterval(minutes);
            }
        }));
    });
}
exports.activate = activate;
function deactivate() {
    interval.stop();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map