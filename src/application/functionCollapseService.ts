import { VSCodeEditorAdapter } from "../infrastructure/adapter";

export class FunctionCollapseService {
  private editorAdapter: VSCodeEditorAdapter;

  constructor() {
    this.editorAdapter = new VSCodeEditorAdapter();
  }

  collapseTopLevelFuncs() {
    this.editorAdapter.toggleCollapseFunctions(true);
  }

  unCollapseTopLevelFuncs() {
    this.editorAdapter.toggleCollapseFunctions(false);
  }

  collapseImportStatements() {
    this.editorAdapter.toggleCollapseImports(true);
  }

  unCollapseImportStatements() {
    this.editorAdapter.toggleCollapseImports(false);
  }
}
