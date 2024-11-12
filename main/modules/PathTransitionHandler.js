import { StateManager } from './StateManager.js';

export const PathTransitionHandler = {
    isTransitioning: false,

    handleTransition(path, sliderValue, totalDistance) {
        // Guard against recursive calls
        if (this.isTransitioning) return false;
        
        const pathLength = path.getTotalLength();
        const { get, set } = StateManager;
        
        try {
            this.isTransitioning = true;

            if (sliderValue >= pathLength && get('firstPathRendered')) {
                set('firstPathRendered', false);
                set('secondPathRendered', true);
                const onPathEnd = get('onPathEnd');
                if (onPathEnd) onPathEnd();
                return true;
            }
            
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