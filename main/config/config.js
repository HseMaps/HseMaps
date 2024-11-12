export const Config = {
    SVG: {
        NAMESPACE: 'http://www.w3.org/2000/svg',
        SELECTORS: {
            GRAPH: '#graph',
            SVGRAPH: '#svgraph',
            AGENT: '#agent',
            IMAGE: '#svgraph > g > image',
            PROGBAR: '#progbar',
            SCROLL: '#scroll'
        }
    },
    PATHS: {
        MAIN_FLOOR: 'elements/mainfloorcrunched.png',
        COMB_SCALED: 'elements/combscaled.png'
    },
    THRESHOLD: {
        FLOOR_CHANGE: 76,
        STAIR_DISTANCE: 10000
    },
    DEFAULTS: { MARGIN: 300 }
};