this.onPathEnd = function(){};
this.onPathStart = function(){};

function constructPath(nextMatrix,u, v) {
    if (nextMatrix[u][v] == null) return [];
    const path = [];
    let current = u;
    while (current != v) {
      path.push(current);
      current = nextMatrix[current][v];
    }
    path.push(v);
    return path;
  }

// Function to find the optimal node based on the actual distances
function selectBestNode(nodes, goalNodes, distMatrix) {
    let bestNode = null;
    let bestDistance = Infinity;

    nodes.forEach(node => {
        goalNodes.forEach(goal => {
            let distance = distMatrix[node][goal];
            if (distance < bestDistance) {
                bestDistance = distance;
                bestNode = node;
            }
        });
    });

    return bestNode;
}

// Function to find the shortest path between two classrooms
function minPathBtwRooms(nextMatrix, distMatrix, startRoom, endRoom, rooms) {
    let startNodes = rooms[startRoom];
    let endNodes = rooms[endRoom];

    let bestStartNode = selectBestNode(startNodes, endNodes, distMatrix);
    let bestEndNode = selectBestNode(endNodes, [bestStartNode], distMatrix);

    return constructPath(nextMatrix, bestStartNode, bestEndNode);
}

function createLine(points,graph=document.querySelector("svg > g > g > g")){
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    path.setAttribute("points", points);
    path.classList.add('line');
    path.classList.add('gen');
	graph.insertAdjacentElement("beforeend", path);
    return path;
}


function selectPath(path,verts,start="startpt",end="endpt",graph=document.getElementById("graph")){ 
    let points = [];
    for (let i = 0; i < path.length; i++) {
        points.push(verts[path[i]].x + "," + verts[path[i]].y);
    }
    let line = createLine(points,graph);

    // Create a mask for the selected path
    let maskLine = createLine(points,document.querySelector("svg > g > g > g > mask"));
    maskLine.classList.add("maskedselected");
    graph.insertAdjacentElement("beforeend", mask);

    line.classList.add("selected");
    const startpt = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    startpt.cx.baseVal.value = verts[path[0]].x;
    startpt.cy.baseVal.value = verts[path[0]].y;
    startpt.r.baseVal.value = '10';
    startpt.classList.add('gen');
    const agent = startpt.cloneNode(true);
    startpt.id = start;
    agent.id='agent';
    graph.insertAdjacentElement("beforeend", startpt);
    graph.insertAdjacentElement("beforeend", agent);

    const endpt = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    endpt.cx.baseVal.value = verts[path[path.length-1]].x;
    endpt.cy.baseVal.value = verts[path[path.length-1]].y;
    endpt.r.baseVal.value = '10';
    endpt.classList.add('gen');
    endpt.id = end;
    graph.insertAdjacentElement("beforeend", endpt);
    updateAgent(true);
    return line;
}

function refresh(){
    let selected = document.getElementsByClassName("gen");
    for(let i=0;i<selected.length;i++){
        selected[i].remove();
        i--;
    }
    skipStart = function(){return true;};
skipEnd = function(){return false;};
}

function focus(element,margin=5,svg=document.getElementById("svg")){
    let map = svg.viewBox.baseVal;
    let focus = element.getBBox();
    map.x = focus.x - margin/2;
    map.y = focus.y - margin/2;
    map.width = focus.width + margin;
    map.height = focus.height + margin;
}

let firstPathRendered = true;
let secondPathRendered = false;

function updateAgent(follow=false,margin=300){
    let agent = document.getElementById("agent");
    let path = document.querySelector("#graph > polyline");
    let dist = slider.value;
    if(agent){
    let slider = document.getElementById("progbar");
    let slidercompletion = slider.value/slider.max;
    if(secondPathRendered){
        dist=-(totalDistance-slider.value-path.getTotalLength());
    }
    let svg = document.getElementById("svgraph");
    let point = path.getPointAtLength(dist);
    agent.cx.baseVal.value = point.x;
    agent.cy.baseVal.value = point.y;
    if(slidercompletion==1){
        return;
    }
    let nxtpt = path.getPointAtLength(Number(dist)+10);
    this.nptt = nxtpt;
    if(follow){
        focus(agent,margin);
    }
    let orientation= 270-(Math.atan2(nxtpt.y-point.y,nxtpt.x-point.x)*180/Math.PI);
    svg.setAttribute("style","transform-origin: "+point.x+"px "+point.y+"px; "+"transform: rotate("+orientation+"deg)");

    // Adjust the color of the agent based on the progress
    let color = [255, 0, 0];
    if(color[1] < 255) {
        color[1] = Math.floor(slidercompletion*510);
    }
    if(color[1] >= 250 && color[0] >= 0) {
        color[1] = 255;
        color[0] = 255 - Math.floor((slidercompletion-0.5)*510);
    }
    if(slidercompletion >= 0.99) {
        color = [0, 255, 0];
    }
    agent.style.fill = "rgb("+color[0]+","+color[1]+","+color[2]+")";
    if(slider.value>=path.getTotalLength() && firstPathRendered) {
        this.onPathEnd();
        firstPathRendered = false;
        secondPathRendered = true;
        return;
    }
    else if(slider.value<=totalDistance-path.getTotalLength() && secondPathRendered) {
        this.onPathStart();
        firstPathRendered = true;
        secondPathRendered = false;
        return;
    }
    
}
}

async function fetchJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}
