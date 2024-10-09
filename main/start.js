//Login Function
function checkLogin() {
     if(checkEmail() && checkIP() && checkPassword()){
        window.location.href = "index.html";
        console.log('redirected');
     };
};

//Function to validate Email
function checkEmail() {
    var email = document.getElementById("email").value;
    let source;
    let valid = false;
    for(let i =0; i < email.length; i++){
        if(email[i] === '@'){
            source = email.substring(i+1);
            console.log(source);
            valid = true;
            break;
        } 
     }
     source.toLowerCase();
    for(let j = 0; j < emails.length; j++) {
        if(source === emails[j]){
            console.log("HSE email");
            return true
        } 
    };
    console.log("Not HSE email");
    return false;
}


//Function to validate password
function checkPassword() {
    var password = document.getElementById("password").value;
    let valid = false;
    for(let i = 0; i < passwords.length; i++){
        if(password === passwords[i]){
            valid = true;
            break;
        }
    }
    return valid;
};


//Function to validate IP address
function checkIP() {
    if(ip === "209.160.198.202") {
        return true;
    }
    return false;
};


//Function connected to retry button which redirects to log.html if IP address is correct
function retry() {
  if(checkIP()){
    console.log('true redirect');
    window.location.href = "log.html";
  }
};

let emails = [];
fetchJSON('elements/ValidEmails.json').then(data => {
    emails = data;
});
let passwords = [];
fetchJSON('elements/ValidPasswords.json').then(data => {
  passwords = data;
});

let ip;
fetchJSON("https://api.ipify.org?format=json").then(data => {
    ip = data.ip;
});