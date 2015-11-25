/**
 * A simple game of the childrens card game War
 */
function ThreeNotFour(board) {

    function Player(name, brain, deck, slot, trumpCardLocation) {
        this.name = name;
        this.brain = brain;
        this.deck = deck;
        this.slot = slot;
        this.maxBid = -1;
        this.trumpCard = false;
        var player = this;

        this.bid = function(players) {
            if (this.maxBid == gameMaxBid) {
                //present trump card
                trumpOwner = this;
                this.brain.setTrumpCard(this.deck, function(trumpCard) {
                    player.trumpCard=trumpCard;
                    var trumpCardSlot = new Deck(board.collapsedType, trumpCardLocation.x, trumpCardLocation.y);
                    trumpCardSlot.setDraggable(false);
                    board.addDeck(trumpCardSlot);
                    trumpCardSlot.addTop(trumpCard);
                    deck.remove(trumpCard);
                    divideSecondHalf();
                });
            } else {
                this.brain.calcMaxBid(this.deck, function(calculatedMaxBid){
                    if (calculatedMaxBid > gameMaxBid) {
                        player.maxBid = calculatedMaxBid;
                        gameMaxBid = calculatedMaxBid;
                        alert(player.name + " bids for " + calculatedMaxBid);
                        passToNextPlayer();
                    } else {
                        alert(player.name + " doesn't want to bid");
                        passToNextPlayer();
                    }
                });

                function passToNextPlayer() {
                    for (var i = 0; i < players.length; i++) {
                        if (players[i] == player && players.length == i + 1) {
                            players[0].bid(players);
                        } else if (players[i] == player) {
                            players[i + 1].bid(players);
                        }
                    }
                }
            }
        }
    }

    var aiBrain = {
        calcMaxBid: function(deck,callback) {
            var cards = deck.getCards();
            var suits = {};
            for (var i=0; i<cards.length; i++) {
                suits[cards[i].getSuit()] = true;
            }
            if (Object.keys(suits).length == cards.length) {
                callback(100);
            } else if (Object.keys(suits).length == cards.length-1) {
                callback(180);
            } else if (Object.keys(suits).length < cards.length-1) {
                callback(250);
            } else {
                callback(-1);
            }
        },
        setTrumpCard: function(deck, callback) {
            var cards = deck.getCards();
            var suits = {};
            for (var i=0; i<cards.length; i++) {
                var suit = cards[i].getSuit();
                if (suit in suits){
                    suits[suit].count++;
                } else {
                    suits[suit] = {};
                    suits[suit].count = 1;
                }
                suits[suit].card = cards[i];
            }
            if (Object.keys(suits).length == cards.length-1) {
                for (var i in suits) {
                    if (suits[i].count == 2){
                        callback(suits[i].card);
                    }
                }
            } else {
                callback(cards[0]);
            }
        }
    };
    var humanBrain = {
        calcMaxBid: function(deck,callback) {
            var bid = prompt("Add a bid", "");
            callback(bid);
        },
        setTrumpCard: function(deck,callback) {
            var cards = deck.getCards();
            var cardsArray = [];
            var cardsString = "Choose trump:\n";
            for (var i=0; i<cards.length; i++) {
                cardsArray[i] = {};
                cardsArray[i].card = cards[i];
                cardsArray[i].suit = cards[i].getSuit();
                cardsArray[i].rank = cards[i].getRankAsString();
                cardsString += i+': '+cardsArray[i].suit+'-'+cardsArray[i].rank+'\n';
            }
            var cardIndex = prompt(cardsString, "");
            callback(cardsArray[cardIndex].card);
        }
    };

    //initiating game
    var interval = 1000;
    var gameMaxBid = 0;
    var trumpOwner = false;

    var mainDeck = new Deck(board.defaultType, 10, 1);
    mainDeck.setDraggable(false);
    board.addDeck(mainDeck);

    var player1Deck = new Deck(board.horizontalType, 3, 4);
    player1Deck.setDraggable(false);
    board.addDeck(player1Deck);

    var player2Deck = new Deck(board.defaultType, 1, 2);
    player2Deck.setDraggable(false);
    board.addDeck(player2Deck);

    var player3Deck = new Deck(board.defaultType, 3, 0);
    player3Deck.setDraggable(false);
    board.addDeck(player3Deck);

    var player4Deck = new Deck(board.defaultType, 5, 2);
    player4Deck.setDraggable(false);
    board.addDeck(player4Deck);

    var player1Slot = new Deck(board.collapsedType, 3, 3);
    player1Slot.setDraggable(false);
    board.addDeck(player1Slot);

    var player2Slot = new Deck(board.collapsedType, 2, 2);
    player2Slot.setDraggable(false);
    board.addDeck(player2Slot);

    var player3Slot = new Deck(board.collapsedType, 3, 1);
    player3Slot.setDraggable(false);
    board.addDeck(player3Slot);

    var player4Slot = new Deck(board.collapsedType, 4, 2);
    player4Slot.setDraggable(false);
    board.addDeck(player4Slot);

    var player1 = new Player("player1", humanBrain,player1Deck, player1Slot, {x:2,y:4});
    var player2 = new Player("player2", aiBrain,player2Deck, player2Slot, {x:0,y:2});
    var player3 = new Player("player3", aiBrain,player3Deck, player3Slot, {x:4,y:0});
    var player4 = new Player("player4", aiBrain,player4Deck, player4Slot, {x:6,y:3});
    var players = [player1,player2,player3,player4];

    var divideFirstHalf = function() {
        mainDeck.initialize(true);
        mainDeck.shuffle();
        var cards = mainDeck.getCards();
        for (var i=0; i<cards.length; i++){
            var card = cards[i];
            if (card.getRank() < 9 && card.getRank() != 1){
                mainDeck.remove(card);
                i--;
            }
        }
        mainDeck.deal(player1Deck,3,false);
        mainDeck.deal(player2Deck,3,false);
        mainDeck.deal(player3Deck,3,false);
        mainDeck.deal(player4Deck,3,false);
    }

    var divideSecondHalf = function() {
        mainDeck.deal(player1Deck,3,false);
        mainDeck.deal(player2Deck,3,false);
        mainDeck.deal(player3Deck,3,false);
        mainDeck.deal(player4Deck,3,false);
    }


    divideFirstHalf();
    setTimeout(function(){
        player1.bid(players);
    },5000);

    //var playerDeck = new Deck(board.defaultType, 1, 3);
    //playerDeck.setDraggable(false);
    //player1Deck.deal(playerDeck,26,true);
    //playerDeck.setAction(function() {
    //    if(waiting) {
    //        setWaiting(false);
    //        playerDeck.deal(playerPlayCard,1,false);
    //        player1Deck.deal(computerPlayCard,1,false);
    //        setTimeout(function(playerDeck,playerPlayCard,player1Deck,computerPlayCard,setWaiting,playerWarPile,computerWarPile,board) {
    //            var dealTo=false;
    //            if(playerPlayCard.peek().getRank()<computerPlayCard.peek().getRank()) {
    //                dealTo=player1Deck;
    //            } else if(playerPlayCard.peek().getRank()>computerPlayCard.peek().getRank()) {
    //                dealTo=playerDeck;
    //            }
    //            if(dealTo) {
    //                playerPlayCard.deal(dealTo,1,true,true,true);
    //                playerWarPile.deal(dealTo,playerWarPile.getSize(),true,true,true);
    //                computerPlayCard.deal(dealTo,1,true,true,true);
    //                computerWarPile.deal(dealTo,computerWarPile.getSize(),true,true,true);
    //            } else {
    //                playerPlayCard.deal(playerWarPile,1,false,true,true);
    //                computerPlayCard.deal(computerWarPile,1,false,true,true);
    //                playerDeck.deal(playerWarPile,3,false,true);
    //                player1Deck.deal(computerWarPile,3,false,true);
    //            }
    //            setWaiting(true);
    //        },interval,playerDeck,playerPlayCard,player1Deck,computerPlayCard,setWaiting,playerWarPile,computerWarPile,board);
    //    }
    //});
    //board.addDeck(playerDeck);

}
$(document).ready(function() {
    var board = new Board({
        rootId : "304",
        magicalX : 106,
        deckHeight : 150,
        magicalY : 160
    });
    new ThreeNotFour(board);
});