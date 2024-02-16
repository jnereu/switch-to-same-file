const vscode = require('vscode');
const path = require('path');

function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.switchToSameFile', async () => {
        // All documents
        let allDocuments = vscode.workspace.textDocuments;

        // Get the file name to switch
        let currentEditor = vscode.window.activeTextEditor;
        if (!currentEditor) {
            vscode.window.showErrorMessage('No active editor');
            return;
        }
        let currentFileName = path.basename(currentEditor.document.fileName);

        // Check if the file is visible in any editor
        let visibleEditors = vscode.window.visibleTextEditors.filter(editor => path.basename(editor.document.fileName) === currentFileName);

        if (visibleEditors.length > 1) {
            // If the file is visible in multiple editors, activate the next one
            let currentIndex = visibleEditors.findIndex(editor => editor === currentEditor);
            let nextIndex = (currentIndex + 1) % visibleEditors.length;
            await vscode.window.showTextDocument(visibleEditors[nextIndex].document, visibleEditors[nextIndex].viewColumn);
        } else {
            // Find other files with the same name among all open documents
            let filesWithSameName = allDocuments.filter(doc => path.basename(doc.fileName) === currentFileName);

            // If there are no other files with the same name
            if (filesWithSameName.length <= 1) {
                vscode.window.showInformationMessage(`No other files with the name '${currentFileName}' found in the workspace.`);
                return;
            }

            // Find the next file with the same name in the workspace
            let currentIndex = filesWithSameName.findIndex(doc => doc.fileName === currentEditor.document.fileName);
            let nextIndex = (currentIndex + 1) % filesWithSameName.length;

            // Open the next file with the same name
            await vscode.window.showTextDocument(filesWithSameName[nextIndex]);
        }
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
