/**
 * @jsx React.DOM
 */
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
    this.props.onSearch({name: event.target.value});
    this.setState({value: event.target.value});
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
  handleSearch: function(card) {
    this.setState({cards: this.state.cards.concat([card])});
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
