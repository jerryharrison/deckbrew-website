---
layout: default
title: "Deckbrew - Magic: The Gathering API"
nav-api: active
description: >
  DeckBrew's JSON API is the easiest way to access Magic: The Gathering card information
  It's free to use with no sign-up required.
---

# API

## Overview

The DeckBrew API is the easiest way to get Magic: The Gathering information
into your application. It's free to use with no sign-up required.

This API wouldn't have been possible without the amazing
[mtgjson](http://mtgjson.com) and [mtgimage](http://mtgimage.com) resources.

All API access is over HTTPS, and accessed from the `api.deckbrew.com` domain.

All data is sent and received as JSON.

### Projects Using the DeckBrew API

- [Magic Card Viewer and Pricer by Zachary Wilson](https://play.google.com/store/apps/details?id=com.zach.wilson.magic.app)
- [MTG PriceFinder by Ken Briscoe](http://www.mtgne.com/)

### Pagination

Requests that return multiple items will be paginated to 100 items by default.
You can specify further pages with the `?page` parameter.

    $ curl https://api.deckbrew.com/mtg/cards?page=2

Note that page numbering is 0-based and that omitting the `?page` parameter
will return the first page.

#### Link Header

The pagination info is included in the Link header. It is important to follow
these Link header values instead of constructing your own URLs.

    Link: <https://api.deckbrew.com/mtg/cards?page=3>; rel="next",
      <https://api.deckbrew.com/mtg/cards?page=1>; rel="prev"

The possible `rel` values are:

| Name | Description |
| ---- | ----------- |
| next | Shows the URL of the immediate next page of results.| 
| prev | Shows the URL of the immediate previous page of results. |



### Errors

Any response with a status code greater than or equal to 400 is considered an
error. An error object will be returned with an `errors` key pointing to a list
of errors for a given request.

> GET /mtg/page/not/found

```js
{
  "errors": [
    "Card with ID '123' not found"
  ]
}
```

## Magic Cards

Due to a misundestanding between TCGPlayer and Deckbrew, prices are no longer
available in the API. To prevent breaking existing applications, all prices
have been set to zero.

### List all cards

Return a list of all Magic cards. Can be filtered using query string parameters
to narrow the search.

> GET /mtg/cards

```js
[
  {
    "name": "About Face",
    "id": "about-face",
    "url": "https://api.deckbrew.com/mtg/cards/about-face",
    "store_url": "http://store.tcgplayer.com/magic/urzas-legacy/about-face",
    "types": [
      "instant"
    ],
    "colors": [
      "red"
    ],
    "cmc": 1,
    "cost": "{R}",
    "text": "Switch target creature's power and toughness until end of turn.",
    "formats": {
      "commander": "legal",
      "legacy": "legal",
      "vintage": "legal"
    },
    "editions": [
      {
        "set": "Urza's Legacy",
        "rarity": "common",
        "artist": "Melissa A. Benson",
        "multiverse_id": 12414,
        "flavor": "The overconfident are the most vulnerable.",
        "number": "73",
        "layout": "normal",
        "price": {
            "low": 0,
            "average": 0,
            "high": 0
        },
        "url": "https://api.deckbrew.com/mtg/cards?multiverseid=12414",
        "image_url": "http://mtgimage.com/multiverseid/12414.jpg",
        "set_url": "https://api.deckbrew.com/mtg/sets/ULG",
        "store_url": "http://store.tcgplayer.com/magic/urzas-legacy/about-face"
      }
    ]
  }
]
```

#### Card filtering

Cards can be filtering using query string parameters. Parameters with the
**same name** are evaluated as OR statements. For example, the query below will
find all red or blue rare cards in Unhinged.

> GET /mtg/cards?set=UNH&color=red&color=blue&rarity=rare

| Name | Type | Description |
| ---- | ---- | ----------- |
| `type` | `[]string` |  Any valid card type. Possible values include `enchantment` and|`artifact`. |
| `subtype` | `[]string` | Any valid card subtype. Possible values include `zombie` and `tribal`. |
| `supertype` | `[]string` | Any valid card supertype, such as `legendary`|
| `name` | `[]string` | A fuzzy match on a card's name |
| `oracle` | `[]string` | A fuzzy match on a card's Oracle rules text |
| `set` | `[]string` | A three letter identifier for a Magic set |
| `rarity` | `[]string` | Select cards printed at this rarity. Options are `common`, `uncommon`, `rare` and `mythic`|
| `color` | `[]string` | Select cards of the chosen color |
| `multicolor` | `bool` | Only show cards that are multicolored. Legal values are `true` and `false` |
| `multiverseid` | `[]string` | Select cards of that have at least one edition with the given Multiverse ID |
| `m` | `[]string` | Shortcut for Multiverse ID |
| `format` | `[]string` | Only show cards allowed in a specific format. Legal values are `vintage`, `legacy`, `modern`, `standard`, and `commander` |
| `status` | `[]string` | Only show cards with the given status. Legal values are `legal`, `banned` or `restricted` |

#### Get cards for a Multiverse ID

A specific print of a card or cards identified by it's [Multiverse
ID](http://gatherer.wizards.com/pages/Help.aspx). By filtering on  endpoint
always returns an array of cards, as certain prints contain more than one card,
such as the split card [Turn //
Burn](https://api.deckbrew.com/mtg/cards?multiverseid=369080).

#### Search examples

All red or blue rares with "fire" in their name:

<https://api.deckbrew.com/mtg/cards?color=red&color=blue&rarity=rare&name=fire>

All black zombies from Onslaught block:

<https://api.deckbrew.com/mtg/cards?set=ons&set=scg&set=lgn&subtype=zombie&color=black>

All cards that reference winning or lose the game

<https://api.deckbrew.com/mtg/cards?oracle=win+the+game&oracle=lose+the+game>

### Get a single card

> /mtg/cards/:id

```js
{
  "name": "About Face",
  "id": "about-face",
  "url": "https://api.deckbrew.com/mtg/cards/about-face",
  "store_url": "http://store.tcgplayer.com/magic/urzas-legacy/about-face",
  "types": [
    "instant"
  ],
  "colors": [
    "red"
  ],
  "cmc": 1,
  "cost": "{R}",
  "text": "Switch target creature's power and toughness until end of turn.",
  "formats": {
    "commander": "legal",
    "legacy": "legal",
    "vintage": "legal"
  },
  "editions": [
    {
      "set": "Urza's Legacy",
      "rarity": "common",
      "artist": "Melissa A. Benson",
      "multiverse_id": 12414,
      "flavor": "The overconfident are the most vulnerable.",
      "number": "73",
      "layout": "normal",
      "price": {
          "low": 0,
          "average": 0,
          "high": 0
      },
      "url": "https://api.deckbrew.com/mtg/cards?multiverseid=12414",
      "image_url": "http://mtgimage.com/multiverseid/12414.jpg",
      "set_url": "https://api.deckbrew.com/mtg/sets/ULG",
      "store_url": "http://store.tcgplayer.com/magic/urzas-legacy/about-face"
    }
  ]
}
```

### Typeahead autocomplete for card search

> /mtg/cards/typeahead

This endpoint returns a list of 10 cards (the same format as the `/mtg/cards`
endpoint) that match the beginning of the search term. This endpoint is great
for building interactive autocomplete search for Magic cards. 

| Name | Type | Description |
| ---- | ---- | ----------- |
| `q` | `string` |  Card name prefix search |

#### Examples

The first 10 cards that start with `Sele` sorted in alphabetical order.

<https://api.deckbrew.com/mtg/cards/typeahead?q=sele>

## Magic Sets

### List all sets

> GET /mtg/sets

```js
[
  {
    "id": "ARB",
    "name": "Alara Reborn",
    "border": "black",
    "type": "expansion",
    "url": "https://api.deckbrew.com/mtg/sets/ARB",
    "cards_url": "https://api.deckbrew.com/mtg/cards?set=ARB"
  }
]
```

### Get a single set


> GET /mtg/sets/:id

```js
{
  "id": "ARB",
  "name": "Alara Reborn",
  "border": "black",
  "type": "expansion",
  "url": "https://api.deckbrew.com/mtg/sets/ARB",
  "cards_url": "https://api.deckbrew.com/mtg/cards?set=ARB"
}
```

## Magic Types and Colors

These endpoints provide a list of possible values for specific search terms.

### List all types

> GET /mtg/types

```js
[
  "artifact",
  "creature",
  "enchantment",
  "instant",
  "land",
  "phenomenon",
  "plane",
  "planeswalker",
  "scheme",
  "sorcery",
  "tribal",
  "vanguard"
]
```

### List all supertypes

> GET /mtg/supertypes

```js
[
  "basic",
  "legendary",
  "ongoing",
  "snow",
  "world"
]
```

### List all subtypes

> GET /mtg/subtypes

```js
[
  "advisor",
  "ajani",
  "alara",
  "ally",
  "angel",
  "anteater",
]
```
### List all colors

> GET /mtg/colors

```js
[
  "black",
  "blue",
  "green",
  "red",
  "white"
]
```
