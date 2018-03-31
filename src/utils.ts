import * as log from './log';

export function assertNever(x: never): never {
    throw new Error(`Unexpected value: ${x}`);
}

export function isUndefined<T>(value: T | undefined): value is undefined {
    return value === undefined;
}

export function throwError(message: string): never {
    log.error(message);
    throw new Error(message);
}

export function curry<TR, T1>(                                func: (_1: T1) => TR,                                                                 _1: T1): () => TR;
export function curry<TR, T1, T2>(                            func: (_1: T1, _2: T2) => TR,                                                         _1: T1): (_2: T2) => TR;
export function curry<TR, T1, T2, T3>(                        func: (_1: T1, _2: T2, _3: T3) => TR,                                                 _1: T1): (_2: T2, _3: T3) => TR;
export function curry<TR, T1, T2, T3, T4>(                    func: (_1: T1, _2: T2, _3: T3, _4: T4) => TR,                                         _1: T1): (_2: T2, _3: T3, _4: T4) => TR;
export function curry<TR, T1, T2, T3, T4, T5>(                func: (_1: T1, _2: T2, _3: T3, _4: T4, _5: T5) => TR,                                 _1: T1): (_2: T2, _3: T3, _4: T4, _5: T5) => TR;
export function curry<TR, T1, T2, T3, T4, T5, T6>(            func: (_1: T1, _2: T2, _3: T3, _4: T4, _5: T5, _6: T6) => TR,                         _1: T1): (_2: T2, _3: T3, _4: T4, _5: T5, _6: T6) => TR;
export function curry<TR, T1, T2, T3, T4, T5, T6, T7>(        func: (_1: T1, _2: T2, _3: T3, _4: T4, _5: T5, _6: T6, _7: T7) => TR,                 _1: T1): (_2: T2, _3: T3, _4: T4, _5: T5, _6: T6, _7: T7) => TR;
export function curry<TR, T1, T2, T3, T4, T5, T6, T7, T8>(    func: (_1: T1, _2: T2, _3: T3, _4: T4, _5: T5, _6: T6, _7: T7, _8: T8) => TR,         _1: T1): (_2: T2, _3: T3, _4: T4, _5: T5, _6: T6, _7: T7, _8: T8) => TR;
export function curry<TR, T1, T2, T3, T4, T5, T6, T7, T8, T9>(func: (_1: T1, _2: T2, _3: T3, _4: T4, _5: T5, _6: T6, _7: T7, _8: T8, _9: T9) => TR, _1: T1): (_2: T2, _3: T3, _4: T4, _5: T5, _6: T6, _7: T7, _8: T8, _9: T9) => TR;
export function curry<TR, T1, T2>(                            func: (_1: T1, _2: T2) => TR,                                                         _1: T1, _2: T2): () => TR;
export function curry<TR, T1, T2, T3>(                        func: (_1: T1, _2: T2, _3: T3) => TR,                                                 _1: T1, _2: T2): (_3: T3) => TR;
export function curry<TR, T1, T2, T3, T4>(                    func: (_1: T1, _2: T2, _3: T3, _4: T4) => TR,                                         _1: T1, _2: T2): (_3: T3, _4: T4) => TR;
export function curry<TR, T1, T2, T3, T4, T5>(                func: (_1: T1, _2: T2, _3: T3, _4: T4, _5: T5) => TR,                                 _1: T1, _2: T2): (_3: T3, _4: T4, _5: T5) => TR;
export function curry<TR, T1, T2, T3, T4, T5, T6>(            func: (_1: T1, _2: T2, _3: T3, _4: T4, _5: T5, _6: T6) => TR,                         _1: T1, _2: T2): (_3: T3, _4: T4, _5: T5, _6: T6) => TR;
export function curry<TR, T1, T2, T3, T4, T5, T6, T7>(        func: (_1: T1, _2: T2, _3: T3, _4: T4, _5: T5, _6: T6, _7: T7) => TR,                 _1: T1, _2: T2): (_3: T3, _4: T4, _5: T5, _6: T6, _7: T7) => TR;
export function curry<TR, T1, T2, T3, T4, T5, T6, T7, T8>(    func: (_1: T1, _2: T2, _3: T3, _4: T4, _5: T5, _6: T6, _7: T7, _8: T8) => TR,         _1: T1, _2: T2): (_3: T3, _4: T4, _5: T5, _6: T6, _7: T7, _8: T8) => TR;
export function curry<TR, T1, T2, T3, T4, T5, T6, T7, T8, T9>(func: (_1: T1, _2: T2, _3: T3, _4: T4, _5: T5, _6: T6, _7: T7, _8: T8, _9: T9) => TR, _1: T1, _2: T2): (_3: T3, _4: T4, _5: T5, _6: T6, _7: T7, _8: T8, _9: T9) => TR;
export function curry<TR, T1, T2, T3>(                        func: (_1: T1, _2: T2, _3: T3) => TR,                                                 _1: T1, _2: T2, _3: T3): () => TR;
export function curry<TR, T1, T2, T3, T4>(                    func: (_1: T1, _2: T2, _3: T3, _4: T4) => TR,                                         _1: T1, _2: T2, _3: T3): (_4: T4) => TR;
export function curry<TR, T1, T2, T3, T4, T5>(                func: (_1: T1, _2: T2, _3: T3, _4: T4, _5: T5) => TR,                                 _1: T1, _2: T2, _3: T3): (_4: T4, _5: T5) => TR;
export function curry<TR, T1, T2, T3, T4, T5, T6>(            func: (_1: T1, _2: T2, _3: T3, _4: T4, _5: T5, _6: T6) => TR,                         _1: T1, _2: T2, _3: T3): (_4: T4, _5: T5, _6: T6) => TR;
export function curry<TR, T1, T2, T3, T4, T5, T6, T7>(        func: (_1: T1, _2: T2, _3: T3, _4: T4, _5: T5, _6: T6, _7: T7) => TR,                 _1: T1, _2: T2, _3: T3): (_4: T4, _5: T5, _6: T6, _7: T7) => TR;
export function curry<TR, T1, T2, T3, T4, T5, T6, T7, T8>(    func: (_1: T1, _2: T2, _3: T3, _4: T4, _5: T5, _6: T6, _7: T7, _8: T8) => TR,         _1: T1, _2: T2, _3: T3): (_4: T4, _5: T5, _6: T6, _7: T7, _8: T8) => TR;
export function curry<TR, T1, T2, T3, T4, T5, T6, T7, T8, T9>(func: (_1: T1, _2: T2, _3: T3, _4: T4, _5: T5, _6: T6, _7: T7, _8: T8, _9: T9) => TR, _1: T1, _2: T2, _3: T3): (_4: T4, _5: T5, _6: T6, _7: T7, _8: T8, _9: T9) => TR;
export function curry<TR, T1, T2, T3, T4>(                    func: (_1: T1, _2: T2, _3: T3, _4: T4) => TR,                                         _1: T1, _2: T2, _3: T3, _4: T4): () => TR;
export function curry<TR, T1, T2, T3, T4, T5>(                func: (_1: T1, _2: T2, _3: T3, _4: T4, _5: T5) => TR,                                 _1: T1, _2: T2, _3: T3, _4: T4): (_5: T5) => TR;
export function curry<TR, T1, T2, T3, T4, T5, T6>(            func: (_1: T1, _2: T2, _3: T3, _4: T4, _5: T5, _6: T6) => TR,                         _1: T1, _2: T2, _3: T3, _4: T4): (_5: T5, _6: T6) => TR;
export function curry<TR, T1, T2, T3, T4, T5, T6, T7>(        func: (_1: T1, _2: T2, _3: T3, _4: T4, _5: T5, _6: T6, _7: T7) => TR,                 _1: T1, _2: T2, _3: T3, _4: T4): (_5: T5, _6: T6, _7: T7) => TR;
export function curry<TR, T1, T2, T3, T4, T5, T6, T7, T8>(    func: (_1: T1, _2: T2, _3: T3, _4: T4, _5: T5, _6: T6, _7: T7, _8: T8) => TR,         _1: T1, _2: T2, _3: T3, _4: T4): (_5: T5, _6: T6, _7: T7, _8: T8) => TR;
export function curry<TR, T1, T2, T3, T4, T5, T6, T7, T8, T9>(func: (_1: T1, _2: T2, _3: T3, _4: T4, _5: T5, _6: T6, _7: T7, _8: T8, _9: T9) => TR, _1: T1, _2: T2, _3: T3, _4: T4): (_5: T5, _6: T6, _7: T7, _8: T8, _9: T9) => TR;
export function curry<TR, T1, T2, T3, T4, T5>(                func: (_1: T1, _2: T2, _3: T3, _4: T4, _5: T5) => TR,                                 _1: T1, _2: T2, _3: T3, _4: T4, _5: T5): () => TR;
export function curry<TR, T1, T2, T3, T4, T5, T6>(            func: (_1: T1, _2: T2, _3: T3, _4: T4, _5: T5, _6: T6) => TR,                         _1: T1, _2: T2, _3: T3, _4: T4, _5: T5): (_6: T6) => TR;
export function curry<TR, T1, T2, T3, T4, T5, T6, T7>(        func: (_1: T1, _2: T2, _3: T3, _4: T4, _5: T5, _6: T6, _7: T7) => TR,                 _1: T1, _2: T2, _3: T3, _4: T4, _5: T5): (_6: T6, _7: T7) => TR;
export function curry<TR, T1, T2, T3, T4, T5, T6, T7, T8>(    func: (_1: T1, _2: T2, _3: T3, _4: T4, _5: T5, _6: T6, _7: T7, _8: T8) => TR,         _1: T1, _2: T2, _3: T3, _4: T4, _5: T5): (_6: T6, _7: T7, _8: T8) => TR;
export function curry<TR, T1, T2, T3, T4, T5, T6, T7, T8, T9>(func: (_1: T1, _2: T2, _3: T3, _4: T4, _5: T5, _6: T6, _7: T7, _8: T8, _9: T9) => TR, _1: T1, _2: T2, _3: T3, _4: T4, _5: T5): (_6: T6, _7: T7, _8: T8, _9: T9) => TR;
export function curry<TR, T1, T2, T3, T4, T5, T6>(            func: (_1: T1, _2: T2, _3: T3, _4: T4, _5: T5, _6: T6) => TR,                         _1: T1, _2: T2, _3: T3, _4: T4, _5: T5, _6: T6): () => TR;
export function curry<TR, T1, T2, T3, T4, T5, T6, T7>(        func: (_1: T1, _2: T2, _3: T3, _4: T4, _5: T5, _6: T6, _7: T7) => TR,                 _1: T1, _2: T2, _3: T3, _4: T4, _5: T5, _6: T6): (_7: T7) => TR;
export function curry<TR, T1, T2, T3, T4, T5, T6, T7, T8>(    func: (_1: T1, _2: T2, _3: T3, _4: T4, _5: T5, _6: T6, _7: T7, _8: T8) => TR,         _1: T1, _2: T2, _3: T3, _4: T4, _5: T5, _6: T6): (_7: T7, _8: T8) => TR;
export function curry<TR, T1, T2, T3, T4, T5, T6, T7, T8, T9>(func: (_1: T1, _2: T2, _3: T3, _4: T4, _5: T5, _6: T6, _7: T7, _8: T8, _9: T9) => TR, _1: T1, _2: T2, _3: T3, _4: T4, _5: T5, _6: T6): (_7: T7, _8: T8, _9: T9) => TR;
export function curry<TR, T1, T2, T3, T4, T5, T6, T7>(        func: (_1: T1, _2: T2, _3: T3, _4: T4, _5: T5, _6: T6, _7: T7) => TR,                 _1: T1, _2: T2, _3: T3, _4: T4, _5: T5, _6: T6, _7: T7): () => TR;
export function curry<TR, T1, T2, T3, T4, T5, T6, T7, T8>(    func: (_1: T1, _2: T2, _3: T3, _4: T4, _5: T5, _6: T6, _7: T7, _8: T8) => TR,         _1: T1, _2: T2, _3: T3, _4: T4, _5: T5, _6: T6, _7: T7): (_8: T8) => TR;
export function curry<TR, T1, T2, T3, T4, T5, T6, T7, T8, T9>(func: (_1: T1, _2: T2, _3: T3, _4: T4, _5: T5, _6: T6, _7: T7, _8: T8, _9: T9) => TR, _1: T1, _2: T2, _3: T3, _4: T4, _5: T5, _6: T6, _7: T7): (_8: T8, _9: T9) => TR;
export function curry<TR, T1, T2, T3, T4, T5, T6, T7, T8>(    func: (_1: T1, _2: T2, _3: T3, _4: T4, _5: T5, _6: T6, _7: T7, _8: T8) => TR,         _1: T1, _2: T2, _3: T3, _4: T4, _5: T5, _6: T6, _7: T7, _8: T8): () => TR;
export function curry<TR, T1, T2, T3, T4, T5, T6, T7, T8, T9>(func: (_1: T1, _2: T2, _3: T3, _4: T4, _5: T5, _6: T6, _7: T7, _8: T8, _9: T9) => TR, _1: T1, _2: T2, _3: T3, _4: T4, _5: T5, _6: T6, _7: T7, _8: T8): (_9: T9) => TR;
export function curry<TR, T1, T2, T3, T4, T5, T6, T7, T8, T9>(func: (_1: T1, _2: T2, _3: T3, _4: T4, _5: T5, _6: T6, _7: T7, _8: T8, _9: T9) => TR, _1: T1, _2: T2, _3: T3, _4: T4, _5: T5, _6: T6, _7: T7, _8: T8, _9: T9): () => TR;
export function curry(functor: Function, ...args: any[]) {
    return (...innerArgs: any[]) => functor(...args, ...innerArgs);
}
