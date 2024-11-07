let scroll = document.getElementById("scroll");
let slider = document.getElementById("progbar");

let totalDistance;

scroll.onscroll = function() {
    updateSliderValue();
};

function updateSliderValue() {
    let slider = document.getElementById("progbar");
    slider.value = (scroll.scrollTop / (scroll.scrollHeight - scroll.clientHeight)) * slider.max;
    slider.oninput();
}

this.skipStart = function(){return true;};
this.skipEnd = function(){return false;};
let iterator = 1;


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
    onPathEnd=function(){};
    onPathStart=function(){};
    document.querySelector("#svgraph > g > image").href.baseVal="elements/mainfloorcrunched.png";
    let path = minPathBtwRooms(nextMatrix,distMatrix,start,end,rooms);
    totalDistance = distMatrix[path[0]][path[path.length-1]];
    if(path[0]>76){
        document.querySelector("#svgraph > g > image").href.baseVal="elements/combscaled.png";
    }
    for(let i = 1; i < path.length; i++){
        if (distMatrix[path[i-1]][path[i]]>=10000) {
            totalDistance-=distMatrix[path[i-1]][path[i]];
            let slider = document.getElementById("progbar");
            let scroll = document.getElementById("scroll");
            onPathStart=function(){
                if(!skipStart()){
                    refresh();
                    flipImg();
                skipEnd=function(){return false};
                skipStart=function(){return true};
                configureScroll(selectPath(path.slice(0,i),verts,undefined,"stairwell"),true);
                }
                
            };
            onPathEnd=function(){
                if(!skipEnd()){
                    refresh();
                    flipImg();
                skipStart=function(){return false};
                skipEnd=function(){return true};
                configureScroll(selectPath(path.slice(i),verts,"stairwell"),true);
                }
                
            };
            return selectPath(path.slice(0,i),verts,undefined,"stairwell");
    }
}
    return selectPath(path,verts);
}
function flipImg(){
    let img = document.querySelector("#svgraph > g > image");
    if(img.href.baseVal=="elements/mainfloorcrunched.png"){
        img.href.baseVal="elements/combscaled.png";
    }
    else{
        img.href.baseVal="elements/mainfloorcrunched.png";
    }
}
function markShortestPathFromInput(zoom=false){
    refresh();
    slider.value=0;
    scroll.scrollTop=0;
    let start = document.getElementById("start").value;
    let end = document.getElementById("end").value;
    start = start.toUpperCase();
    end = end.toUpperCase();
    let path = markShortestPath(start,end);
    configureScroll(path,zoom);
}
function configureScroll(path,zoom){
    if(zoom){
        let element = document.getElementById("agent");
        focus(element,300);
    }
    let scroll = document.getElementById("scroll");
    let size = document.getElementById("svg").width.baseVal.value;
    size=size.toFixed(0);
    let slider = document.getElementById("progbar");
    slider.max = totalDistance.toFixed(0);
    scroll.children[0].style.height = slider.max+"px";
}
function navSchedule(){
let sched = document.getElementById("sched");
let classes = sched.value.split(",");
let from = classes[iterator-1];
let to = classes[iterator];
document.getElementById("start").value = from;
document.getElementById("end").value = to;
markShortestPathFromInput(true);
if(iterator<classes.length-1){
    iterator++;
}
else{
    iterator=1;
}
}