import { Config } from '../config/config.js';
import { StateManager } from './StateManager.js';
import { DOMCache } from './DOMCache.js';
import { ColorModule } from './ColorModule.js';
import { PathTransitionHandler } from './PathTransitionHandler.js';
import { RenderingModule } from './RenderingModule.js';
import { DataModule } from './DataModule.js';
import { PathfindingModule } from './PathfindingModule.js';

export const UtilityModule = {
    updateAgent(margin = Config.DEFAULTS.MARGIN) {
        const elements = {
            agent: DOMCache[Config.SVG.SELECTORS.AGENT],
            path: DOMCache[`${Config.SVG.SELECTORS.GRAPH} > polyline`],
            progbar: DOMCache[Config.SVG.SELECTORS.PROGBAR],
            svg: DOMCache[Config.SVG.SELECTORS.SVGRAPH]
        };

        if (!Object.values(elements).every(el => el?.isConnected)) return;

        try {
            const { agent, path, progbar, svg } = elements;
            const sliderValue = progbar.value;
            const sliderCompletion = sliderValue / progbar.max;
            
            const dist = StateManager.get('secondPathRendered')
                ? -(StateManager.get('totalDistance') - sliderValue - path.getTotalLength())
                : sliderValue;

            const point = path.getPointAtLength(dist);
            const nextPoint = path.getPointAtLength(Number(dist) + 10);
            
            this.updateAgentPosition(agent, point, nextPoint, svg, margin);
            agent.style.fill = ColorModule.getColor(sliderCompletion);
            
            PathTransitionHandler.handleTransition(path, sliderValue, StateManager.get('totalDistance'));
        } catch (error) {
            console.error('Agent update failed:', error);
        }
    },

    updateAgentPosition(agent, point, nextPoint, svg, margin) {
        agent.cx.baseVal.value = point.x;
        agent.cy.baseVal.value = point.y;
        RenderingModule.focus(agent, margin);
        
        const orientation = 270 - (Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * 180 / Math.PI);
        svg.setAttribute("style", `transform-origin: ${point.x}px ${point.y}px; transform: rotate(${orientation}deg)`);
    },

    markShortestPath(start, end) {
        RenderingModule.refresh();
        StateManager.set('onPathEnd', () => {});
        StateManager.set('onPathStart', () => {});
        
        const { nextMatrix, distMatrix, rooms, verts } = DataModule.get();
        const path = PathfindingModule.minPathBtwRooms(nextMatrix, distMatrix, start, end, rooms);
        StateManager.set('totalDistance', distMatrix[path[0]][path[path.length - 1]]);
        
        for (let i = 1; i < path.length; i++) {
            if (distMatrix[path[i - 1]][path[i]] >= Config.THRESHOLD.STAIR_DISTANCE) {
                this.handleStairTransition(path, i, distMatrix, verts);
                return RenderingModule.selectPath(path.slice(0, i), verts, undefined, "stairwell");
            }
        }
        return RenderingModule.selectPath(path, verts);
    },

    handleStairTransition(path, index, distMatrix, verts) {
        StateManager.set('totalDistance', 
            StateManager.get('totalDistance') - distMatrix[path[index - 1]][path[index]]
        );
        
        StateManager.set('onPathStart', () => {
            if (!StateManager.get('skipStart')()) {
                RenderingModule.refresh();
                StateManager.set('skipEnd', () => false);
                StateManager.set('skipStart', () => true);
                RenderingModule.selectPath(
                    path.slice(0, index), 
                    verts, 
                    undefined, 
                    "stairwell"
                );
                this.configureScroll();
            }
        });

        StateManager.set('onPathEnd', () => {
            if (!StateManager.get('skipEnd')()) {
                RenderingModule.refresh();
                StateManager.set('skipStart', () => false);
                StateManager.set('skipEnd', () => true);
                RenderingModule.selectPath(
                    path.slice(index), 
                    verts, 
                    "stairwell"
                );
                this.configureScroll();
            }
        });
    },

    configureScroll() {
        const element = DOMCache[Config.SVG.SELECTORS.AGENT];
        if (!element) return;
        
        RenderingModule.focus(element, Config.DEFAULTS.MARGIN);
        const scroll = DOMCache[Config.SVG.SELECTORS.SCROLL];
        const slider = DOMCache[Config.SVG.SELECTORS.PROGBAR];
        
        slider.max = StateManager.get('totalDistance');
        scroll.children[0].style.height = `${slider.max}px`;
    }
};