const vscode = require('vscode');
const path = require('path');

function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.switchToSameFile', async () => {
        // Get the currently opened editor
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor');
            return;
        }

        // Get the file name of the currently opened file
        let currentFileName = path.basename(editor.document.fileName);

        // Get all text documents in the workspace
        let allDocuments = vscode.workspace.textDocuments;

        // Filter documents to find ones with the same name as the current file
        let filesWithSameName = allDocuments.filter(doc => path.basename(doc.fileName) === currentFileName);

        // If there are no other files with the same name
        if (filesWithSameName.length <= 1) {
            vscode.window.showInformationMessage(`No other files with the name '${currentFileName}' found in the workspace. ${JSON.stringify(filesWithSameName)}`);
            return;
        }

        // Find the next file with the same name in the workspace
        let currentIndex = filesWithSameName.findIndex(doc => doc.fileName === editor.document.fileName);
        let nextIndex = (currentIndex + 1) % filesWithSameName.length;

        // Open the next file with the same name
        await vscode.window.showTextDocument(filesWithSameName[nextIndex]);
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
