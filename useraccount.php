<?php
/**
 * Created by PhpStorm.
 * User: eliranassaraf
 * Date: 2019-02-20
 * Time: 11:03 AM
 */
session_start();
include 'classes.php';
$user = $_SESSION['user_info'];

if(isset($_POST['funds']) && isset($_POST['username'])) {
    $username = $_POST['username'];
    $funds = $_POST['funds'];
    $pdo = createPdo();

    echo $funds;
    addFunds($pdo,$username,$funds);
    redirect('game.html');
}
else
    echo "Error Occured";