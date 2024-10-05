// Define a MinHeap class to efficiently handle priority queues
class MinHeap {
    constructor() {
        // Initialize an empty heap
        this.heap = [];
    }

    // Check if the heap is empty
    isEmpty() {
        return this.heap.length === 0;
    }

    // Push a new element into the heap with a given priority
    push(element, priority) {
        this.heap.push({element, priority});
        this._bubbleUp(); // Ensure the heap property is maintained
    }

    // Remove and return the element with the highest priority (smallest value)
    pop() {
        if (this.isEmpty()) {
            return null;
        }
        const root = this.heap[0];
        const end = this.heap.pop(); // Remove the last element
        if (!this.isEmpty()) {
            this.heap[0] = end;
            this._sinkDown(0); // Restore the heap property
        }
        return root.element;
    }

    // Move the last added element up to maintain the heap property
    _bubbleUp() {
        let idx = this.heap.length - 1;
        const element = this.heap[idx];
        while (idx > 0) {
            let parentIdx = Math.floor((idx - 1) / 2); // Find the parent index
            let parent = this.heap[parentIdx];
            if (element.priority >= parent.priority) break;
            // Swap the element with its parent
            this.heap[parentIdx] = element;
            this.heap[idx] = parent;
            idx = parentIdx;
        }
    }

    // Move the element at idx down to maintain the heap property
    _sinkDown(idx) {
        const length = this.heap.length;
        const element = this.heap[idx];
        while (true) {
            let leftChildIdx = 2 * idx + 1;
            let rightChildIdx = 2 * idx + 2;
            let leftChild, rightChild;
            let swap = null;

            // Check if the left child is smaller
            if (leftChildIdx < length) {
                leftChild = this.heap[leftChildIdx];
                if (leftChild.priority < element.priority) {
                    swap = leftChildIdx;
                }
            }

            // Check if the right child is smaller
            if (rightChildIdx < length) {
                rightChild = this.heap[rightChildIdx];
                if (
                    (swap === null && rightChild.priority < element.priority) ||
                    (swap !== null && rightChild.priority < leftChild.priority)
                ) {
                    swap = rightChildIdx;
                }
            }

            // If no swap needed, break the loop
            if (swap === null) break;
            // Swap the element with the smaller child
            this.heap[idx] = this.heap[swap];
            this.heap[swap] = element;
            idx = swap;
        }
    }
}

// A* algorithm implementation
function aStar(adjMatrix, start, goal) {
    // Initialize priority queue with a min-heap
    let openSet = new MinHeap();
    // Track the most efficient previous step
    let cameFrom = {};
    // Cost from start to this node
    let gScore = Array(adjMatrix.length).fill(Infinity);
    // Estimated total cost from start to goal through this node
    let fScore = Array(adjMatrix.length).fill(Infinity);

    gScore[start] = 0;
    fScore[start] = heuristic(start, goal, adjMatrix);

    // Add start node to the priority queue
    openSet.push(start, fScore[start]);

    while (!openSet.isEmpty()) {
        // Remove the node with the smallest fScore
        let current = openSet.pop();

        // If goal is reached, reconstruct and return the path
        if (current === goal) {
            return reconstructPath(cameFrom, current);
        }

        // Iterate over each neighbor of the current node
        for (let neighbor = 0; neighbor < adjMatrix[current].length; neighbor++) {
            // Check if there is a connection
            if (adjMatrix[current][neighbor] !== 0) {
                // Calculate tentative gScore
                let tentative_gScore = gScore[current] + adjMatrix[current][neighbor];
                // If this path is better, record it
                if (tentative_gScore < gScore[neighbor]) {
                    cameFrom[neighbor] = current;
                    gScore[neighbor] = tentative_gScore;
                    fScore[neighbor] = gScore[neighbor] + heuristic(neighbor, goal, adjMatrix);

                    // Add neighbor to the queue if it's not already there
                    if (!openSet.heap.some(e => e.element === neighbor)) {
                        openSet.push(neighbor, fScore[neighbor]);
                    }
                }
            }
        }
    }
    // Return empty path if no path is found
    return [];
}

// Simple heuristic function: here, just returns direct distance from node to goal
function heuristic(node, goal, adjMatrix) {
    return adjMatrix[node][goal];
}

// Reconstruct path from start to goal by following cameFrom map
function reconstructPath(cameFrom, current) {
    let path = [current];
    while (current in cameFrom) {
        current = cameFrom[current];
        path.push(current);
    }
    return path.reverse(); // Return the path from start to goal
}

// I LOVE AI
// AI MY BELOVED

function createLine(a,b,graph=document.querySelector("svg > g > g"),color="#01539C"){
    if(Number(b.mainText)>Number(a.mainText)){
        let temp = a;
        a = b;
        b = temp;
    }
	graph.insertAdjacentHTML("afterbegin",'<path xmlns="http://www.w3.org/2000/svg" fill="none" stroke="'+color+'" paint-order="fill stroke markers" d=" M '+a.position.x+' '+a.position.y+' L '+b.position.x+' '+b.position.y+'" stroke-miterlimit="10" stroke-width="4" id="'+a.mainText+' '+b.mainText+'"/>');
}

function colorLine(aID,bID,color="#F0D543"){
    if(bID>aID){
        let temp = aID;
        aID = bID;
        bID = temp;
    }
    document.getElementById(aID+' '+bID).setAttribute("stroke",color);
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
