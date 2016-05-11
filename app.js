var randomQuoteGenerator = (function IIFE () {
  var $variables = {}

  function preventImmediateRefresh () {
    $variables.newQuote.attr('disabled', true)
    setTimeout(function () {
      $variables.newQuote.attr('disabled', false)
    }, 1200)
  }

  function setTweet (quote, author) {
    return $variables.tweet.attr('href', 'https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=\'' + quote + '\' - ' + author)
  }

  function randomColor () {
    var randomColor = 'rgb(' + Math.floor(Math.random() * 256) + ', ' + Math.floor(Math.random() * 256) + ', ' + Math.floor(Math.random() * 256) + ')'
    $($variables.randomColorClass).css('color', randomColor)
    $($variables.randomBackgroundColorClass).css('background-color', randomColor)
  }

  function getQuote () {
    return $.getJSON('http://api.icndb.com/jokes/random?limitTo=[nerdy]&escape=javascript', function (json) {
      setTweet(json.value.joke, 'Entry ' + json.value.id)
      $variables.quote.fadeOut('slow', function () {
        this.innerHTML = '<i class="fa fa-quote-left fa-lg"></i> ' + json.value.joke
      }).fadeIn('slow')
      $variables.author.fadeOut('slow', function () {
        this.innerHTML = '- Entry ' + json.value.id
      }).fadeIn('slow')
    })
  }

  function archiveQuote () {
    var previousQuote = $('<div class="row">' +
      '<div class="col-xs-2"></div>' +
      // '<div class="col-xs-3"><p class="' + $variables.randomColorClass.slice(1) + '">' + $variables.author.text().slice(2) + '</p></div>' +
      '<div class="col-xs-10"><p class="' + $variables.randomColorClass.slice(1) + '">' + $variables.quote.text().slice(1) + '</p></div>' +
      '</div>')

    if (!$variables.history.length) {
      $('<section id="' + $variables.history.selector.slice(1) + '" class="center-block"></section>').hide().delay('slow').appendTo($variables.container).slideDown('slow')
      $variables.history = $($variables.history.selector)
    } else {
      // TODO: delete temporary fix and make a proper one
      if ($variables.history.children().length >= 7) {
        $variables.history.children().slice(-2).remove()
      }
      if ($variables.history.children().length === 5) {
        $variables.history.children().slice(0, 2).delay('slow').slideUp('slow', function () {
          $(this).remove()
        })
      }
      $('<hr>').hide().delay('slow').appendTo($variables.history).slideDown('slow')
    }

    previousQuote.children('.col-xs-2').append($variables.tweet.clone().addClass('random_background'))
    previousQuote.hide().delay('slow').appendTo($variables.history).slideDown('slow')
  }

  function handleDocumentReady (event) {
    getQuote().then(randomColor)
    preventImmediateRefresh()
  }

  function handleQuoteButton (event) {
    archiveQuote()
    getQuote().then(randomColor)
    preventImmediateRefresh()
  }

  function init (options) {
    $variables.quote = $(options.quote)
    $variables.author = $(options.author)
    $variables.newQuote = $(options.newQuote)
    $variables.tweet = $(options.tweet)
    $variables.container = $(options.container)
    $variables.history = $(options.history)
    $variables.randomColorClass = options.randomColorClass // To include dynamically added elements
    $variables.randomBackgroundColorClass = options.randomBackgroundColorClass

    $(document).bind('ready', handleDocumentReady)
    $variables.newQuote.bind('click', handleQuoteButton)
  }

  return {
    init: init
  }
}())

$(document).ready(function () {
  randomQuoteGenerator.init({
    author: '#author',
    quote: '#quote',
    newQuote: '#new_quote',
    tweet: '#twitter',
    container: '.container-fluid',
    history: '#history',
    randomColorClass: '.random_color',
    randomBackgroundColorClass: '.random_background'
  })
})
