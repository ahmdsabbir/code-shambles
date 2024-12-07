import * as vscode from "vscode";
import { FunctionAnalyzer } from "../domain/typescript/functionAnalyzer";

export class VSCodeEditorAdapter {
  private functionAnalyzer: FunctionAnalyzer;
  
  constructor() {
    this.functionAnalyzer = new FunctionAnalyzer();
  }

  collapseOrUncollapseFunctions(collapse: boolean) {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      return;
    }

    const document = editor.document;
    const text = document.getText();
    const ranges = this.functionAnalyzer.getTopLevelFunctionRanges(text);

    const command = collapse ? "editor.fold" : "editor.unfold";

    ranges.forEach((range) => {
      const start = document.positionAt(range.pos);
      const end = document.positionAt(range.end);
      const vscodeRange = new vscode.Range(start, end);

      editor.selection = new vscode.Selection(
        vscodeRange.start,
        vscodeRange.end
      );
      vscode.commands.executeCommand(command);
    });
  }
}
