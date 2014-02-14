/**
 * @jsx React.DOM
 */

var Cache = {};

var Card = React.createClass({
  render: function() {
    var name = "card";
    if (this.props.selected.id == this.props.id) {
      name = name + " active";
    }
    return (
      <div className={name}>{this.props.name}</div>
    );
  }
});

var CardSearchForm = React.createClass({
  getInitialState: function() {
    return {value: ''};
  },
  handleSubmit: function(event) {
    this.setState({value: ''});
    this.props.onSearch([]);
    return false;
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
        Cache[query] = data;
        this.props.onSearch(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("DeckBrew API", status, err.toString());
      }.bind(this)
    });
    return true;
  },
  render: function() {
    var value = this.state.value;
    return (
      <form onSubmit={this.handleSubmit}>
        <input tabindex="1" type="text" value={value} ref="search"
          placeholder="Enter a card name" onChange={this.handleChange}>
        </input>
      </form>
    );
  }
});

var CardList = React.createClass({
  render: function() {
    var selected = this.props.selected;
    var cardNodes = this.props.cards.map(function (card) {
      return (
        <Card id={card.id} name={card.name} selected={selected}
          image_url={card.editions[0].image_url}/> 
      );
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
    return {cards: [], selected: {id: '', name: '', editions: [{image_url: ''}]}};
  },
  handleSearch: function(cards) {
    if (cards.length > 0) {
      this.setState({
        cards: cards,
        index: 0,
        selected: cards[0]
      });
    } else {
      this.setState({
        cards: cards,
        index: 0,
        selected:{id: '', name: '', editions: [{image_url: ''}]},
      });
    }
  },
  handlePress: function(event) {
    if (event.key == "Down") {
      var i = this.state.index + 1;
      if (i < this.state.cards.length) {
        this.setState({index: i, selected: this.state.cards[i]});
      }
    }
    if (event.key == "Up") {
      var i = this.state.index - 1;
      if (i >= 0) {
        this.setState({index: i, selected: this.state.cards[i]});
      }
    }
  },
  render: function() {
    var card = this.state.selected;
    return (
      <div class="box" onKeyPress={this.handlePress}>
        <img src={card.editions[0].image_url} alt={card.name} />
        <CardSearchForm onSearch={this.handleSearch}></CardSearchForm>
        <CardList cards={this.state.cards} selected={this.state.selected}></CardList>
      </div>
    );
  }
});


React.renderComponent(
  <CardSearchBox onSearchit={this.handleCommentSubmit}/>,
  document.getElementById('side')
);
