/**
 * @jsx React.DOM
 */

var Cache = {};

var Card = React.createClass({
  render: function() {
    return (
      <div className="card">{this.props.name}</div>
    );
  }
});

var CardSearchForm = React.createClass({
  getInitialState: function() {
    return {value: ''};
  },
  handleChange: function(event) {
    var query = event.target.value;
    this.setState({value: event.target.value});

    if (query == "") {
      return this.props.onSearch([]);
    }

    if (Cache[query] !== undefined) {
      return this.props.onSearch(Cache[query]); 
    }

    $.ajax({
      url: 'https://api.deckbrew.com/mtg/cards/typeahead?q=' + query,
      dataType: 'json',
      success: function(data) {
        this.props.onSearch(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("DeckBrew API", status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    var value = this.state.value;
    return (
      <input tabindex="1" type="text" value={value}
        onChange={this.handleChange} placeholder="Enter a card name">
      </input>
    );
  }
});

var CardList = React.createClass({
  render: function() {
    var cardNodes = this.props.cards.map(function (card) {
      return <Card name={card.name}/>;
    });
    return (
      <div className="cards">
        {cardNodes}
      </div>
    );
  }
});

var CardSearchBox = React.createClass({
  getInitialState: function() {
    return {cards: []};
  },
  handleSearch: function(cards) {
    this.setState({cards: cards});
  },
  render: function() {
    return (
      <div class="box">
        <CardSearchForm onSearch={this.handleSearch}></CardSearchForm>
        <CardList cards={this.state.cards}></CardList>
      </div>
    );
  }
});


React.renderComponent(
  <CardSearchBox onSearchit={this.handleCommentSubmit}/>,
  document.getElementById('side')
);

//$(document).ready(function() {
//  var numbers = new Bloodhound({
//    datumTokenizer: function(d) { 
//      return Bloodhound.tokenizers.whitespace(d.name);
//    },
//    queryTokenizer: Bloodhound.tokenizers.whitespace,
//    //prefetch: 'js/prefetch.json',
//    limit: 10,
//    remote: {
//      url: 'https://api.deckbrew.com/mtg/cards/typeahead?q=%QUERY',
//      rateLimitWait: 50,
//    }
//  });
//  
//  // initialize the bloodhound suggestion engine
//  numbers.initialize();
//  
//  // instantiate the typeahead UI
//  $('.typeahead').typeahead({autoselect: true, highlight: true}, {
//    displayKey: 'name',
//    source: numbers.ttAdapter()
//  });
//
//  $('.typeahead').on('typeahead:selected', function(jevent, suggestion, dataset) {
//    $('.typeahead').typeahead('val', '');
//    $("#images").append($('<img/>').attr('src', suggestion.editions[0].image_url));
//  });
//
//});
