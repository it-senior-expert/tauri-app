import localforage from 'localforage';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Store } from 'tauri-plugin-store-api';
import { useTauriContext } from './TauriProvider';

const RUNNING_IN_TAURI = window.__TAURI__ !== undefined;
export const USE_STORE = false && RUNNING_IN_TAURI;
const SAVE_DELAY = 400;

const stores = {};

function keyInObj(obj: Record<string, any>, key: string): boolean {
    return Object.hasOwnProperty.call(obj, key);
}

function getTauriStore(filename: string): Store {
    if (!keyInObj(stores, filename)) stores[filename] = new Store(filename);
    return stores[filename];
}

export async function testStore() {
    const x = new Store('test.json');
    const val = await x.get('DNE');
    await x.set('Exists', 'sad');
    await x.save();
}

export function createStorage(storeName: string | undefined) {
    let loading = useTauriContext().loading;
    const [data, setData] = useState<Record<string, any> | undefined>(undefined);
    loading = loading || storeName === undefined || data === undefined;

    const localDataRef = useRef<any>(null);
    const fileStoreRef = useRef<Store | null>(null); // Ensure it can be either Store or null
    const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Typing for timeoutRef

    useEffect(() => {
        if (storeName === undefined) return;

        if (RUNNING_IN_TAURI) {
            fileStoreRef.current = getTauriStore(storeName);
            fileStoreRef.current.get('data').then(
                value => {
                    if (value === null) {
                        const newValue: Record<string, any> = {};  // Explicitly type newValue
                        fileStoreRef.current?.set('data', newValue)
                            .then(() => setData(newValue));
                    } else {
                        setData(value);
                    }
                }
            );
        } else {
            localforage.getItem(storeName, (err, value) => {
                if (err !== undefined && value === null || Array.isArray(value)) {
                    const newValue: Record<string, any> = {}; // Explicitly type newValue
                    localforage.setItem(storeName, newValue, (err, val) => {
                        if (err !== null && err !== undefined) {
                            return alert('cannot store data, application will not work as intended');
                        }
                        setData(val);
                    });
                } else {
                    setData(value || '');
                }
            });
        }
    }, [storeName]);

    const setItem = useCallback((key: string, newValueOrHandler: any) => {
        if (loading) return;
        clearTimeout(timeoutRef.current as NodeJS.Timeout);
        setData(data => {
            const prev = data?.[key];
            let newData: Record<string, any> = {}; // Explicitly type newData
            try {
                newData = { ...data!, [key]: newValueOrHandler(prev) };  // Fallback to data! to assure non-null
            } catch (TypeError) {
                newData = { ...data!, [key]: newValueOrHandler };  // Handle static value
            }
            if (newData !== data) {
                if (RUNNING_IN_TAURI) {
                    // Ensure fileStoreRef.current is not null before accessing it
                    if (fileStoreRef.current) {
                        fileStoreRef.current.set('data', newData)
                            .then(() => {
                                timeoutRef.current = setTimeout(() => fileStoreRef.current?.save(), SAVE_DELAY);
                            });
                    }
                } else {
                    timeoutRef.current = setTimeout(() => localforage.setItem(storeName!, newData), SAVE_DELAY);
                }
            }
            return newData;
        });
    }, [storeName, loading]);

    const getItem = useCallback((key: string, defaultValue: any) => {
        if (loading) return defaultValue;
        const value = data?.[key];
        if (value === undefined && defaultValue !== undefined) {
            setData(data => ({ ...data!, [key]: defaultValue }));
            return defaultValue;
        }
        return value;
    }, [loading, data]);

    const useItem = useCallback((key: string, defaultValue: any) => {
        const value = getItem(key, defaultValue);
        return [value, (newValue: any) => setItem(key, newValue)];
    }, [getItem, setItem]);

    return {
        get: getItem,
        set: setItem,
        use: useItem,
        data,
        loading
    };
}
