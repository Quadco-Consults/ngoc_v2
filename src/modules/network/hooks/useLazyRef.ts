import { useRef, MutableRefObject } from "react";

/**
 * A hook that lazily initializes a ref value using a provided function.
 *
 * @template R - The type of the ref value.
 * @template A - The argument types of the initializer function.
 * @param func - A function that returns the initial value.
 * @param args - Arguments to be passed to the initializer function.
 * @returns A mutable ref object containing the initialized value.
 */
export function useLazyRef<R, A extends unknown[]>(
    func: (...args: A) => R,
    ...args: A
): MutableRefObject<R> {
    const ref = useRef<R | null>(null);
    if (ref.current === null && func) {
        ref.current = func(...args);
    }
    return ref as MutableRefObject<R>;
}

export default useLazyRef;
