import * as ts from 'typescript';
import { join as joinPath } from 'path';

import { throwError, isUndefined, assertNever, curry, isRestParameter } from './utils';
import { error as logError, info as logInfo } from './log';
import { TextChange, Service, FileChangeType, FileChangeTypes, Decoration, Position, Configuration } from './types';

class SourceFilesCache extends Map<string, ts.SourceFile> {
    public constructor() {
        super();
    }
}

interface ServiceContext {
    readonly rootPath: string;
    readonly configuration: Configuration;
    readonly sourceFilesCache: SourceFilesCache;
    readonly updateProgram: () => void;
    readonly getProgram: () => ts.Program;
    readonly getOptions: () => ts.CompilerOptions;
    readonly getTypeChecker: () => ts.TypeChecker;
    readonly getRootFileNames: () => ReadonlyArray<string>;
}

export function createService(
    rootPath: string,
    configuration: Configuration,
    onUpdate: () => void
): Service {
    const context = createServiceContext(rootPath, configuration, onUpdate);

    return {
        getDecorations: curry(getDecorations, context),
        notifyFileChange: curry(notifyFileChange, context),
        notifyDocumentChange: curry(notifyDocumentChange, context)
    };
}

function createServiceContext(
    rootPath: string,
    configuration: Configuration,
    onUpdate: () => void
): ServiceContext {
    const sourceFilesCache = new SourceFilesCache();
    let program: ts.Program = createProgram(rootPath, sourceFilesCache);
    const context: ServiceContext = {
        rootPath,
        configuration,
        sourceFilesCache,
        updateProgram: () => updateProgram(() => context, newProgram => program = newProgram, onUpdate),
        getProgram: () => program,
        getOptions: () => program.getCompilerOptions(),
        getTypeChecker: () => program.getTypeChecker(),
        getRootFileNames: () => program.getRootFileNames()
    };
    return context;
}

function createProgram(rootPath: string, sourceFilesCache: SourceFilesCache, oldProgram?: ts.Program): ts.Program {
    const { fileNames, options } = getParsedCommandLine(rootPath);
    const compilerHost = createCompilerHost(options, sourceFilesCache);
    const program = ts.createProgram(fileNames, options, compilerHost, oldProgram);
    return program;
}

function updateProgram(
    getContext: () => ServiceContext,
    setProgram: (newProgram: ts.Program) => void,
    onUpdate: () => void
): void {
    const context = getContext();
    const program = createProgram(context.rootPath, context.sourceFilesCache, context.getProgram());
    setProgram(program);
    onUpdate();
}

function getDecorations(
    context: ServiceContext,
    fileName: string
): ReadonlyArray<Decoration> {
    const sourceFile = context.sourceFilesCache.get(fileName);
    if (!sourceFile) {
        logError(`Failed to find source file '${fileName}' in cache.`);
        return [];
    }

    const typeChecker = context.getTypeChecker();
    const result: Decoration[] = [];
    aux(sourceFile);
    return result;

    function aux(node: ts.Node): void {
        if (ts.isVariableDeclaration(node) && !node.type && context.configuration.features.variableType) {
            result.push(getDecoration(sourceFile!, typeChecker, node.name))
        } else if (ts.isPropertySignature(node) && !node.type && context.configuration.features.propertyType) {
            result.push(getDecoration(sourceFile!, typeChecker, node.name))
        } else if (ts.isParameter(node) && !node.type && context.configuration.features.functionParameterType) {
            result.push(getDecoration(sourceFile!, typeChecker, node.name))
        } else if (ts.isFunctionDeclaration(node) && !node.type && context.configuration.features.functionReturnType) {
            const signature = typeChecker.getSignatureFromDeclaration(node);
            result.push(getDecoration(sourceFile!, typeChecker, node, node.body, signature && signature.getReturnType()));
        } else if (ts.isArrowFunction(node) && !node.type && context.configuration.features.functionReturnType) {
            const signature = typeChecker.getSignatureFromDeclaration(node);
            result.push(getDecoration(sourceFile!, typeChecker, node, node.equalsGreaterThanToken, signature && signature.getReturnType(), true));
        } else if (ts.isCallExpression(node) && node.arguments.length > 0 && context.configuration.features.parameterName) {
            const resolvedSignature = typeChecker.getResolvedSignature(node);
            for (let i = 0; i < node.arguments.length; ++i) {
                const argument = node.arguments[i];
                const parameter = resolvedSignature.parameters[i];
                if (parameter) {
                    const parameterName = (isRestParameter(parameter) ? '...' : '') + parameter.name;
                    if (parameterName !== argument.getText()) {
                        result.push({
                            textBefore: `${parameterName}: `,
                            textAfter: '',
                            startPosition: sourceFile!.getLineAndCharacterOfPosition(argument.pos + argument.getLeadingTriviaWidth()),
                            endPosition: sourceFile!.getLineAndCharacterOfPosition(argument.end)
                        });
                    }
                }
            }
        }

        node.forEachChild(aux);
    }
}

function getDecoration(
    sourceFile: ts.SourceFile,
    typeChecker: ts.TypeChecker,
    node: ts.Node,
    endNode: ts.Node | undefined = undefined,
    type: ts.Type = typeChecker.getTypeAtLocation(node),
    wrap: boolean = false
): Decoration {
    const typeName = typeChecker.typeToString(type, node.parent, ts.TypeFormatFlags.UseFullyQualifiedType);
    const leadingTriviaWidth = node.getLeadingTriviaWidth();

    const textBefore = wrap ? '(' : '';
    const textAfter = (wrap ? ')' : '') + ': ' + typeName;
    const startPosition = sourceFile.getLineAndCharacterOfPosition(node.pos + leadingTriviaWidth);
    const endPosition = sourceFile.getLineAndCharacterOfPosition(endNode ? endNode.pos : node.end);

    return { textBefore, textAfter, startPosition, endPosition };
}

