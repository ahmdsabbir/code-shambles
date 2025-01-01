import * as vscode from "vscode";
import { RangeAnalyzer } from "../domain/typescript/rangeAnalyzer";

export class VSCodeEditorAdapter {
  private rangeAnalyzer: RangeAnalyzer;
  
  constructor() {
    this.rangeAnalyzer = new RangeAnalyzer();
  }

  collapseOrUncollapseFunctions(collapse: boolean) {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      return;
    }

    const document = editor.document;
    const text = document.getText();
    const ranges = this.rangeAnalyzer.getTopLevelRanges(text);

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
