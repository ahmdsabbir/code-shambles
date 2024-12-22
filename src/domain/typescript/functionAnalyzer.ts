import * as ts from "typescript";

export class FunctionAnalyzer {
  getTopLevelFunctionRanges(sourceCode: string): ts.TextRange[] {
    const sourceFile = ts.createSourceFile(
      "temp.ts",
      sourceCode,
      ts.ScriptTarget.Latest,
      true
    );

    const topLevelRanges: ts.TextRange[] = [];

    const visit = (node: ts.Node) => {
      // Get ranges of the top level functions of the page
      if (ts.isFunctionDeclaration(node) && node.body) {
        topLevelRanges.push({
          pos: node.getStart(),
          end: node.body.getEnd(),
        });
      }

      // Get ranges of the arrow functions
      if (ts.isArrowFunction(node) && node.body) {
        topLevelRanges.push({
          pos: node.getStart(),
          end: node.getEnd(),
        });
      }

      // Get ranges of the methods of a class
      if (ts.isClassDeclaration(node) && node.members) {
        // Methods within a class
        node.members.forEach((member) => {
          if (ts.isMethodDeclaration(member) && member.body) {
            topLevelRanges.push({
              pos: member.getStart(),
              end: member.body.getEnd(),
            });
          } else if (ts.isConstructorDeclaration(member) && member.body) {
            topLevelRanges.push({
              pos: member.getStart(),
              end: member.body.getEnd(),
            });
          }
        });
      }

      ts.forEachChild(node, visit);
    };

    visit(sourceFile);

    return topLevelRanges;
  }
}
