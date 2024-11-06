// // The module 'vscode' contains the VS Code extensibility API
// // Import the module and reference it with the alias vscode in your code below
// import * as vscode from 'vscode';

// // This method is called when your extension is activated
// // Your extension is activated the very first time the command is executed
// export function activate(context: vscode.ExtensionContext) {

// 	// Use the console to output diagnostic information (console.log) and errors (console.error)
// 	// This line of code will only be executed once when your extension is activated
// 	console.log('Congratulations, your extension "mdas" is now active!');

// 	// The command has been defined in the package.json file
// 	// Now provide the implementation of the command with registerCommand
// 	// The commandId parameter must match the command field in package.json
// 	const disposable = vscode.commands.registerCommand('mdas.helloWorld', () => {
// 		// The code you place here will be executed every time your command is executed
// 		// Display a message box to the user
// 		vscode.window.showInformationMessage('Hello World from MDAS - Angular Schemas!');
// 	});

// 	context.subscriptions.push(disposable);
// }

// // This method is called when your extension is deactivated
// export function deactivate() {}

import * as vscode from "vscode";
import { exec } from "child_process";

export function activate(context: vscode.ExtensionContext) {
  const createComponent = vscode.commands.registerCommand(
    "mdas.createComponent",
    (uri: vscode.Uri) => {
      promptForComponentOptions(uri.fsPath, "component");
    }
  );

  const createService = vscode.commands.registerCommand(
    "mdas.createService",
    (uri: vscode.Uri) => {
      promptForComponentOptions(uri.fsPath, "service");
    }
  );

  context.subscriptions.push(createComponent, createService);
}

function promptForComponentOptions(defaultPath: string, type: string) {
  vscode.window
    .showInputBox({
      prompt: `Digite o nome do ${type}:`,
    })
    .then((name) => {
      if (!name) {
        vscode.window.showErrorMessage(`O nome do ${type} é obrigatório!`);
        return;
      }

      const command = getSchematicCommand(type, name, defaultPath);
      exec(command, (err, stdout, stderr) => {
        if (err) {
          vscode.window.showErrorMessage(`Erro ao criar ${type}: ${stderr}`);
          return;
        }
        vscode.window.showInformationMessage(
          `${type} criado com sucesso: ${stdout}`
        );
      });
    });
}

function getSchematicCommand(type: string, name: string, path: string): string {
  const commandBase = `ng g mdas:${type} "${name}" --path "${path}"`;
  return type === "component"
    ? `${commandBase} --main=true --ns=false`
    : `${commandBase} --ns=true`;
}
