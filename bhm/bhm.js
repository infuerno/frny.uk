var cards = [];
var correctCards = 0;
var currentCard = 0;
var numberOfCards = 0;

function flip (event)
{
	var element = event.currentTarget;
	/* Toggle the setting of the classname attribute */
	element.className = (element.className == 'card') ? 'card flipped' : 'card';
}

function shuffleCards()
{
  var i = numberOfCards;
  if (i == 0) return false;
  while (--i) {
     var j = Math.floor(Math.random() * (i + 1));
     var tempi = cards[i];
     var tempj = cards[j];
     cards[i] = tempj;
     cards[j] = tempi;
   }
}

function initCards(xmldoc)
{
    var verbs = xmldoc.documentElement.getElementsByTagName("verb");
    numberOfCards = verbs.length;
    cards = new Array(numberOfCards);
    for (var i = 0; i < numberOfCards; i++) {
        // check the node here is an element and not a text node in case of white space
        var indexNode = verbs[i].getElementsByTagName("index")[0];
        var romajiNode = verbs[i].getElementsByTagName("romaji")[0];
        cards[i] = new Array(2);
        cards[i][0] = indexNode.firstChild.nodeValue;
        cards[i][1] = romajiNode.firstChild.nodeValue;
    }
    shuffleCards();
    showCard(currentCard);
    updateStats();
}

function init()
{
    loadXmlDataFromFile("data/verbs.xml", initCards);
}

function correct()
{
    correctCards++;
    showCard(++currentCard);
    updateStats();
}

function incorrect()
{
    showCard(++currentCard);
    updateStats();
}

function showCard(index)
{
    if (index == numberOfCards)
        finish();
    else
    {
        var card = document.getElementById('card');
        if (card.className == 'card')
        {
            var img = document.getElementById('frontImage');
            img.setAttribute("src", "images/verbs/" + cards[index][0] + "/" + cards[index][1] + ".gif");
            img = document.getElementById('backImage');
            img.setAttribute("src", "images/verbs/" + cards[index][0] + "/" + cards[index][1] + "-all.gif");
        }
        else
        {
            var img = document.getElementById('backImage');
            img.setAttribute("src", "images/verbs/" + cards[index][0] + "/" + cards[index][1] + ".gif");
            img = document.getElementById('frontImage');
            img.setAttribute("src", "images/verbs/" + cards[index][0] + "/" + cards[index][1] + "-all.gif");
        }
    }
}

function updateStats()
{
    var stats = document.getElementById('stats');
    stats.innerHTML = "Card: " + (currentCard + 1) + "/" + numberOfCards;
    if (currentCard > 0)
        stats.innerHTML += "&nbsp;&nbsp;&nbsp;Accuracy: " + (correctCards*100/currentCard).toFixed(0) + "%";
}

function finish()
{
    alert("Congratulations, finished!!");
}

// retrieves a remote file and returns its root element
function loadXmlDataFromFile (fileName, callback, callbackArgs) {
  // get the document asynchronously
  var request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    // when the document has fully loaded, the .readyState is 4
    // and 200 is the HTTP code for a smooth operation
    if (request.readyState == 4) {
      // call callback with root element of the document as parameter
      callback(request.responseXML, callbackArgs);
    }
    // note that in real life, we would implement some error-handling behavior in case something
    // goes wrong on the network, as things ALWAYS go wrong at some point, but this is beyond the
    // point of this example
  };
  request.open('GET', fileName, true);
  request.send(null);
};
