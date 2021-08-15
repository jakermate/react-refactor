// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Activate Spinoff Extension');



	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	// Create spinoff from selected code
	context.subscriptions.push(
		vscode.commands.registerCommand('spinoff.reactComponent', async () => {
			let doc: vscode.TextDocument | undefined = vscode.window.activeTextEditor?.document
			// get text selection
			let selections: vscode.Selection[] | undefined = vscode.window.activeTextEditor?.selections
			if (selections?.length === 0) {
				vscode.window.showInformationMessage("No selection to spin off.")
				return
			}
			// loop through each line of selection
			selections?.forEach((line, index) => {
				let text = doc?.getText(new vscode.Range(line.start, line.end))
				console.log(text)
			})

			// create file
			let input = await vscode.window.showInputBox({
				// title: "Select component type.",
				placeHolder: "Select component type. (React .jsx, React .tsx)",
				validateInput: validateComponentType

			})
			let ws = new vscode.WorkspaceEdit()
			let wsfolders =  vscode.workspace.workspaceFolders
			let openFileDirectory = vscode.window.activeTextEditor?.document.uri
			let currentFilename = vscode.window.activeTextEditor?.document.fileName
			if(openFileDirectory){
				let newFilePath = vscode.Uri.file(openFileDirectory?.fsPath + "/newfile.jsx")
				console.log('Creating new jsx file at ' + newFilePath.path)
				ws.createFile(newFilePath)
			}

			
		})
	)


}

// this method is called when your extension is deactivated
export function deactivate() { }


// configs
const extensions = new Set(['.jsx', '.tsx'])
const componentFrameworks = ['React', "Vue"]

// validation
function validateComponentType(type: string): string{
	let extension = ""


	return extension
}