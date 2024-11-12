import { Config } from '../config/config.js';

export const SVGCreator = {
    createElement(type, attributes = {}, classList = []) {
        const element = document.createElementNS(Config.SVG.NAMESPACE, type);
        Object.entries(attributes).forEach(([key, value]) => {
            key.includes('.') 
                ? key.split('.').reduce((obj, prop, i, arr) => 
                    i === arr.length - 1 ? obj[prop].value = value : obj[prop], element)
                : element.setAttribute(key, value);
        });
        if (classList.length) element.classList.add(...classList);
        return element;
    }
};