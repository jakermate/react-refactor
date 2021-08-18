// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path'
import * as fs from 'fs'
import * as parser from 'htmlparser2'

// Quick Pick Items
const quickPickItems: vscode.QuickPickItem[] = [{
	// description: 'React Class Component',
	// detail: 'React Class Component',
	label: '$(reactjs) React Class'
}, {
	// description: 'React Functional Component',
	// detail: 'React Functional Component',
	label: '$(reactjs) React Functional'
}, {
	// description: 'Vue Component',
	// detail: '$(git-merge) Vue Component',
	label: '$(git-merge) Vue'
}
]
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Extract Component Extension Activated');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	// Create extractor from selected code
	context.subscriptions.push(
		vscode.commands.registerCommand('extractor.createComponentFile', async () => {
			// get global vars
			let window = vscode.window
			let editor = window.activeTextEditor
			let doc: vscode.TextDocument | undefined = editor?.document

			// Load in user configs
			let configs = vscode.workspace.getConfiguration('extractor')

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
				codeBlock += text
			})

			let currentFilename = editor?.document.fileName

			// Get current component type of opened file
			// Extension will automatically create new component of current type
			let currentComponentEXT = currentFilename?.split('.')[currentFilename?.split('.').length - 1]
			// console.log('Current component type is ' + currentComponentEXT)

			// Get input for component name
			let newComponentName = await window.showInputBox({
				// placeHolder: `Name .${currentComponentType} component...`,
				value: `NewComponent`,
				valueSelection: [0, 12]
			})

			// Exit script if file already exists with that name
			// if(await validateFileDoesNotExist(generateDocumentPath(editor!.document.uri.fsPath) + newComponentName + "." + currentComponentEXT)) return
			// console.log('File does not exist.')
			// Snippet of all code to be copied into new component file
			let snippet = buildSnippet(getTemplate(currentComponentEXT || 'jsx'), newComponentName || "New Component", codeBlock)

			// Create the new file
			// let createFileResponse = await createNewFile(snippet, newComponentName!, editor!, currentComponentEXT!)
			
			// Delete code block from source file
			let codeReplacementResponse = await replaceSelectionWithComponentTag(editor!, newComponentName!)
			
			// Add import statement for new component path into current file
			let insertImportResponse = await insertImportStatement(editor!, newComponentName!)

		})
	)
	context.subscriptions.push(
		vscode.commands.registerCommand('extractor.createComponentFile', async () => { }))


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
async function validateFileDoesNotExist(filePath: string): Promise<boolean> {
	console.log('Checking if file exists @ ' + filePath)
	try { // If exists
		await vscode.workspace.fs.stat(vscode.Uri.parse(filePath))
		await vscode.window.showInformationMessage('File with that name already exists.')
		return Promise.resolve(true)
	}
	catch (e) {
		return Promise.reject(false)
	}

}
// Tag parsing
function parseJSX(jsxString: string): string {
	interface Map {

	}
	let map = {
		root: {

		}
	}
	let pointer = map.root
	let parse = new parser.Parser({
		onopentag(name, att) {
			console.log(`Found opening ${name} tag.`)

		},
		onclosetag(name) {
			console.log(`Found closing ${name} tag.`)
		}
	})
	parse.write(jsxString)
	parse.end()
	return jsxString
}
// Templating
function getTemplate(extension: string): string {
	console.log('getting template for extension ' + extension)
	let template: string = fs.readFileSync(path.join(__dirname, 'templates', `${extension}.${extension}`)).toString()
	console.log(template)
	return template
}
function buildSnippet(templateString: string, componentName: string, codeBlock: string): string {
	codeBlock = parseJSX(codeBlock)
	templateString = templateString.replace("NAME_PLACEHOLDER", componentName).replace('CODE_PLACEHOLDER', codeBlock)
	return templateString
}
async function createNewFile(snippet: string, newName: string, editor: vscode.TextEditor, extension: string): Promise<boolean> {
	let filepath = generateDocumentPath(editor.document.uri.fsPath)
	console.log('file path ' + filepath)
	const newFileURI = vscode.Uri.parse('untitled:' + path.join(filepath, newName + `.${extension}`));
	let newDocument = await vscode.workspace.openTextDocument(newFileURI)
	await vscode.window.showTextDocument(newDocument)
	let workspaceEdit = new vscode.WorkspaceEdit()
	workspaceEdit.insert(newFileURI, new vscode.Position(0, 0), snippet)
	// Apply edit to workspace
	let successfulEdit = await vscode.workspace.applyEdit(workspaceEdit)
	return successfulEdit
}
function generateDocumentPath(path: string) {
	console.log('path - ' + path)
	let pathArray = path.split("\\")
	let lastIndex = pathArray.pop()
	return pathArray.join('\\') + "\\"
}
// Modifying Document
async function insertImportStatement(editor: vscode.TextEditor, newComponentName: string): Promise<string> { // return boolean on success
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
		// Used WorkspaceEdit as the TextEditor class does not work when editor not focused.
		let wsedit = new vscode.WorkspaceEdit()
		wsedit.insert(editor.document.uri, new vscode.Position(insertLine, 0), `import ${newComponentName} from './${newComponentName}'\n`)
		vscode.workspace.applyEdit(wsedit)
		return 'Import statement added.'
	}
	return 'Import not inserted.'
}
// Creates a new string insert representing the newly creating component as a JSX tag
function getNewComponentTag(tagname: String){
	// Get framework specific template???
	// Temp for React only
	return `<${tagname} />`
}
// Replaces the text selection of code in the original text editor with a newly generated JSX tag that matches the newly created component
async function replaceSelectionWithComponentTag(editor: vscode.TextEditor, newComponentName: string): Promise<boolean> {
	console.log(JSON.stringify(editor))
	let start = editor.selection.start
	let end = editor.selection.end
	let wsedit = new vscode.WorkspaceEdit()
	wsedit.replace(editor.document.uri, new vscode.Range(start, end), getNewComponentTag(newComponentName))
	return await vscode.workspace.applyEdit(wsedit)
	
}

// Testing
export {
	parseJSX
}