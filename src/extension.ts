import * as vscode from 'vscode';

import { error as logError, info as logInfo } from './log';
import { createService } from './service';
import { FileChangeTypes, Decoration, TextChange, Position, Service } from './types';

export function activate(extensionContext: vscode.ExtensionContext): void {
    const rootPath = vscode.workspace.rootPath;
    if (!rootPath) {
        logError(`No root path found. Aborting.`);
        return;
    }

    const decorationType: vscode.TextEditorDecorationType = vscode.window.createTextEditorDecorationType({});
    extensionContext.subscriptions.push(decorationType);

    const service = createService(rootPath, () => updateDecorations(decorationType, service));
    updateDecorations(decorationType, service);

    const fileWatcher = vscode.workspace.createFileSystemWatcher('{!node_modules,**}/*.ts');
    fileWatcher.onDidCreate(e => service.notifyFileChange(normalizeFileName(e.fsPath), FileChangeTypes.Created));
    fileWatcher.onDidChange(e => service.notifyFileChange(normalizeFileName(e.fsPath), FileChangeTypes.Changed));
    fileWatcher.onDidDelete(e => service.notifyFileChange(normalizeFileName(e.fsPath), FileChangeTypes.Deleted));
    extensionContext.subscriptions.push(fileWatcher);

    vscode.window.onDidChangeActiveTextEditor(() => updateDecorations(decorationType, service));
    vscode.workspace.onDidChangeTextDocument(e => service.notifyDocumentChange(
        normalizeFileName(e.document.fileName),
        e.contentChanges.map(mapContentChange)));
}

function updateDecorations(
    decorationType: vscode.TextEditorDecorationType,
    service: Service
): void {
    const visibleTextEditors = vscode.window.visibleTextEditors.filter(isTypeScript);
    for (const visibleTextEditor of visibleTextEditors) {
        logInfo(`Updating decorations: ${visibleTextEditor.document.fileName}`);

        const fileName = visibleTextEditor.document.fileName;
        const decorations = service.getDecorations(normalizeFileName(fileName));
        const decorationOptions = decorations.map(createDecorationOptions);
        visibleTextEditor.setDecorations(decorationType, decorationOptions);
    }
}

function createDecorationOptions(decoration: Decoration): vscode.DecorationOptions {
    const textDecoration = `none; opacity: 0.5`;
    const startPosition = mapServicePosition(decoration.startPosition);
    const endPosition = mapServicePosition(decoration.endPosition);
    return {
        range: new vscode.Range(startPosition, endPosition),
        renderOptions: {
            before: { contentText: decoration.textBefore, textDecoration },
            after: { contentText: decoration.textAfter, textDecoration }
        }
    };
}

function mapContentChange(contentChange: vscode.TextDocumentContentChangeEvent): TextChange {
    return {
        start: contentChange.range.start,
        end: contentChange.range.end,
        newText: contentChange.text
    };
}

function mapServicePosition(position: Position): vscode.Position {
    return new vscode.Position(position.line, position.character);
}

function normalizeFileName(fileName: string): string {
    return fileName.replace(/\\/g, '/');
}

function isTypeScript(value: vscode.TextEditor): boolean {
    return value.document.languageId === 'typescript';
}
