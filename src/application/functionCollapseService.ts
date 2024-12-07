import { VSCodeEditorAdapter } from "../infrastructure/adapter";

export class FunctionCollapseService {
    private editorAdapter: VSCodeEditorAdapter;

    constructor() {
        this.editorAdapter = new VSCodeEditorAdapter();
    }

    executeCollapse() {
        this.editorAdapter.collapseOrUncollapseFunctions(true);
    }

    executeUncollapse() {
        this.editorAdapter.collapseOrUncollapseFunctions(false);
    }
}