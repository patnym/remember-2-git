'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "r2g" is now sadsaactive!');

    //Search the root dir to find out if this is a git repo or not
    let wsf: vscode.WorkspaceFolder[] | undefined = vscode.workspace.workspaceFolders;

    if(wsf !== undefined) {
        fs.exists(wsf[0].uri.fsPath + '/.git', (exists) => {
            if(exists) {
                vscode.window.showInformationMessage('Hey! This is a git repo, do you want to activate g2r?');
            }
        });
    }

    // let r: Thenable<any[]> = vscode.workspace.findFiles(".git");
    // r.then( (value: any[]) => {
    //     if(value.length > 0) {
    //         vscode.window.showInformationMessage('This is a git repo!');
    //         console.log('gIt repo');
    //     }
    //     console.log('blaa');
    // }, () => {
    //     console.log('not git repo');
    //     vscode.window.showInformationMessage('Not a git repo');
    // });
    //Register to typing event and react if we reach a specific threshold

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    // let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
    //     // The code you place here will be executed every time your command is executed

    //     // Display a message box to the user
    //     vscode.window.showInformationMessage('Hello World!');
    // });

    // context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}