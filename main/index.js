let scroll = document.getElementById("scroll");
scroll.onscroll=function(){
    let slider = document.getElementById("progbar");
    slider.value=(scroll.scrollTop/(scroll.scrollHeight-scroll.clientHeight))*slider.max;
    slider.oninput();
}


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
    return selectPath(path,verts,document.querySelector("#graph"));
}
function markShortestPathFromInput(zoom=false){
    let start = document.getElementById("start").value;
    let end = document.getElementById("end").value;
    start = start.toUpperCase();
    end = end.toUpperCase();
    let path = markShortestPath(start,end);
    if(zoom){
        let element = document.getElementById("agent");
        focus(element,300);
    }
    let scroll = document.getElementById("scroll");
    let size = document.getElementById("svg").width.baseVal.value;
    scroll.style.height = size+"px";
    scroll.style.width = size+"px";
    scroll.children[0].style.height = path.getTotalLength()+size+"px";
    document.getElementById("progbar").max = path.getTotalLength()+size;
}