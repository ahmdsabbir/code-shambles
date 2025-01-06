import * as vscode from 'vscode';

import { FunctionCollapseService } from './application/functionCollapseService';

export function activate(context: vscode.ExtensionContext) {
    const functionService = new FunctionCollapseService();

    const collapseDisposable = vscode.commands.registerCommand('extension.collapseTopLevelFunctions', () => {
        functionService.collapseTopLevelFuncs();
    });

    const uncollapseDisposable = vscode.commands.registerCommand('extension.unCollapseTopLevelFunctions', () => {
        functionService.unCollapseTopLevelFuncs();
    });

    const collapseImports = vscode.commands.registerCommand('extension.collapseImport', () => {
        functionService.collapseImportStatements();
    });

    const unCollapseImports = vscode.commands.registerCommand('extension.unCollapseImport', () => {
        functionService.unCollapseImportStatements();
    });

    context.subscriptions.push(
        collapseDisposable,
        uncollapseDisposable,
        collapseImports,
        unCollapseImports
    );
}

export function deactivate() {}