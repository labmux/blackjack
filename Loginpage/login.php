<?php
session_start();
include '../classes.php';

if($_SERVER["REQUEST_METHOD"] == "POST") {
    $pdo = createPdo();

    if (!empty($_POST['username']) && !empty($_POST['password'])) {
        $username = $_POST['username'];
        $password = $_POST['password'];
    }

    if(isset($_POST['signin'])) {
        if (!userExists($pdo,$username)) {
            throwAlert("Username doesnt exist.");
            redirect("../index.html");
        }
        else {
            if(checkLogin($pdo,$username,$password)) {
                saveUserInfo($pdo,$username);
                redirect("../home.html");
            }
            else {
                throwAlert("Username and password do not match");
                redirect("../index.html");
            }
        }
    }
    else if(isset($_POST['signup'])) {
        echo "SignUp";
        if(userExists($pdo,$username)) {
            throwAlert("Username already exists. Please chose a different name");
            redirect("../index.html");
        }
        else {
            createUser($pdo,$username,$password);
            saveUserInfo($pdo,$username);
            throwAlert("User succesfully created");
            redirect("../home.html");
        }
    }
    else if(isset($_POST['changePassword'])) {
        $newpassword = $_POST["newPassword"];
        $oldpassword = $_POST["oldPassword"];

        if (getPassword($pdo,$username) == $oldpassword) {
            changePassword($pdo,$username,$newpassword);
            throwAlert("Password changed succesfully");
        }
        else
            throwAlert("Password username dont match");

        redirect("../index.html");

    }
}
?>
