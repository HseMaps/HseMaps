// let userIP;
// let allowed = false;

// document.addEventListener("DOMContentLoaded", function() {
//     // Fetch the IP address from the API
//     fetch("https://api.ipify.org?format=json")
//          .then(response => response.json())
//          .then(data => {
//              // Display the IP address on the screen
//              userIP = data.ip;
//              // document.getElementById("ip-address").textContent = data.ip;
//              document.getElementById("current-ip").textContent = userIP;
//              console.log(userIP);
//              if(userIP === '209.160.198.202') {
//                allowed = true;
//              } else {
//                allowed = false;
//              }
//             document.getElementById("approved").textContent = allowed;

//         })
//          .catch(error => {
//              console.error("Error fetching IP address:", error);
//          });
//          //HSE IP: 209.160.198.202
//          console.log(userIP);
//          console.log(allowed);
//  });


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

function markShortestPath(start,end){
    refresh();
    let path = minPathBtwRooms(nextMatrix,distMatrix,start,end,rooms);
    selectPath(path);  
}
function markShortestPathFromInput(){
    let start = document.getElementById("start").value;
    let end = document.getElementById("end").value;
    start = start.toUpperCase();
    end = end.toUpperCase();
    markShortestPath(start,end);
}