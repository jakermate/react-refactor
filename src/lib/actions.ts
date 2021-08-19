import * as vscode from 'vscode'
import * as funcs from './func'
export default class CodeAction implements vscode.CodeActionProvider{
    public static readonly providedCodeActionKinds = [
        vscode.CodeActionKind.Refactor
    ]
    public provideCodeActions(document: vscode.TextDocument, range: vscode.Range): vscode.CodeAction[] | undefined{
        // Builder to create code actions that correspond to each existing command
        const createAction = (title: string, command: string) => {
            let action = new vscode.CodeAction('Replacement', vscode.CodeActionKind.Refactor)
            // action.edit = new vscode.WorkspaceEdit()
            // action.edit.replace(document.uri, range, funcs.returnComponentTag())
            // return action
            action.command = {
                title:  title,
                command: command
            }
            return action
        }
        const extractToFile = createAction('Extract Component to File', 'extractor.extractToNewFile')
        const extractToModule = createAction('Extract Component to Exclosing Scope', 'extractor.extractToModuleScope')
        const extractToEnclosing = createAction('Extract Component to Module Scope', 'extractor.extractToEnclosingScope')

        return [
            extractToFile,
            extractToEnclosing,
            extractToModule
        ]
    }
}