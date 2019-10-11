// (C) 2019 GoodData Corporation
export interface IDummyPromise<R, E> {
    willResolve?: boolean;
    result?: R;
    error?: E;
    delay: number;
}

export const createDummyPromise = <R, E>({ willResolve = true, result, error, delay }: IDummyPromise<R, E>) =>
    new Promise<R>((resolve, reject) => {
        setTimeout(() => {
            if (willResolve) {
                resolve(result);
            } else {
                reject(error);
            }
        }, delay);
    });
