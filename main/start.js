function checkEmail() {
    console.log(emails);
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
     if(emailValid(source) && checkIP()){
        window.location.href = "index.html";
        console.log('redirected');
     };
     console.log(valid);
};
function emailValid(email) {
    email.toLowerCase();
    for(let j = 0; j < emails.length; j++) {
        if(email === emails[j]){
            console.log("HSE email");
            return true
            break;
        } 
    };
    console.log("Not HSE email");
    return false;
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
function checkIP() {
    if(ip === "209.160.198.202") {
        return true;
    }
    return false;
};
function retry() {
  if(checkIP()){
    console.log('true redirect');
    window.location.href = "log.html";
  }
};
