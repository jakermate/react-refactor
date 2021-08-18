import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';
import * as ext from '../../extension'

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});

	test('JSXParsing Test', () => {
		assert.strictEqual(ext.parseJSX('<header></header>'), '<header></header>')
		assert.strictEqual(ext.parseJSX('<header><img /></header>'), '<header><img /></header>')
		assert.strictEqual(ext.parseJSX('<header><img /></header><p>this is a paragraph</p>'), '<div><header><img /></header><p>this is a paragraph</p></div>') 
 

	})
});
