import { Config } from '../config/config.js';
import { SVGCreator } from './SVGCreator.js';
import { StateManager } from './StateManager.js';
import { UtilityModule } from './UtilityModule.js';

export const RenderingModule = {
    createLine(points, graph = document.querySelector("svg > g > g > g")) {
        const path = SVGCreator.createElement('polyline', {
            points,
            class: 'line gen'
        });
        graph.insertAdjacentElement("beforeend", path);
        return path;
    },

    selectPath(path, verts, start = "startpt", end = "endpt", graph = document.getElementById("graph")) {
        const image = document.querySelector(Config.SVG.SELECTORS.IMAGE);
        image.href.baseVal = path[0] > Config.THRESHOLD.FLOOR_CHANGE 
            ? Config.PATHS.COMB_SCALED 
            : Config.PATHS.MAIN_FLOOR;

        const points = path.map(p => `${verts[p].x},${verts[p].y}`).join(' ');
        const line = this.createLine(points, graph);
        line.classList.add("selected");

        const startPoint = SVGCreator.createElement('circle', {
            'cx.baseVal': verts[path[0]].x,
            'cy.baseVal': verts[path[0]].y,
            'r.baseVal': 10,
            id: start
        }, ['gen']);

        const agent = startPoint.cloneNode(true);
        agent.id = 'agent';

        const endPoint = SVGCreator.createElement('circle', {
            'cx.baseVal': verts[path[path.length - 1]].x,
            'cy.baseVal': verts[path[path.length - 1]].y,
            'r.baseVal': 10,
            id: end
        }, ['gen']);

        [startPoint, agent, endPoint].forEach(el => 
            graph.insertAdjacentElement("beforeend", el));

        UtilityModule.updateAgent();
        return line;
    },

    focus(element, margin = 5, svg = document.getElementById("svg")) {
        const map = svg.viewBox.baseVal;
        const focus = element.getBBox();
        map.x = focus.x - margin / 2;
        map.y = focus.y - margin / 2;
        map.width = focus.width + margin;
        map.height = focus.height + margin;
    },

    refresh() {
        const selected = document.getElementsByClassName("gen");
        Array.from(selected).forEach(el => el.remove());
        StateManager.set('skipStart', () => true);
        StateManager.set('skipEnd', () => false);
    }
};