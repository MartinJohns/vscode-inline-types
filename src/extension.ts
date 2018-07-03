import * as vscode from 'vscode';

import { error as logError, info as logInfo } from './log';
import { createService } from './service';
import { FileChangeTypes, Decoration, TextChange, Position, Service, Configuration, Disposable } from './types';

export function activate(extensionContext: vscode.ExtensionContext): void {
    const rootPath = vscode.workspace.rootPath;
    if (!rootPath) {
        logError(`No root path found. Aborting.`);
        return;
    }

    const subscriptions: Disposable[] = [];
    function dispose(): void {
        let nextSubscription: Disposable | undefined;;
        while ((nextSubscription = subscriptions.pop()) !== undefined) {
            nextSubscription.dispose();
        }
    }
    extensionContext.subscriptions.push({ dispose });

    createServiceForExtension(rootPath, subscriptions);
    extensionContext.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('inlineTypes')) {
            dispose();
            createServiceForExtension(rootPath, subscriptions);
        }
    }));
}

function createServiceForExtension(
    rootPath: string,
    subscriptions: Disposable[]
): Service {
    const decorationType: vscode.TextEditorDecorationType = vscode.window.createTextEditorDecorationType({});
    subscriptions.push(decorationType);

    const configuration: Configuration = mapConfiguration(vscode.workspace.getConfiguration('inlineTypes'));
    const service = createService(
        rootPath,
        configuration,
        () => updateDecorations(decorationType, service, configuration));
    updateDecorations(decorationType, service, configuration);

    const fileWatcher = vscode.workspace.createFileSystemWatcher('{!node_modules,**}/*.ts');
    fileWatcher.onDidCreate(e => service.notifyFileChange(normalizeFileName(e.fsPath), FileChangeTypes.Created));
    fileWatcher.onDidChange(e => service.notifyFileChange(normalizeFileName(e.fsPath), FileChangeTypes.Changed));
    fileWatcher.onDidDelete(e => service.notifyFileChange(normalizeFileName(e.fsPath), FileChangeTypes.Deleted));
    subscriptions.push(fileWatcher);

    vscode.window.onDidChangeActiveTextEditor(() => updateDecorations(decorationType, service, configuration));
    vscode.workspace.onDidChangeTextDocument(e => service.notifyDocumentChange(
        normalizeFileName(e.document.fileName),
        e.contentChanges.map(mapContentChange)));

    return service;
}

function mapConfiguration(configuration: vscode.WorkspaceConfiguration): Configuration {
    return {
        features: configuration.features,
        updateDelay: configuration.updateDelay,
        decorationStyle: configuration.decorationStyle
    };
}

function updateDecorations(
    decorationType: vscode.TextEditorDecorationType,
    service: Service,
    configuration: Configuration
): void {
    const visibleTextEditors = vscode.window.visibleTextEditors.filter(isTypeScript);
    for (const visibleTextEditor of visibleTextEditors) {
        logInfo(`Updating decorations: ${visibleTextEditor.document.fileName}`);

        const fileName = visibleTextEditor.document.fileName;
        const decorations = service.getDecorations(normalizeFileName(fileName));
        const decorationOptions = decorations.map(d => createDecorationOptions(d, configuration));
        visibleTextEditor.setDecorations(decorationType, decorationOptions);
    }
}

function createDecorationOptions(decoration: Decoration, configuration: Configuration): vscode.DecorationOptions {
    const textDecoration = decoration.isWarning ? undefined : `none; opacity: ${configuration.decorationStyle.opacity}`;
    const color = decoration.isWarning === true
        ? configuration.decorationStyle.warnColor
        : configuration.decorationStyle.color;
    const startPosition = mapServicePosition(decoration.startPosition);
    const endPosition = mapServicePosition(decoration.endPosition);
    return {
        range: new vscode.Range(startPosition, endPosition),
        renderOptions: {
            before: { contentText: decoration.textBefore, textDecoration, color },
            after: { contentText: decoration.textAfter, textDecoration, color }
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
    return value.document.languageId === 'typescript' || value.document.languageId === 'typescriptreact';
}
