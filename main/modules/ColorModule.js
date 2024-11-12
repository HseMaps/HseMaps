export const ColorModule = {
    getColor: (() => {
        const colorCache = new Map();
        return (progress) => {
            const key = Math.round(progress * 100);
            if (!colorCache.has(key)) {
                if (progress >= 0.99) {
                    colorCache.set(key, 'rgb(0,255,0)');
                } else {
                    const green = Math.min(Math.floor(progress * 510), 255);
                    const red = progress >= 0.49 
                        ? Math.max(255 - Math.floor((progress - 0.49) * 510), 0)
                        : 255;
                    colorCache.set(key, `rgb(${red},${green},0)`);
                }
            }
            return colorCache.get(key);
        };
    })()
};