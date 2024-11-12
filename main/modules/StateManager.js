export const StateManager = (() => {
    const state = new Proxy({
        totalDistance: 0,
        firstPathRendered: true,
        secondPathRendered: false,
        currentFloor: 'main',
        skipStart: () => true,
        skipEnd: () => false,
        onPathStart: () => {},
        onPathEnd: () => {},
        iterator: 1
    }, {
        set(target, key, value) {
            target[key] = value;
            if (key === 'secondPathRendered') {
                target.currentFloor = value ? 'second' : 'main';
            }
            return true;
        }
    });

    return {
        get: key => key ? state[key] : state,
        set: (key, value) => { state[key] = value; }
    };
})();