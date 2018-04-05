declare var Promise: {
    new (executor: (resolve: Function, reject: Function) => void);
    prototype: Promise<any, any>;
    all<TValue, TError>(promises: Promise<TValue, TError>[]): Promise<TValue, TError>;
    reject<TValue, TError>(reason?: any): Promise<TValue, TError>;
    resolve<TValue, TError>(value?: any): Promise<TValue, TError>;
}

interface Promise<TValue, TError> extends Function {
    catch(onRejected: (reason?: TError) => void): Promise<TValue, TError>;
    then<TMappedValue>(onFulfilled: (value?: TValue) => TMappedValue): Promise<TMappedValue, TError>;
    finally(onFinally: Function): Promise<TValue, TError>;
}