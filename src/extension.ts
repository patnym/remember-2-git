// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { exec } from 'child_process';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    let gitExec: string = '';
    //Verify git is installed
    let git = vscode.workspace.getConfiguration('git');
    if(git.path === null) {
        //If git isnt defined we must exit
        vscode.window.showErrorMessage("[g2r] Git path isnt setup, please go into File > Preferences > Settings and setup path then restart VS code");
        return;
    } else {
        //todo: Need to verify this git executable aswell!
        gitExec = git.path;
    }

    //Retrieve ext configs
    let settings = vscode.workspace.getConfiguration('r2g');
    
    const triggers: ChangeTrigger[] = [];
    /**
     * At the moment it is important to add these in correct order where the most highest warning level is index 0
     * If a user makes a shit ton of changes then saves this makes sure the highest level warning displays and the rest gets deactivated
     */
    //Create warning level trigger
    triggers.push(
        new ChangeTrigger(settings.get<number>("reminderWarningLevel"), (nrChanges: number) => {
            vscode.window.showWarningMessage('Hey! You\'ave currently made ' + nrChanges +
            ' changes to your repo. Think about your team, commit these changes now!');
        })
    );
    //Create info level trigger
    triggers.push(
        new ChangeTrigger(settings.get<number>("reminderInfoLevel"), (nrChanges: number) => {
            vscode.window.showInformationMessage('Hey! You\'ave currently made ' + nrChanges +
            ' changes to your repo. Think about commiting your current changes!');
        })
    );

    //Search the root dir to find out if this is a git repo or not
    let wsf: vscode.WorkspaceFolder[] | undefined = vscode.workspace.workspaceFolders;

    if(wsf !== undefined) {
        const wdPath: string = wsf[0].uri.fsPath; 
        let item = vscode.window.showInformationMessage('Hey! This is a git repo, do you want to activate g2r?', null, "Yes", "No");

        item.then((value) => {
            if(value === 'Yes') {
                console.log("Starting g2r");
                //Start watch task
                let disposable: vscode.Disposable = vscode.workspace.onDidSaveTextDocument((e: vscode.TextDocument) => {
                    
                    exec(gitExec + ' -C ' + wdPath + '  diff --shortstat',
                        (err: Error, stdout: string, stderr: string) => {
                        if(!err) {
                            let nrChanges: number = parseShortStatString(stdout);
                            let verified: boolean = false;
                            let i: number;
                            for(i = 0; i < triggers.length && !verified; i++) {
                                verified = triggers[i].verify(nrChanges, true);
                            }

                            //Deactivate the rest
                            for(; i < triggers.length && verified; i++) {
                                triggers[i].deactivate();
                            }

                        } else {
                            console.log("Something went wrong", err, stderr);
                        }
                    });
                });
                context.subscriptions.push(disposable);
            }
        });
    }
}

// this method is called when your extension is deactivated
export function deactivate() {
}

/** 
 * Parse a git shortstat message and returns a number that represents total changes
*/
function parseShortStatString(shortStats: string) : number {
    let regex: RegExp = /(\d+)/g; //new RegExp('(\d.)', '/g');
    let results: RegExpExecArray | null;
    let changes: number = 0;
    //Helper to skip the first result
    let skipFirst: boolean = true;
    while(((results = regex.exec(shortStats)) !== null)) {             
        //Skip first result
        if(skipFirst) {
            skipFirst = false;
        } else if(results[0]) {
            changes += Number(results[0]);
        }
    }
    return changes;
}

/** 
 * Represents a trigger that reacts to the change nr
 * Just makes turning triggers off a bit cleaner and adds future support
 * for eventual custom amount of triggers
*/
class ChangeTrigger {
    triggerLevel: number;
    triggerFunc: Function;
    triggerActive: boolean = true;
    triggerTimeout: number = Date.now();

    constructor(triggerLevel: number, triggerFunc: Function) {
        this.triggerLevel = triggerLevel;
        this.triggerFunc = triggerFunc;
    }

    /**
     * Verifies this trigger by the number of changes, will trigger a message if changes > triggerLevel.
     * @param changeNumber number of changes
     * @param activateTriggerIfFalse if true we activate this trigger again if verify returns false (aka change number has gone down again) 
     * or if the timeout has passed
     */
    verify(changeNumber: number, activateTriggerIfFalse: boolean) {
        if(this.triggerActive &&
            changeNumber > this.triggerLevel && 
            Date.now() > this.triggerTimeout) {
            this.triggerFunc(changeNumber);

            //Set trigger timeout, this just pervents 10 triggers in a row if som1 is a bit  spastic
            //Currently set to 5 minutes
            this.setCustomTimeout(300);

            //Deactivate trigger
            this.triggerActive = false;

            return true;
        } else if(changeNumber < this.triggerLevel || Date.now() > this.triggerTimeout) {
            this.triggerActive = activateTriggerIfFalse;
            return false;
        }
    }

    /**
     * Set a custom timeout for this trigger
     * @param timeOutInSeconds How long this trigger is deactivated in seconds
     */
    setCustomTimeout(timeOutInSeconds: number) {
        this.triggerTimeout = timeOutInSeconds * 1000;
    }

    /**
     * Deactivates this trigger
     */
    deactivate() {
        this.triggerActive = false;
    }


}