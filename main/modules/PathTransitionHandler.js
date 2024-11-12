/**
 * PathTransitionHandler - Manages transitions between floor levels
 * Handles state changes during path traversal and prevents recursive updates
 * 
 * @module PathTransitionHandler
 */
import { StateManager } from './StateManager.js';

export const PathTransitionHandler = {
    /** Flag to prevent recursive transition handling */
    isTransitioning: false,

    /**
     * Handles state transitions during path traversal
     * Manages transitions between floors and triggers appropriate callbacks
     * 
     * @param {SVGGeometryElement} path - SVG path element being traversed
     * @param {number} sliderValue - Current position along the path (0 to pathLength)
     * @param {number} totalDistance - Total path distance including both floors
     * @returns {boolean} True if transition occurred, false otherwise
     * 
     * @example First floor to second floor
     * // Given:
     * path.getTotalLength() = 100
     * sliderValue = 100          // At end of first floor
     * totalDistance = 200
     * StateManager.get('firstPathRendered') = true
     * 
     * handleTransition(path, 100, 200)
     * // Results in:
     * // - firstPathRendered = false
     * // - secondPathRendered = true
     * // - onPathEnd() called
     * // Returns: true
     * 
     * @example Second floor to first floor
     * // Given:
     * path.getTotalLength() = 100
     * sliderValue = 0           // At start of second floor
     * totalDistance = 200
     * StateManager.get('secondPathRendered') = true
     * 
     * handleTransition(path, 0, 200)
     * // Results in:
     * // - firstPathRendered = true
     * // - secondPathRendered = false
     * // - onPathStart() called
     * // Returns: true
     * 
     * @example No transition needed
     * // Given:
     * sliderValue = 50         // Middle of current floor
     * 
     * handleTransition(path, 50, 200)
     * // Returns: false (no state change)
     */
    handleTransition(path, sliderValue, totalDistance) {
        // Guard against recursive calls during state updates
        if (this.isTransitioning) return false;
        
        const pathLength = path.getTotalLength();
        const { get, set } = StateManager;
        
        try {
            this.isTransitioning = true;

            // Check for transition to second floor
            if (sliderValue >= pathLength && get('firstPathRendered')) {
                set('firstPathRendered', false);
                set('secondPathRendered', true);
                const onPathEnd = get('onPathEnd');
                if (onPathEnd) onPathEnd();
                return true;
            }
            
            // Check for transition back to first floor
            if (sliderValue <= totalDistance - pathLength && get('secondPathRendered')) {
                set('firstPathRendered', true);
                set('secondPathRendered', false);
                const onPathStart = get('onPathStart');
                if (onPathStart) onPathStart();
                return true;
            }
            
            return false;
        } finally {
            this.isTransitioning = false;
        }
    }
};