export const DataModule = (function() {
    const data = {
        distMatrix: [],
        nextMatrix: [],
        rooms: [],
        verts: []
    };

    async function fetchJSON(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Failed to fetch ${url}:`, error);
            throw error;
        }
    }

    async function initialize() {
        try {
            const [distMatrix, nextMatrix, rooms, verts] = await Promise.all([
                fetchJSON('elements/DistanceMatrix.json'),
                fetchJSON('elements/PrecomputedPaths.json'),
                fetchJSON('elements/SLAVEWORK.json').then(flipKeyValuePairWithMultiNodes),
                fetchJSON('elements/Vertices.json')
            ]);
            
            Object.assign(data, { distMatrix, nextMatrix, rooms, verts });
        } catch (error) {
            console.error('Initialization failed:', error);
            throw error;
        }
    }

    return {
        initialize,
        get: () => data
    };
})();