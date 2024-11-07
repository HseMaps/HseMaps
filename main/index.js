let scroll = document.getElementById("scroll");
scroll.onscroll=function(){
    let slider = document.getElementById("progbar");
    slider.value=(scroll.scrollTop/(scroll.scrollHeight-scroll.clientHeight))*slider.max;
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
    if(path[0]>76){
        document.querySelector("#svgraph > g > image").href.baseVal="elements/combscaled.png";
    }
    for(let i = 1; i < path.length; i++){
        if (distMatrix[path[i-1]][path[i]]>=10000) {
            let slider = document.getElementById("progbar");
            let scroll = document.getElementById("scroll");
            onPathStart=function(){
                if(!skipStart()){
                    refresh();
                    flipImg();
                skipEnd=function(){return false};
                skipStart=function(){return true};
                configureScroll(selectPath(path.slice(0,i),verts,undefined,"stairwell"),true);
                slider.value=slider.max-2;
                scroll.scrollTo(0,scroll.scrollHeight);
                scroll.scrollBy(0,-2);
                }
                
            };
            onPathEnd=function(){
                if(!skipEnd()){
                    refresh();
                    flipImg();
                skipStart=function(){return false};
                skipEnd=function(){return true};
                slider.value=1;
                scroll.scrollTo(0,1);
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
    let slider = document.getElementById("progbar");
    scroll.style.height = size+"px";
    scroll.style.width = size+"px";
    slider.max = Number(path.getTotalLength()+size-1).toFixed(0);
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