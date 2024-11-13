import { DataModule } from './DataModule.js';
import { DOMCache } from './DOMCache.js';
import { Config } from '../config/config.js';``

        Object.assign(window, {
            fetchJSON: DataModule.fetchJSON
        });


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

// StartModule - Manages login validation and redirection
export const StartModule = {
 //Login Function
checkLogin() {
     if(checkEmail() && checkIP() && checkPassword()){
        window.location.href = "index.html";
        console.log('redirected');
     };
},

//Function to validate Email
checkEmail() {

    var email = DOMCache[Config.LOG.SELECTORS.EMAIL].value;
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
},


//Function to validate password
checkPassword() {
    var password = DOMCache[Config.LOG.SELECTORS.PASSWORD].value;
    let valid = false;
    for(let i = 0; i < passwords.length; i++){
        if(password === passwords[i]){
            valid = true;
            break;
        }
    }
    return valid;
},


//Function to validate IP address
checkIP() {
    if(ip === "209.160.198.202") {
        return true;
    }
    return false;
}


};