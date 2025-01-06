import * as vscode from "vscode";
import { RangeAnalyzer } from "../domain/typescript/rangeAnalyzer";

type Command = "editor.fold" | "editor.unfold";
interface TextRange {
  pos: number;
  end: number;
}

export class VSCodeEditorAdapter {
  private rangeAnalyzer: RangeAnalyzer;
  private editor: vscode.TextEditor;
  private document: vscode.TextDocument;

  constructor() {
    this.rangeAnalyzer = new RangeAnalyzer();

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      throw new Error("No active editor found. Please open a file in VS Code.");
    }

    this.editor = editor;
    this.document = editor.document;
    this.rangeAnalyzer.setSourceFile(this.document.getText());
  }

  /**
   * Toggles the collapse state (fold/unfold) of top-level functions in the file.
   * @param collapse - Whether to collapse (true) or expand (false) functions.
   */
  public toggleCollapseFunctions(collapse: boolean): void {
    const ranges = this.rangeAnalyzer.getTopLevelRanges();
    const command: Command = collapse ? "editor.fold" : "editor.unfold";
    this.applyCommandToRanges(command, ranges);
  }

  /**
   * Toggles the collapse state (fold/unfold) of import statements in the file.
   * @param collapse - Whether to collapse (true) or expand (false) imports.
   */
  public toggleCollapseImports(collapse: boolean): void {
    const importRange = this.rangeAnalyzer.getImportRange();
    if (!importRange) {
      console.warn("No import ranges detected.");
      return;
    }
    const command: Command = collapse ? "editor.fold" : "editor.unfold";
    this.applyCommandToRange(command, importRange);
  }

  /**
   * Applies a given command to multiple text ranges.
   * @param command - The command to execute (fold/unfold).
   * @param ranges - The ranges to which the command should be applied.
   */
  private applyCommandToRanges(command: Command, ranges: TextRange[]): void {
    const originalPosition = this.editor.selection.active;

    for (const range of ranges) {
      this.applyCommandToRange(command, range);
    }

    this.restoreCursorPosition(originalPosition);
  }

  /**
   * Applies a given command to a single text range.
   * @param command - The command to execute (fold/unfold).
   * @param range - The range to which the command should be applied.
   */
  private applyCommandToRange(command: Command, range: TextRange): void {
    const vscodeRange = this.createVSCodeRange(range);
    vscode.commands.executeCommand(command, {
      selectionLines: [vscodeRange.start.line],
    });
  }

  /**
   * Restores the cursor position in the editor to avoid unwanted selection.
   * @param position - The original cursor position to restore.
   */
  private restoreCursorPosition(position: vscode.Position): void {
    this.editor.selection = new vscode.Selection(position, position);
  }

  /**
   * Converts a custom `TextRange` to a VS Code `Range`.
   * @param range - The `TextRange` to convert.
   * @returns A `vscode.Range` object.
   */
  private createVSCodeRange(range: TextRange): vscode.Range {
    const start = this.document.positionAt(range.pos);
    const end = this.document.positionAt(range.end);
    return new vscode.Range(start, end);
  }
}
