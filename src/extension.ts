// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path'
import * as fs from 'fs'


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
		vscode.commands.registerCommand('spinoff.createComponentFile', async () => {
			// get global vars
			let window = vscode.window
			let editor = window.activeTextEditor
			let doc: vscode.TextDocument | undefined = editor?.document
			// get text selection
			let selection: vscode.Selection[] | undefined = editor?.selections
			if (selection?.length === 0) {
				window.showInformationMessage("No selection to spin off.")
				return
			}
			// Loop through each line of selection and build code block
			let codeBlock = ""
			selection?.forEach((line, index) => {
				let text = doc?.getText(new vscode.Range(line.start, line.end))
				codeBlock += text + '/n'
				console.log(codeBlock)
			})

			let currentFilename = editor?.document.fileName

			// Get current component type of opened file
			// Extension will automatically create new component of current type
			let currentComponentType = currentFilename?.split('.')[currentFilename?.split('.').length - 1]
			console.log('Current component type is ' + currentComponentType)

			// Get input for component name
			let newComponentName = await window.showInputBox({
				// placeHolder: `Name .${currentComponentType} component...`,
				value: `NewComponent`,
				valueSelection: [0, 12]
			})
			

			// Snippet of all code to be copied into new component file
			let snippet = buildSnippet(getTemplate(currentComponentType || 'jsx'), newComponentName || "New Component", codeBlock)
			console.log('new code snippet  === ' + snippet)

			let createFileResponse = await createFile(snippet, newComponentName!, editor!)
			console.log(createFileResponse)
			// Delete selection from current file


			// Add import statement for new component path into current file
			let insertImportResponse = await insertImportStatement(editor!, newComponentName!)
			console.log(insertImportResponse)
			

		})
	)
	context.subscriptions.push(
		vscode.commands.registerCommand('spinoff.createComponentFile', async () => {}))


}

// this method is called when your extension is deactivated
export function deactivate() { }


// configs
const componentFrameworks = {
	react: {
		name: 'react',
		extensions: ['.jsx', '.tsx'],
		template: path.join(__dirname, "templates", "jsx.jsx")
	},
	vue: {
		name: 'vue',
		extensions: ['.vue'],
		template: path.join(__dirname, "templates", "vue.vue")
	},
	svelte: {
		name: "svelte",
		extensions: ['.svelte'],
		template: path.join(__dirname, "templates", "svelte.svelte")
	}
}

// Validation
function validateComponentType(type: string): string {
	let extension = ""


	return extension
}
function validateFileName(filename: string | undefined, path: string | undefined): boolean {
	if (!filename) return false
	if (filename.length === 0) return false
	return false
}
// Templating
function getTemplate(extension: string): string {
	console.log('getting template for extension ' + extension)
	let template: string = fs.readFileSync(path.join(__dirname, 'templates', `${extension}.${extension}`)).toString()
	console.log(template)
	return template
}
function buildSnippet(templateString: string, componentName: string, codeBlock: string): string {
	templateString = templateString.replace("NAME_PLACEHOLDER", componentName).replace('CODE_PLACEHOLDER', codeBlock)
	return templateString
}
async function createFile(snippet: string, newName: string, editor: vscode.TextEditor): Promise<boolean>{
	let filepath = getFilePath(editor.document.uri.fsPath)
	console.log('file path ' + filepath)
	const newFile = vscode.Uri.parse('untitled:' + path.join(filepath, newName));
	vscode.window.showTextDocument(newFile)
	let workspaceEdit = new vscode.WorkspaceEdit()
	workspaceEdit.insert(newFile, new vscode.Position(0,0), snippet)
	// Apply edit to workspace
	let successfulEdit = vscode.workspace.applyEdit(workspaceEdit)
	return successfulEdit
}
function getFilePath(path: string){
	console.log('path - ' + path)
	let pathArray = path.split("\\")
	let lastIndex = pathArray.pop()
	return pathArray.join('\\') + "\\"
}
// Modifying Document
async function insertImportStatement(editor: vscode.TextEditor, newComponentName: string): Promise<string>{ // return boolean on success
	let lineCount: number | undefined = editor?.document.lineCount || 0
	let insertLine = 0
	let needsImportStatement = true
	for (let i = 0; i < lineCount; i++) {
		let line = editor?.document.lineAt(i)
		if (line?.text.startsWith('import')) {
			if (line.text.includes(`import ${newComponentName} from './${newComponentName}'`)) {
				console.log('Import already exists')
				needsImportStatement = false
				break
			}
			console.log('Another import statement found')
			insertLine = i + 1// sets insert line to index after last found import statement
		}
	}
	if (needsImportStatement) {
		editor?.edit((editBuilder) => {
			editBuilder.insert(new vscode.Position(insertLine, 0), `import ${newComponentName} from './${newComponentName}'\n`)
		})
		return 'Import statement added.'
	}
	return 'Import not inserted.'
}
async function deleteCodeBlock(editor: vscode.TextEditor, codeBlock: string): Promise<boolean>{
	return false
}