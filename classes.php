<?php
/**
 * Created by PhpStorm.
 * User: eliranassaraf
 * Date: 2019-02-18
 * Time: 5:59 PM
 */

function getPassword($pdo,$username) {
    try{
        $stmt = $pdo->prepare("SELECT password FROM player WHERE username = ?");
        $stmt->execute([$username]);

        $arr = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $arr[0]['password'];
    }
    catch (PDOException $e) {
        echo "Error Login failed";
        echo $e;
    }
    catch (Exception $e) {
        echo "Error: Login Failed";
        echo $e;
    }
}

function createUser($pdo,$username,$password) {
    try {
        $stmt = $pdo->prepare('INSERT INTO player (username,password,account_balance) VALUES(?, ?, ?)');
        $stmt->execute([$username,$password,100]);
    }
    catch (PDOException $e) {
        echo "Error writing to database";
        echo $e;
    }
    catch (Exception $e) {
        echo "Error: Sign up Failed";
        echo $e;
    }
}

function addFunds($pdo,$username,$amount) {
    try {
        $stmt = $pdo->prepare("UPDATE player SET account_balance = account_balance + ? WHERE username = ?");
        $stmt->execute([$amount,$username]);
        saveUserInfo($pdo,$username);
        throwAlert("Funds added succesfully");
    }
    catch (PDOException $e) {
        echo $e->getMessage();
    }
    catch (Exception $e) {
        echo $e->getMessage();
    }
}

function changePassword($pdo, $username, $password) {
    try {
        $stmt = $pdo->prepare("UPDATE player SET password = ? WHERE username= ?");
        $stmt->execute([$password, $username]);
    }
    catch (PDOException $e) {
        echo $e;
    }
    catch (Exception $e) {
        echo $e;
    }
}

function saveUserInfo($pdo, $username) {
    try {
        $stmt = $pdo->prepare("SELECT * FROM player WHERE username = ?");
        $stmt->execute([$username]);
        $arr = $stmt->fetchAll(PDO::FETCH_ASSOC);

        //user
        $_SESSION['username'] = $username = $_POST["username"];
        $_SESSION['account_balance'] = $account_balance = $arr[0]['account_balance'];

        //stats
        $_SESSION['wins'] = $wins = $arr[0]['wins'];
        $_SESSION['losses'] = $losses = $arr[0]['losses'];
        $_SESSION['draws'] = $draws = $arr[0]['draws'];
        $_SESSION['games_played'] = $games_played = $arr[0]['games_played'];


        //$username,$account_balance,$games_playeds;
        $arr = [$username,$account_balance];

        $_SESSION['user_info'] = $arr;
        return true;
    }
    catch (PDOException $e) {
        echo $e;
    }
    catch (Exception $e) {
        echo $e;
    }
}

function createPdo() {
    $host = 'localhost:8889';
    $user = 'root';
    $password = 'root';
    $dbname = 'blackjack';
    // Set DSN
    $dsn = 'mysql:host=' . $host . ';dbname=' . $dbname;
    // Create a PDO instance
    try{
        $pdo = new PDO($dsn, $user, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

        return $pdo;
    }
    catch (Exception $e) {
        echo "Error making pdo";
        echo $e;
    }
    catch (PDOException $e) {
        echo "Error making pdo";
        echo $e;
    }

    return false;
}

function userExists($pdo, $user) {
    try {
        $stmt = $pdo->prepare("SELECT * FROM player");
        $stmt->execute();

        $arr = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach($arr as $value) {
            if($value['username'] == $user) return true;

        }

        return false;
    }
    catch (PDOException $e) {
        echo "Couldnt create user";
        echo $e;
    }
    catch (Exception $e) {
        echo "Couldnt create user";
        echo $e;
    }
}

function checkLogin($pdo,$username,$password) {
    try{
        $stmt = $pdo->prepare("SELECT * FROM player");
        $stmt->execute();

        $arr = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($arr as $value) {
            if ($value['username'] == $username && $value['password'] == $password)
                return true;
        }

        return false;

    }
    catch (PDOException $e) {
        echo "Error Login failed";
        echo $e;
    }
    catch (Exception $e) {
        echo "Error: Login Failed";
        echo $e;
    }
}

function throwAlert($message) {
    echo "<script class='alert-success' type='text/javascript'>alert('$message');</script>";
}

function redirect($page) {
    echo "<script>window.location.replace('$page');</script>";
}
