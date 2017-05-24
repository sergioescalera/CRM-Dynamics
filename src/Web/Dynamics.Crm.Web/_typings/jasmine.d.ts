declare var describe: (suiteTitle: string, suite: () => void) => void;
declare var it: (specTitle: string, spec: (done?: () => void) => void) => void;
declare var expect: (actual: any) => IExpectation;
declare var beforeEach: (action: () => void) => void;
declare var afterEach: (action: () => void) => void;
interface IExpectation {
    toBe(expected: any): void;
    toBeDefined(): void;
    toBeNull(): void;
    toEqual(expected: any): void;
    toHaveBeenCalled(): void;
    toThrowError(error?: any): void;
    toThrowError(error?: any, ...params: any[]): void;
    not: IExpectation;
}