function notifyDocumentChange(
    context: ServiceContext,
    fileName: string,
    textChanges: ReadonlyArray<TextChange>
): void {
    const cachedSourceFile = context.sourceFilesCache.get(fileName);
    if (!cachedSourceFile) {
        logError(`Failed to find cached source file for '${fileName}'.`);
        return;
    }

    const newSourceFile = textChanges.reduce(updateSourceFile, cachedSourceFile);
    if (newSourceFile !== cachedSourceFile) {
        context.sourceFilesCache.set(fileName, newSourceFile);
        context.updateProgram();
    }
}

function notifyFileChange(
    context: ServiceContext,
    fileName: string,
    fileChangeType: FileChangeType
): void {
    logInfo(`File ${fileChangeType.toLowerCase()}: ${fileName}`);

    switch (fileChangeType) {
        case FileChangeTypes.Created:
            const isNewRootFile = getParsedCommandLine(context.rootPath).fileNames.some(rootFile => rootFile === fileName);
            if (isNewRootFile) {
                context.updateProgram();
            }
            break;
        
        case FileChangeTypes.Deleted:
            const wasSourceFile = context.getRootFileNames().some(rootFile => rootFile === fileName);
            if (wasSourceFile) {
                context.sourceFilesCache.delete(fileName);
                context.updateProgram();
            }
            break;

        case FileChangeTypes.Changed:
            const isSourceFile = context.getRootFileNames().some(rootFile => rootFile === fileName);
            if (isSourceFile) {
                updateCachedSourceFile(context, fileName);
            }
            break;

        default:
            throw assertNever(fileChangeType);
    }
}

function updateCachedSourceFile(
    context: ServiceContext,
    fileName: string
): void {
    const cachedSourceFile = context.sourceFilesCache.get(fileName);
    if (!cachedSourceFile) {
        return context.updateProgram();
    }

    const fileContent = ts.sys.readFile(fileName, context.getProgram().getCompilerOptions().charset);
    if (fileContent === undefined) {
        logError(`Failed to read file content for '${fileName}'.`);
        return;
    }

    if (fileContent === cachedSourceFile.text) {
        return;
    }

    const newSourceFile = cachedSourceFile.update(fileContent, {
        newLength: fileContent.length,
        span: { start: 0, length: cachedSourceFile.text.length }
    });
    context.sourceFilesCache.set(fileName, newSourceFile);
    return context.updateProgram();
}

function getSourceFile(
    fileName: string,
    languageVersion: ts.ScriptTarget,
    shouldCreateNewSourceFile: boolean | undefined,
    options: ts.CompilerOptions,
    sourceFilesCache: SourceFilesCache
): ts.SourceFile | undefined {
    if (fileName === ts.getDefaultLibFileName(options)) {
        fileName = ts.getDefaultLibFilePath(options);
    }

    const cachedSourceFile = shouldCreateNewSourceFile ? undefined : sourceFilesCache.get(fileName);
    if (cachedSourceFile) {
        return cachedSourceFile;
    }

    const fileContent = ts.sys.readFile(fileName, options.charset);
    if (fileContent === undefined) {
        logError(`Failed to read file content for '${fileName}'.`);
        return undefined;
    }

    const sourceFile = ts.createSourceFile(fileName, fileContent, languageVersion);
    sourceFilesCache.set(fileName, sourceFile);
    return sourceFile;
}

function createCompilerHost(options: ts.CompilerOptions, sourceFilesCache: SourceFilesCache): ts.CompilerHost {
    const defaultCompilerHost = ts.createCompilerHost(options);
    return {
        ...defaultCompilerHost,
        getSourceFile: (fileName, languageVersion, _, shouldCreateNewSourceFile) =>
            getSourceFile(fileName, languageVersion, shouldCreateNewSourceFile, options, sourceFilesCache)
    };
}

function getParsedCommandLine(rootPath: string): ts.ParsedCommandLine {
    const configPath = joinPath(rootPath, 'tsconfig.json');
    const configContent = ts.sys.readFile(configPath);
    if (!configContent) {
        throw throwError(`Failed to read config file.`);
    }

    const configJsonFile = ts.parseJsonText(configPath, configContent);
    const parsedConfig = ts.parseJsonSourceFileConfigFileContent(configJsonFile, ts.sys, rootPath, { noEmit: true });
    if (!isUndefined(parsedConfig.errors) && parsedConfig.errors.length > 0) {
        throw throwError(`Failed to parse config file.`);
    }

    return parsedConfig;
}

function getOffsetInSourceFile(sourceFile: ts.SourceFile, position: Position): number {
    return sourceFile.getPositionOfLineAndCharacter(
        position.line,
        position.character);
}

function updateSourceFile(sourceFile: ts.SourceFile, textChange: TextChange) {
    const currentSource = sourceFile.getFullText();
    const updateStartPosition = getOffsetInSourceFile(sourceFile, textChange.start);
    const updateEndPosition = getOffsetInSourceFile(sourceFile, textChange.end);
    const oldSourceBeforeChange = currentSource.slice(0, updateStartPosition);
    const oldSourceAfterChange = currentSource.slice(updateEndPosition);
    const newSource = oldSourceBeforeChange + textChange.newText + oldSourceAfterChange;
    const textChangeRange: ts.TextChangeRange = {
        span: {
            start: updateStartPosition,
            length: updateEndPosition - updateStartPosition
        },
        newLength: textChange.newText.length
    };
    return sourceFile.update(newSource, textChangeRange);
}
