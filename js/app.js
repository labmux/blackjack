var app = angular.module('Blackjack', []);

app.controller('GameCtrl', function ($scope, $interval, $timeout) {

    //var game = new Game();
    $scope.game_started = false;
    $scope.bet = 0;
    $scope.player_hand = [];
    $scope.player_hand_total = 0;
    $scope.dealer_hand = [];
    $scope.dealer_hand_total = 0;
    $scope.dealer_bust = false;
    $scope.player_bust = false;
    $scope.wins = 0;
    $scope.losses = 0;
    $scope.draws = 0;
    $scope.games_played = 0;
    $scope.game_money = 0;
    $scope.addAmount = 0;
    $scope.first_round = false;
    $scope.insurance_possible = false;
    $scope.insurance = 0;

    $scope.deck = buildDeck();
    $scope.deck = shuffle($scope.deck);

    if ($scope.decks > 1) {
        for (let i = 1; i < $scope.decks; i++) {

            $scope.deck += buildDeck();
            $scope.deck = shuffle($scope.deck);
        }
    }
    else if ($scope.players > 1)   {

    }


    $interval(function () {
        $scope.refreshPage();
    }, 500);

    $scope.refreshPage = function() {
        var xhr = new XMLHttpRequest(); //New request object

        xhr.open("GET", "user.php", true);
        xhr.send();

        xhr.onload = function() {
            $scope.resp = this.responseText;
            $scope.user = JSON.parse($scope.resp);

            $scope.username = $scope.user[0];
            $scope.account_balance = $scope.user[1];

        };
    };

    $scope.addGameMoney = function () {
        if ($scope.addAmount < 1)                           alert("Cannot add negative");
        else if ($scope.addAmount > $scope.account_balance) alert("Not enough funds");
        else{
            $scope.removeFunds($scope.addAmount);
            $scope.game_money += $scope.addAmount;
            $scope.addAmount = 0;
        }
    };

    $scope.addFunds = function(funds) {
        try {
            if (funds < 1)  throw "Cant put negative number";
            else {
                let xmlhttp = new XMLHttpRequest();

                xmlhttp.onreadystatechange = function() {
                    // if (xmlhttp.readyState != 4 || xmlhttp.status != 200) {
                    //     alert(xmlhttp.responseText);
                    //     }
                    };

                xmlhttp.open("POST", "useraccount.php", true);
                xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xmlhttp.send("funds=" + funds + "&username=" + $scope.username);
            }
        }
        catch (e) {
            alert("Failed to add funds: " + e.getText());
            console.log(e);
        }
    };

    $scope.removeFunds = function(funds) {
        try {
            if (funds < 1)  throw "Cant put negative number";
            else {
                let xmlhttp = new XMLHttpRequest();
                funds = funds * -1;

                console.log(funds + " " + $scope.username);
                xmlhttp.onreadystatechange = function() {
                    // if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    //     alert("remove" +  xmlhttp.responseText);
                    // }
                };

                xmlhttp.open("POST", "useraccount.php", true);
                xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xmlhttp.send("funds=" + funds + "&username=" + $scope.username);
            }
        }
        catch (e) {
            alert("Failed to add funds: " + e.getText());
            console.log(e);
        }

    };

    $scope.playerHit = function() {
        let card = $scope.drawCard();
        $scope.player_hand.push(card);

        $scope.player_hand_total = $scope.total($scope.player_hand);

        $timeout(function () {
            if ($scope.player_hand_total > 21) {
                alert("Bust!");
                $scope.player_bust = true;
                $scope.stand();
            }
        },1000);
    };

    $scope.dealerHit = function() {
        let card = $scope.drawCard();
        $scope.dealer_hand.push(card);
        $scope.dealer_hand_total = $scope.total($scope.dealer_hand);

        //insurance
        if (card.value == 'a')      $scope.insurance_possible = true;

        $timeout(function () {
            if ($scope.dealer_hand_total > 21) {
                alert("Dealer Bust!");
                $scope.dealer_bust = true;
            }
        }, 1000);
    };

    $scope.drawCard = function () {
        if ($scope.deck.length < 1) {
            alert("Deck emptied, using new deck");
            $scope.deck = buildDeck();
            $scope.deck = shuffle();
        }

        $scope.first_round = false;
        return  $scope.deck.shift();
    };

    $scope.doubleDown = function() {
        $scope.bet = $scope.bet * 2;
        $scope.first_round = false;
        document.querySelector()
    };

    $scope.deal = function () {
        if ($scope.bet < 1)
            alert("Must set a bet");
        else {
            $scope.game_started = true;

            //user draw two cards
            $scope.playerHit();
            $scope.playerHit();
            $scope.player_hand_total = $scope.total($scope.player_hand);

            $scope.dealerHit();
            $scope.dealerHit();
            $scope.dealer_hand_total = $scope.total($scope.dealer_hand);

            $scope.first_round = true;

            $timeout(function () {
                if ($scope.player_hand_total > 21) {
                    $scope.player_bust = true;
                    $scope.stand();
                }
                else if ($scope.dealer_hand_total > 21) {
                    $scope.dealer_bust_bust = true;
                    $scope.gameOver();
                }
            },1000);
        }
    };

    $scope.stand = function() {
        while($scope.dealer_hand_total < 17) {

            console.log('turn ' + $scope.dealer_hand);
            $scope.dealerHit();
        }

        $timeout(function () {

            if ($scope.dealer_hand_total > 21)  $scope.dealer_bust = true;
            $scope.gameOver();
        },1000);
    };

    $scope.gameOver = function () {

        if ($scope.dealer_bust && !$scope.player_bust) {
            console.log('dealer bust' + $scope.dealer_bust);

            $scope.playerWon = true;
        }
        else if ($scope.player_bust && !$scope.dealer_bust) {
            $scope.dealerWon = true;
        }
        else if ($scope.player_bust && $scope.dealer_bust) {
            $scope.dealerWon = false;
            $scope.playerWon = false;
        }
        else if (!$scope.player_bust && !$scope.dealer_bust) {
            if ($scope.player_hand_total == $scope.dealer_hand_total) {
                $scope.playerWon = false;
                $scope.dealerWon = false;
            }
            else if ($scope.player_hand_total > $scope.dealer_hand_total) {
                $scope.playerWon = true;
            }
            else {

                $scope.dealerWon = true;
            }
        }

        if ($scope.playerWon) {
            alert("Player won the game");
            $scope.wins++;
            let funds;
            if ($scope.player_hand_total == 21) funds = 2.5 * $scope.bet;
            else                                funds = 2 * $scope.bet;

            $scope.game_money += funds;
        }

        else if ($scope.dealerWon) {
            if ($scope.dealer_hand_total == 21)
                $scope.bet += $scope.insurance;
            $scope.losses++;
            $scope.bet = 0;
            alert("Dealer won");
        }

        else if (!$scope.playerWon && !$scope.dealerWon) {
            $scope.game_money += $scope.bet;
            $scope.draws++;
            alert("Draw");
        }
        console.log($scope.player_hand_total + " " + $scope.dealer_hand_total);
        console.log($scope.player_bust + " " + $scope.dealer_bust);

        $scope.games_played += $scope.wins + $scope.losses + $scope.draws;

        $scope.playerWon = false;
        $scope.dealerWon = false;
        $scope.game_started = false;
        $scope.bet = 0;
        $scope.remove_amount = 0;
        $scope.player_hand = [];
        $scope.player_hand_total = 0;
        $scope.dealer_hand = [];
        $scope.dealer_hand_total = 0;
        $scope.dealer_bust = false;
        $scope.player_bust = false;
        $scope.first_round = false;
        $scope.insurance_possible = false;
        $scope.insurance = 0;

    };

    $scope.cashIn = function () {
        $scope.addFunds($scope.game_money);
        $scope.game_money = 0;
    };

    $scope.setInsurance = function () {
        $scope.insurance = ($scope.bet/2);
        $scope.insurance_possible = false;
    };

    $scope.addInsurance = function(ins) {
        if (ins > $scope.game_money)
            alert("Not enough funds");

        else {
            $scope.insurance = $scope.insurance + ins;
            $scope.game_money -= ins;
        }
    };

    $scope.removeInsurance = function () {
        if ($scope.insurance  < 1) {
            return false;
        }
        else {
            $scope.game_money += $scope.insurance;
            $scope.insurance = 0;
        }
    };

    $scope.addBet = function(bet) {

        if (bet > $scope.game_money)
            alert("Not enough funds");

        else {
            $scope.bet = $scope.bet + bet;
            $scope.game_money -= bet;
        }
    };

    $scope.removeBet = function () {
        if ($scope.bet  < 1) {
            return false;
        }
        else {
            $scope.game_money += $scope.bet;
            $scope.bet = 0;
        }
    };

    $scope.total = function(hand) {
        let total = 0;

        for(let i = 0; i < hand.length; i++){
            if (hand[i].value == 'j')
                total += 10;
            else if (hand[i].value == 'q')
                total += 10;
            else if (hand[i].value == 'k')
                total += 10;
            else if (hand[i].value == 'a')
                total += 11;
            else
                total += hand[i].value;
        }

        return total;
    }

    $scope.saveSettings = function (decks,players) {
        for (let i = 0; i < decks.length; i++) {
            $scope.decks = decks;
        }

        $scope.players = players;
    };

    function buildSuit(suitname) {
        let suit = [];

        for (let i = 0; i <= 8; i++) {
            suit[i] = {
                value: (i + 2),
                suit: suitname
            };
        }

        suit[9] = {
            value: 'j',
            suit: suitname
        };
        suit[10] = {
            value: 'q',
            suit: suitname
        };
        suit[11] = {
            value: 'k',
            suit: suitname
        };
        suit[12] = {
            value: 'a',
            suit: suitname
        };

        return suit;
    }

    function buildDeck() {

        let deck_array = [
            buildSuit('hearts'),
            buildSuit('diamonds'),
            buildSuit('spades'),
            buildSuit('clubs')
        ];

        //put array in one dimensional array
        let deck = new Array(52);
        let counter = 0;
        for (let i = 0; i < deck_array.length; i ++) {
            for (let j = 0; j < deck_array[0].length; j ++) {
                let v = deck_array[i][j].value;

                let css_card = "card card-" + deck_array[i][j].suit+ " card-" +deck_array[i][j].value;
                deck[counter] = {
                    value: v,
                    css:css_card
                };
                counter++;
            }

        }
        return deck;
    }

    function shuffle(deck) {
        for (let i = 0; i < 52; i ++) {
            //take first card and place it at a random index in the deck array
            let random = Math.floor(Math.random() * (52)); //why + 1?
            let card = deck.shift();

            deck.splice(random,0,card);
        }
        return deck;
    }

});