"use strict";

let classFirstCardClicked = "",
  classSecondCardClicked = "",
  count = 0,
  firstReferenceCard = undefined,
  secondReferenceCard = undefined,
  matchesLimit = 8,
  moves = 0,
  seconds = 0,
  timer = undefined;

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
  $(".card").off();
  $(".card").on("click", function() {
    let $self = $(this);

    count++;

    if (moves === 0) {
      startTime();
    }

    incrementMoves();
    controlsTheStarRanking();

    // Persiste em memória dados sobre o ícone e a referência do cartão clicado
    persistsDataOfChoice($self);

    if (wasTheCardSelectedTwoTimes($self)) return;

    // Controla se a carta deve ser virada ou desvirada
    controlTheDisplayOfTheCardSymbol($self);
    controlOfHitsOrErrors($self);
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

function incrementMoves() {
  moves++;
  $(".moves").text(moves);
}

function controlsTheStarRanking() {
  let stars = $(".stars")
    .children()
    .children()
    .not(".far");

  if (moves === 17) {
    $(stars[0])
      .removeClass("fas")
      .addClass("far");
  } else if (moves === 20) {
    $(stars[0])
      .removeClass("fas")
      .addClass("far");
  }
}

function wasTheCardSelectedTwoTimes(card) {
  if (card.hasClass("show")) {
    card.removeClass("open");
    card.removeClass("show");

    count = 0;

    classFirstCardClicked = "";
    classSecondCardClicked = "";

    swal(
      "Escolha errada!",
      "Você não pode usar o mesmo cartão 2 vezes.",
      "warning"
    );

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
    firstReferenceCard.removeClass("open");
    firstReferenceCard.removeClass("show");

    // Adicionando um tempo para que o usuário consiga visualizar a segunda carta errada
    setTimeout(function() {
      secondReferenceCard.removeClass("open");
      secondReferenceCard.removeClass("show");
    }, 300);

    classFirstCardClicked = "";
    classSecondCardClicked = "";

    count = 0;
  }
}

function checkingTheNumberOfMatches() {
  let stars = $(".stars")
    .children()
    .children()
    .not(".far");

  if (matchesLimit === 0) {
    let message = endTime();
    swal({
      title: "Parabéns!",
      text:
        "Você ganhou esta partida com " +
        stars.length +
        " estrela(s)!\n\n" +
        message +
        "\n\nClique em Ok para recomeçar.",
      icon: "success",
      buttons: ["Não", "Sim"]
    }).then(restart => {
      if (restart) {
        reloadPage();
      } else {
        return;
      }
    });
  }
}

function startTime() {
  timer = setInterval(function() {
    seconds++;
    $("#seg").html(Math.floor(seconds % 60));
    if (Math.floor(seconds % 60) === 0) {
      $("#min").html(Math.floor((seconds / 60) % 60));
    }
  }, 1000);
}

function endTime() {
  clearTimeout(timer);
  timer = null;

  if (seconds >= 0) {
    const diff = {};

    diff.hours = Math.floor((seconds / 3600) % 24);
    diff.minutes = Math.floor((seconds / 60) % 60);
    diff.seconds = Math.floor(seconds % 60);

    let message = `Duração: ${diff.hours}h ${diff.minutes}m ${diff.seconds}s.`;
    message = message.replace(/(?:0. )+/, "");
    return message;
  }

  return "";
}
