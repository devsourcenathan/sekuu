import { useState, useCallback } from 'react';

export function useToggle(
    initialState: boolean = false
): [boolean, () => void] {
    const [state, setState] = useState<boolean>(initialState);

    const toggle = useCallback(() => {
        setState((prevState) => !prevState);
    }, []);

    return [state, toggle];
}