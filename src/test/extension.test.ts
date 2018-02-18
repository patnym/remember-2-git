//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';
import { parseShortStatString } from '../extension';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as vscode from 'vscode';
// import * as myExtension from '../extension';

// Defines a Mocha test suite to group tests of similar kind together
suite("Extension Tests", () => {

    //Define all test strings
    let gitInsertionOnly: string = " 1 file changed, 30 insertions(+)";
    let gitDeletionOnly: string = " 1 file changed, 838 deletions(-)";
    let gitInsertionAndDeletion: string = " 1 file changed, 31 insertions(+), 57 deletions(-)";
    let gitInsertionAndDeletion2: string = " 1 file changed, 91 insertions(+), 176 deletions(-)";

    // Defines a Mocha unit test
    test("Test git parse only insertions", () => {
        let nrChanges = parseShortStatString(gitInsertionOnly);
        assert.equal(nrChanges, 30);
    });

    test("Test git parse only deletions", () => {
        let nrChanges = parseShortStatString(gitDeletionOnly);
        assert.equal(nrChanges, 838);
    });

    test("Test git parse insertion and deletion", () => {
        let nrChanges = parseShortStatString(gitInsertionAndDeletion);
        assert.equal(nrChanges, 31 + 57);
    });

    test("Test git parse insertion and deletion 2", () => {
        let nrChanges = parseShortStatString(gitInsertionAndDeletion2);
        assert.equal(nrChanges, 91 + 176);
    });
});