<?php
session_start();

$user = $_SESSION['user_info'];

echo json_encode($user);