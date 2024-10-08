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

function createLine(a,b,graph=document.querySelector("svg > g > g"),color="#01539C"){
    if(Number(b.mainText)>Number(a.mainText)){
        let temp = a;
        a = b;
        b = temp;
    }
	graph.insertAdjacentHTML("afterbegin",'<path xmlns="http://www.w3.org/2000/svg" fill="none" stroke="'+color+'" paint-order="fill stroke markers" d=" M '+a.position.x+' '+a.position.y+' L '+b.position.x+' '+b.position.y+'" stroke-miterlimit="10" stroke-width="4" id="'+a.mainText+' '+b.mainText+'"/>');
}

function selectPath(path) {
    for (let i = 0; i < path.length - 1; i++) {
        let aID = path[i];
        let bID = path[i + 1];

        if (bID > aID) [aID, bID] = [bID, aID];

        const element = document.getElementById(aID + ' ' + bID);
        element.classList.add("selected");

        if (i === 0) document.querySelector("svg > g > g").insertAdjacentHTML("beforeend",'<circle cx="'+element.x1.baseVal.value+'" cy="'+element.y1.baseVal.value+'" r="10" id="startpt"/>');
        else if (i === path.length - 2) document.querySelector("svg > g > g").insertAdjacentHTML("beforeend",'<circle cx="'+element.x2.baseVal.value+'" cy="'+element.y2.baseVal.value+'" r="10" id="endpt"/>');
    }
}

function deselectLine(aID,bID){
    if(bID>aID){
        let temp = aID;
        aID = bID;
        bID = temp;
    }
    document.getElementById(aID+' '+bID).classList.remove("selected");
}
function refresh(){
    let selected = document.getElementsByClassName("selected");
    if(selected.length){
        document.getElementById("startpt").remove();
        document.getElementById("endpt").remove();
    }
    for(let i=0;i<selected.length;i++){
        selected[i].classList.remove("selected");
        i--;
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
