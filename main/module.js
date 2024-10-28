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

function createLine(points,graph=document.querySelector("svg > g > g")){
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    path.setAttribute("points", points);
    path.classList.add('line');
    path.classList.add('gen');
	graph.insertAdjacentElement("beforeend", path);
    return path;
}


function selectPath(path,verts,graph=document.querySelector("svg > g > g")){ 
    let points = [];
    for (let i = 0; i < path.length; i++) {
        points.push(verts[path[i]].x + "," + verts[path[i]].y);
    }
    let line = createLine(points,graph);

    // Create a mask for the selected path
    let maskLine = createLine(points,document.querySelector("svg > g > g > mask"));
    maskLine.classList.add("maskedselected");
    graph.insertAdjacentElement("beforeend", mask);

    line.classList.add("selected");
    const startpt = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    startpt.cx.baseVal.value = verts[path[0]].x;
    startpt.cy.baseVal.value = verts[path[0]].y;
    startpt.r.baseVal.value = '10';
    startpt.classList.add('gen');
    startpt.id = 'startpt';
    graph.insertAdjacentElement("beforeend", startpt);

    const endpt = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    endpt.cx.baseVal.value = verts[path[path.length-1]].x;
    endpt.cy.baseVal.value = verts[path[path.length-1]].y;
    endpt.r.baseVal.value = '10';
    endpt.classList.add('gen');
    endpt.id = 'endpt';
    graph.insertAdjacentElement("beforeend", endpt);
}

function refresh(){
    let selected = document.getElementsByClassName("gen");
    for(let i=0;i<selected.length;i++){
        selected[i].remove();
        i--;
    }
}

function focus(element,margin=5,svg=document.querySelector("#svgdiv > svg")){
    let map = svg.viewBox.baseVal;
    let focus = element.getBBox();
    map.x = 1308 - focus.y - focus.height - margin/2;
    map.y = focus.x - margin/2;
    map.width = focus.height + margin;
    map.height = focus.width + margin;
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
