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