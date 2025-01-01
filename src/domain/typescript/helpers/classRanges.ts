import * as ts from "typescript";

export class ClassAnalyzer {
  private node?: ts.Node;

  /**
   * Sets the node to be analyzed.
   *
   * @param node The TypeScript node to be analyzed.
   * @returns This ClassAnalyzer instance for method chaining.
   */
  public setNode(node: ts.Node) {
    this.node = node;

    return this;
  }

  /**
   * Checks if the given node represents a class declaration with at least one member.
   *
   * @param node The TypeScript node to check.
   * @returns `true` if the node is a class declaration with members,
   *          `false` otherwise.
   */
  public isClass(node: ts.Node): boolean {
    return ts.isClassDeclaration(node) && !!node.members;
  }

  /**
   * Retrieves the text ranges of all methods and constructors within the
   * previously set class node.
   *
   * @throws Error if no node has been set using the `setNode` method.
   * @returns An array of `ts.TextRange` objects, containing the ranges of
   *          all methods and constructors within the class.
   */
  public getRanges(): ts.TextRange[] {
    if (!this.node) {
      throw new Error("ClassAnalyzer.node is not defined");
    }

    // Clear old ranges before adding new ones
    const ranges: ts.TextRange[] = [];

    if (this.isClass(this.node)) {
      const classNode = this.node as ts.ClassDeclaration;

      for (let i = 0; i < classNode.members.length; i++) {
        if (
          ts.isMethodDeclaration(classNode.members[i]) ||
          ts.isConstructorDeclaration(classNode.members[i])
        ) {
          // Inlude method ranges from the class range
          ranges.push({ 
            pos: classNode.members[i].getStart(),
            end: classNode.members[i].getEnd()
          });
        }
      }
    }

    return ranges;
  }
}
