$(document).ready(function() {
  var numbers = new Bloodhound({
    datumTokenizer: function(d) { 
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    //prefetch: 'js/prefetch.json',
    limit: 10,
    remote: {
      url: 'https://api.deckbrew.com/mtg/cards/typeahead?q=%QUERY',
      rateLimitWait: 50,
    }
  });
  
  // initialize the bloodhound suggestion engine
  numbers.initialize();
  
  // instantiate the typeahead UI
  $('.typeahead').typeahead({autoselect: true, highlight: true}, {
    displayKey: 'name',
    source: numbers.ttAdapter()
  });

  $('.typeahead').on('typeahead:selected', function(jevent, suggestion, dataset) {
    $('.typeahead').typeahead('val', '');
    $("#images").append($('<img/>').attr('src', suggestion.editions[0].image_url));
  });

});
