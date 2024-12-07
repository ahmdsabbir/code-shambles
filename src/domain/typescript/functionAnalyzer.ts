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
      if (ts.isFunctionDeclaration(node) && node.body) {
        topLevelRanges.push({
          pos: node.getStart(),
          end: node.body.getEnd(),
        });
      }
      ts.forEachChild(node, visit);
    };

    visit(sourceFile);

    return topLevelRanges;
  }
}
