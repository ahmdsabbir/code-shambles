import * as ts from "typescript";

export class ImportRanges {
  private file?: ts.SourceFile;

  /**
   * Sets the node to be analyzed and clears any previously stored ranges.
   *
   * @param node The TypeScript node to be analyzed.
   * @returns This FunctionAnalyzer instance for method chaining.
   */
  setNode(file: ts.SourceFile) {
    this.file = file;

    return this;
  }

  public getRanges(): ts.TextRange {
    if (!this.file) {
      throw new Error("ImportRanges.node is not defined");
    }

    let firstImportIndex = -1;
    let lastImportIndex = -1;

    const text = this.file.getFullText();
    const lines = text.split(/\r?\n/);

    // Iterate through the lines to find the first and last import statements
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("import")) {
        if (firstImportIndex === -1) {
          firstImportIndex = i;
        }
        lastImportIndex = i;
      }
    }

    // Calculate the range
    const start = this.file.getPositionOfLineAndCharacter(firstImportIndex, 0);
    const end = this.file.getPositionOfLineAndCharacter(
      lastImportIndex,
      lines[lastImportIndex].length
    );

    const range: ts.TextRange = { pos: start, end: end };

    console.log(`First import range starts at: ${start}`);
    console.log(`Last import range ends at: ${end}`);

    return range;
  }
}
