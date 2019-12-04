"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __importStar(require("vscode"));
const yukikaze_1 = __importDefault(require("yukikaze"));
const interval = new yukikaze_1.default();
// this method is called when your extension is activated
function activate(context) {
    interval.run(() => {
        vscode.window.showInformationMessage("Don't forget to commit your new changes");
    }, 1000 * 60 * 30); // Every 30 minutes 1800000 milliseconds
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
    interval.stop();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map