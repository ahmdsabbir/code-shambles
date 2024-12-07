import * as vscode from 'vscode';

import { FunctionCollapseService } from './application/functionCollapseService';

export function activate(context: vscode.ExtensionContext) {
    const functionService = new FunctionCollapseService();

    const collapseDisposable = vscode.commands.registerCommand('extension.collapseTopLevelFunctions', () => {
        functionService.executeCollapse();
    });

    const uncollapseDisposable = vscode.commands.registerCommand('extension.uncollapseTopLevelFunctions', () => {
        functionService.executeUncollapse();
    });

    context.subscriptions.push(collapseDisposable, uncollapseDisposable);
}

export function deactivate() {}