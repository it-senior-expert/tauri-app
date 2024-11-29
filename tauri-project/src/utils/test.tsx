export function test() {
    if (window.__TAURI__) {
        // Proceed with loading the store
    } else {
        console.error('Tauri API is not initialized');
    }
}