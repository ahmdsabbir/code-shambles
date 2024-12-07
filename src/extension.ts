import * as vscode from 'vscode';
import * as ts from 'typescript';

export function activate(context: vscode.ExtensionContext) {
    let collapseDisposable = vscode.commands.registerCommand('extension.collapseTopLevelFunctions', () => {
        collapseOrUncollapseFunctions(true);
    });

    let uncollapseDisposable = vscode.commands.registerCommand('extension.uncollapseTopLevelFunctions', () => {
        collapseOrUncollapseFunctions(false);
    });

    context.subscriptions.push(collapseDisposable, uncollapseDisposable);
}

function collapseOrUncollapseFunctions(collapse: boolean) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return; // No open text editor
    }

    const document = editor.document;
    const sourceFile = ts.createSourceFile(
        document.fileName,
        document.getText(),
        ts.ScriptTarget.Latest,
        true
    );

    const topLevelRanges: vscode.Range[] = [];

    const visit = (node: ts.Node) => {
        if (ts.isFunctionDeclaration(node) && node.body) {
            const start = document.positionAt(node.getStart());
            const end = document.positionAt(node.body.getEnd());
            topLevelRanges.push(new vscode.Range(start, end));
        }
        ts.forEachChild(node, visit);
    };

    visit(sourceFile);

    const command = collapse ? 'editor.fold' : 'editor.unfold';

    topLevelRanges.forEach(range => {
        editor.selection = new vscode.Selection(range.start, range.end);
        vscode.commands.executeCommand(command);
    });
}

export function deactivate() {}