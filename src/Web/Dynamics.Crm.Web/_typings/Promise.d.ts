declare var Promise: {
    new(executor: (resolve: Function, reject: Function) => void);
    prototype: Promise<any>;
    all<T>(promises: Promise<T>[]): Promise<T>;
    reject<T>(reason?: any): Promise<T>;
    resolve<T>(value?: any): Promise<T>;
};