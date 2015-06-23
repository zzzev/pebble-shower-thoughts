/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var Ajax = require('ajax');
var UI = require('ui');

var cards = [];

var showCardForPost = function showCardForPost(post, rest) {
    var card = new UI.Card({
      title: '+' + post.score,
      subtitle: '/u/' + post.author,
      body: post.title,
      scrollable: true,
      style: 'small'
    });
    card.on('click', 'select', function() {
      if (rest.length === 0) {
        loadMoreCards();
      } else {
        showCardForPost(rest[0], rest.slice(1));
      }
      card.hide();
    });
    card.show();
};

var showErrorCard = function showErrorCard(errorMessage) {
  var errorCard = new UI.Card({
    title: 'Error',
    subtitle: 'Something went wrong',
    body: 'errorMessage',
    scrollable: true
  });
  errorCard.show();
  cards.push(errorCard);
};

var loadMoreCards = function() {
  var loadingCard = new UI.Card({
    title: 'Shower Thoughts',
    subtitle: 'Loading...'
  });
  loadingCard.show();
  Ajax(
    {
      url: 'http://www.reddit.com/r/showerthoughts.json',
      type: 'json'
    },
    function(data, status, request) {
      var posts = data.data.children.map(function(post) {
        return {
          score: post.data.score,
          title: post.data.title,
          author: post.data.author
        };
      });
      showCardForPost(posts[0], posts.slice(1));
      loadingCard.hide();
    },
    function(error, status, request) {
      showErrorCard(error);
    }
  );
};

loadMoreCards();
