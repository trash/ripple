declare module NDArray {
    export class NDArray<T> {
        constructor (data: T[], dimensions: [number, number]);
        data: T[];
        shape: [number, number];
    }
}


declare module 'ndarray' {
    type NDArrayFunction = <T>(data: T[], dimensions: [number, number]) => NDArray.NDArray<T>;
    export = NDArray.NDArray;
}