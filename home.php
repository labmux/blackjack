<?php
/**
 * Created by PhpStorm.
 * User: eliranassaraf
 * Date: 2019-02-13
 * Time: 12:24 PM
 */
session_start();
include 'classes.php';

$pdo = createPdo();
$user = $_SESSION['user_info'];
$username = $user[0];
$account_balance = $user[1];


    if (isset($_POST['play']))  {
        redirect("game.html");
    }
?>
