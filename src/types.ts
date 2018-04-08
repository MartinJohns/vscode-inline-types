export interface Position {
    readonly line: number;
    readonly character: number;
}

export interface Decoration {
    readonly textBefore: string;
    readonly textAfter: string;
    readonly startPosition: Position;
    readonly endPosition: Position;
}

export interface TextChange {
    readonly start: Position;
    readonly end: Position;
    readonly newText: string;
}

export type FileChangeType = 'Created' | 'Changed' | 'Deleted';
export const FileChangeTypes: { readonly [P in FileChangeType]: P } = {
    Created: 'Created',
    Changed: 'Changed',
    Deleted: 'Deleted'
};

export interface Service {
    notifyDocumentChange(fileName: string, textChanges: ReadonlyArray<TextChange>): void;
    notifyFileChange(fileName: string, fileChangeType: FileChangeType): void;
    getDecorations(fileName: string): ReadonlyArray<Decoration>;
}

export type FeatureType =
    | 'variableType'
    | 'functionReturnType'
    | 'functionParameterType'
    | 'propertyType'
    | 'parameterName'

export interface Configuration {
    readonly features: { readonly [P in FeatureType]: boolean };
}

export interface Disposable {
    dispose(): any;
}
