// Description: This file contains the IP-Grabber function and any 
// functions relating to Determining the IP of the user

let userIP;
let allowed = false;

document.addEventListener("DOMContentLoaded", function() {
    // Fetch the IP address from the API
    fetch("https://api.ipify.org?format=json")
         .then(response => response.json())
         .then(data => {
             // Display the IP address on the screen
             userIP = data.ip;
             // document.getElementById("ip-address").textContent = data.ip;
             document.getElementById("current-ip").textContent = userIP;
             console.log(userIP);
             if(userIP === '209.160.198.202') {
               allowed = true;
             } else {
               allowed = false;
             }
            document.getElementById("approved").textContent = allowed;

        })
         .catch(error => {
             console.error("Error fetching IP address:", error);
         });
         //HSE IP: 209.160.198.202
         console.log(userIP);
         console.log(allowed);
 });

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