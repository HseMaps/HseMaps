function checkEmail() {
    var email = document.getElementById("email").value;
    let source;
    let valid = false;
    for(let i =0; i < email.length; i++){
        if(email[i] === '@'){
            source = email.substring(i+1);
            console.log(source);
            valid = true;
            emailValid(source);
            break;
        } 
     }
     console.log(valid);
};
function emailValid(email) {
    email.toLowerCase();
    if(email === "hsestudents.org" || email === "hse.k12.in.us") {
        console.log("HSE email");
        setTimeout(function(){
            fetch("https://api.ipify.org?format=json")
            .then(response => response.json()) 
            .then(data => {
              console.log(data.ip);
              if(data.ip === '209.160.198.202') {
                window.location.href = "index.html";
                console.log("Access Granted");
              }else{
                window.location.href = "error.html";
                console.log("Access Denied");
              }
            });

          }, 500);
    } else {
        console.log("Not HSE email");
    }
};