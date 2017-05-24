declare var _: LodashStatic;

interface LodashStatic {
    isFunction(value: any): boolean;
    isNumber(value: any): boolean;
    isString(value: any): boolean;
    remove(array: any[], predicate?: (o: any) => boolean): any[];
}