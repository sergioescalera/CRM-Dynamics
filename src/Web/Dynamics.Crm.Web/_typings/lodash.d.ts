declare var _: LodashStatic;

interface LodashStatic {
    chain<T>(array: T[]): Lodash<T>;

    filter<T>(array: T[], pred: (t: T) => boolean): T[];
    groupBy<T, M>(array: T[], func: (t: T) => M): any;
    map<T, M>(array: T[], func: (t: T) => M): M[];
    sortBy<T, S>(array: T[], sort?: (t: T) => S): T[];
    sortBy<T, S>(array: T[], sorts: string[]): T[];
    orderBy<T, S>(array: T[], sorts: string[], orders: string[]): T[];
    uniq<T>(array: T[]): T[];

    first<T>(array: T[]): T;
    last<T>(array: T[]): T;
    take<T>(array: T[], n?: number): T[];

    isUndefined(value: any): boolean;
    isNull(value: any): boolean;
    isFunction(value: any): boolean;
    isNumber(value: any): boolean;
    isString(value: any): boolean;
    remove(array: any[], predicate?: (o: any) => boolean): any[];

    keys(obj: any): string[];
}

interface Lodash<T> {
    filter(pred: (t: T) => boolean): Lodash<T>;
    groupBy<M>(func: (t: T) => M): Lodash<any>;
    map<M>(func: (t: T) => M): Lodash<M>;
    sortBy(sort: string[]): Lodash<T>;
    sortBy<S>(sort: (t: T) => S): Lodash<T>;
    uniq(): Lodash<T>;
    value(): any;
}