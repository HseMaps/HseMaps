
let distMatrix = [];
fetchJSON('elements/DistanceMatrix.json').then(data => {
    distMatrix=data;
});
let nextMatrix = [];
fetchJSON('elements/PrecomputedPaths.json').then(data => {
    nextMatrix=data;
});
let rooms = [];
fetchJSON('elements/SLAVEWORK.json').then(data => {
    rooms=flipKeyValuePairWithMultiNodes(data);
});
let verts = [];
fetchJSON('elements/Vertices.json').then(data => {
    verts=data;
});

function markShortestPath(start,end){
    refresh();
    let path = minPathBtwRooms(nextMatrix,distMatrix,start,end,rooms);
    selectPath(path,verts,document.querySelector("#graph"));
}
function markShortestPathFromInput(zoom=false){
    let start = document.getElementById("start").value;
    let end = document.getElementById("end").value;
    start = start.toUpperCase();
    end = end.toUpperCase();
    markShortestPath(start,end);
    if(zoom){
        let element = document.getElementById("agent");
        focus(element,300);
    }
}