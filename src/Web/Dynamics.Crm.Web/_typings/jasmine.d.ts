declare var describe: (suiteTitle: string, suite: () => void) => void;
declare var it: (specTitle: string, spec: () => void) => void;
declare var expect: (actual) => IExpectation;
interface IExpectation {
    toBe(expected): void;
    toBeNull(): void;
    toEqual(expected: any): void;
    not: IExpectation;
}