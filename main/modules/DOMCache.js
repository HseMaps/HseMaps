export const DOMCache = new Proxy({}, {
    get: (cache, selector) => {
        if (!cache[selector] || !cache[selector].isConnected) {
            cache[selector] = document.querySelector(selector);
        }
        return cache[selector];
    }
});