import * as ts from "typescript";

export class FunctionAnalyzer {
  private node?: ts.Node;

  /**
   * Sets the node to be analyzed and clears any previously stored ranges.
   * 
   * @param node The TypeScript node to be analyzed.
   * @returns This FunctionAnalyzer instance for method chaining.
   */
  setNode(node: ts.Node) {
    this.node = node;

    return this;
  }

  /**
   * Checks if the given node represents a function declaration or an arrow function.
   *
   * @param node The TypeScript node to check.
   * @returns `true` if the node is a function declaration or an arrow function 
   *          with a defined body, `false` otherwise.
   */
  public isFunc(node: ts.Node): boolean {
    return (
      (ts.isFunctionDeclaration(node) && !!node.body) ||
      (ts.isArrowFunction(node) && !!node.body)
    );
  }

  /**
   * Retrieves the text ranges of the function represented by the previously set node.
   *
   * @throws Error if no node has been set using the `setNode` method.
   * @returns An array of `ts.TextRange` objects, containing the range of the function.
   */
  public getRanges(): ts.TextRange[] {
    if (!this.node) {
      throw new Error("FunctionAnalyzer.node is not defined");
    }

    // Clear old ranges before adding new ones
    const ranges: ts.TextRange[] = [];

    if (this.isFunc(this.node)) {
      ranges.push({
        pos: this.node.getStart(),
        end: this.node.getEnd(),
      });
    }

    return ranges;
  }
}
