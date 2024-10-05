
// Usage
let adjMatrix = [];
fetchJSON('elements/AdjacencyMatrix.json').then(data => {
    adjMatrix=data; // Process your JSON data here
});
let vertices = [];
fetchJSON('elements/Vertices.json').then(data => {
    vertices=data; // Process your JSON data here
});

function markShortestPath(start,end){
    let path = aStar(adjMatrix,start,end);
    for (let i = 0; i < path.length - 1; i++) {
        colorLine(path[i],path[i+1]);
    }
}