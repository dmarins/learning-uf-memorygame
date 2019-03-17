let classFirstCardClicked = "",
  classSecondCardClicked = "",
  count = 0,
  firstReferenceCard = undefined,
  secondReferenceCard = undefined,
  matchesLimit = 8,
  attemptsLimit = 3;

$(document).ready(function() {
  let $ul = $(".deck");
  let ulChildrens = $(".deck").children();

  shuffleCards(ulChildrens, $ul);
  addRestartClick();
  addCardClick();
});

function shuffleCards(array, parent) {
  for (var i = array.length; i >= 0; i--) {
    parent.append(parent.children()[(Math.random() * i) | 0]);
  }
}

function addRestartClick() {
  $(".restart").on("click", function() {
    reloadPage();
  });
}

function addCardClick() {
  $(".card").on("click", function() {
    let $self = $(this);

    count++;

    persistsDataOfChoice($self);

    if (wasTheCardSelectedTwoTimes($self)) return;

    controlTheDisplayOfTheCardSymbol($self);
    controlOfHitsOrErrors($self);
    checkingTheNumberOfAttempts();
    checkingTheNumberOfMatches();
  });
}

function reloadPage() {
  window.location.reload();
}

function persistsDataOfChoice(card) {
  if (count === 1) {
    firstReferenceCard = card;

    classFirstCardClicked = card.children()[0].className;
  } else if (count === 2) {
    secondReferenceCard = card;

    classSecondCardClicked = card.children()[0].className;
  } else {
    count = 1;
  }
}

function controlOfTheNumberOfAttempts() {
  let star = $(".stars")
    .children()
    .not(".used");
  $(star[0]).addClass("used");

  $(".moves").text(star.length - 1);

  attemptsLimit--;
}

function wasTheCardSelectedTwoTimes(card) {
  if (card.hasClass("show")) {
    card.removeClass("open");
    card.removeClass("show");

    count = 0;

    classFirstCardClicked = "";
    classSecondCardClicked = "";

    controlOfTheNumberOfAttempts();

    alert("Escolha errada! Você não pode usar o mesmo cartão 2 vezes.");

    checkingTheNumberOfAttempts();

    return true;
  }
}

function controlTheDisplayOfTheCardSymbol(card) {
  if (card.hasClass("open")) {
    card.removeClass("open");
    card.removeClass("show");
  } else {
    card.addClass("open");
    card.addClass("show");
  }
}

function controlOfHitsOrErrors(card) {
  if (classFirstCardClicked === classSecondCardClicked) {
    card.addClass("match");

    count = 0;

    matchesLimit--;
  } else if (count === 2) {
    controlOfTheNumberOfAttempts();

    firstReferenceCard.removeClass("open");
    firstReferenceCard.removeClass("show");

    secondReferenceCard.removeClass("open");
    secondReferenceCard.removeClass("show");

    count = 0;
  }
}

function checkingTheNumberOfAttempts() {
  if (attemptsLimit === 0) {
    alert("Ah não, você perdeu o jogo!\n\nRecomeçando...");

    reloadPage();
  }
}

function checkingTheNumberOfMatches() {
  if (matchesLimit === 0) {
    alert("Parabéns, você ganhou esta partida!\n\nRecomeçando...");

    reloadPage();
  }
}
