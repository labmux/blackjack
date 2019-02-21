function fundsValidation() {
    let funds = document.forms["addFundsForm"]["amount"].value;

    if (funds < 1) {
        alert("Funds must be a positive number");
        return false;
    }
    else
        return true;

}

function validateForm() {
    if (usernameValidation() && passwordValidation())
        return true;
    else
        return false;
}

function usernameValidation() {
    let username = document.forms["loginForm"]["username"].value;

    if (username.length > 10 || username.length < 2) {
        alert("Username must be between 2 and 10 characters");
        return false;
    }
    else
        return true;
}

function newPasswordValidation() {
    let password = document.forms["changePasswordForm"]["newPassword"].value;

    if (password.length < 8) {
        alert("Password should be at least 8 characters long");
        return false;
    }
    else {
        var lower = false;
        var upper = false;
        var numbers = false;
        var special = false;

        for (let i =0;i < password.length;i++) {
            let character = password.charAt(i);

            if (isDigit(character)) {
                numbers = true;
                console.log("number");
            }
            else if (isLower(character)) {
                lower = true;
                console.log("lower");
            }
            else if (isUpper(character)) {
                upper = true;
                console.log("upper");
            }
            else  {
                special = true;
                console.log("special");
            }
        }

        //missing special
        if(lower == false || upper == false || numbers == false) {
            alert("Password must contain 1 lower and upper case letters, a number and a special character");
            return false;
        }
    }
    return true;
}

function passwordValidation() {
    let password = document.forms["loginForm"]["password"].value;

    if (password.length < 8) {
        alert("Password should be at least 8 characters long");
        return false;
    }
    else {
        var lower = false;
        var upper = false;
        var numbers = false;
        var special = false;

        for (let i =0;i < password.length;i++) {
            let character = password.charAt(i);

            if (isSpecial(character)) {
                special = true;
                console.log("special");
            }
            else if (isDigit(character)) {
                numbers = true;
                console.log("number");
            }
            else if (isLower(character)) {
                lower = true;
                console.log("lower");
            }
            else if (isUpper(character)) {
                upper = true;
                console.log("upper");
            }

        }

        //missing special
        if(lower == false || upper == false || numbers == false || special == false) {
            alert("Password must contain 1 lower and upper case letters, a number and a special character");
            return false;
        }
    }

    return true;
}
function isSpecial(num) {
    let format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (format.test(num))
        return true;
    else
        return false;
}
function isDigit(num) {
    return !isNaN(num);
}

function isLower(num) {
    return num === num.toLowerCase();
}

function isUpper(num) {
    return num === num.toUpperCase();
}