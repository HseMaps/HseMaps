export const PathfindingModule = {
    constructPath(nextMatrix, u, v) {
        if (!nextMatrix[u]?.[v]) return [];
        const path = [u];
        while (path[path.length - 1] !== v) {
            const next = nextMatrix[path[path.length - 1]][v];
            if (!next && next !== 0) break;
            path.push(next);
        }
        return path;
    },

    selectBestNode(nodes, goalNodes, distMatrix) {
        return nodes.reduce((best, node) => {
            const minDist = Math.min(...goalNodes.map(goal => 
                distMatrix[node]?.[goal] ?? Infinity
            ));
            return minDist < best.dist ? { node, dist: minDist } : best;
        }, { node: null, dist: Infinity }).node;
    },

    minPathBtwRooms(nextMatrix, distMatrix, startRoom, endRoom, rooms) {
        const startNode = this.selectBestNode(rooms[startRoom], rooms[endRoom], distMatrix);
        const endNode = this.selectBestNode(rooms[endRoom], [startNode], distMatrix);
        return this.constructPath(nextMatrix, startNode, endNode);
    }
};