import * as vscode from "vscode";
import { RangeAnalyzer } from "../domain/typescript/rangeAnalyzer";

type command = "editor.fold" | "editor.unfold"
interface TextRange {
  pos: number;
  end: number;
}

export class VSCodeEditorAdapter {
  private rangeAnalyzer: RangeAnalyzer;

  constructor() {
    this.rangeAnalyzer = new RangeAnalyzer();
  }

  collapseOrUncollapseFunctions(collapse: boolean) {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      return; // If no active editor is open, exit early.
    }

    const document = editor.document;
    const text = document.getText();

    // Retrieve the ranges of top-level functions from the analyzer.
    const ranges = this.rangeAnalyzer.getTopLevelRanges(text);

    // Determine the command to execute: fold or unfold.
    const command: command = collapse ? "editor.fold" : "editor.unfold";

    // Save the original cursor position to restore later.
    const originalPosition = editor.selection.active;

    // Iterate through each function range and apply the fold/unfold command.
    for (let i = 0; i < ranges.length; i++) {
      this.execCommand(command, ranges[i], document);
    }

    // Reset the cursor to its original position to avoid unwanted selection.
    editor.selection = new vscode.Selection(originalPosition, originalPosition);
  }

  private execCommand(command: command, range: TextRange, document: vscode.TextDocument) {
    const start = document.positionAt(range.pos);
    const end = document.positionAt(range.end);

    // Create a VS Code range object for the current function.
    const vscodeRange = new vscode.Range(start, end);

    // Execute the fold/unfold command for the specific range.
    vscode.commands.executeCommand(command, {
      selectionLines: [vscodeRange.start.line],
    });
  }
}
