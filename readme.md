# Pokemon Card Finder by Attack Damage

Hitting the correct numbers with attacks is crucial in Pokemon TCG. A lot of the gameplay is calculating base damage and modifiers so I built this small app to help find good cards.

You can use it from [https://hamatti.github.io/pkmn-attack-damage/](https://hamatti.github.io/pkmn-attack-damage/).

## How to run

It's a HTML/CSS/Javascript app so there's no build process, no deployment, just open up index.html and go.

Internally, it uses [pokemontcg.io API](https://pokemontcg.io) for the card information.

## Adding a set

To add a set to Standard & Expanded formats, add a new line into `STANDARD_FORMAT_SETS` with the correct set abbreviation. You can check the correct abbreviation from [pokemontcg.io's docs](https://pokemontcg.io/sets).

## CONTRIBUTE

### Issues

Feel free to open an issue for a bug or feature request.

**Bug**: please write how you expect the functionality to work, how it works and what did you do before you encountered the issue (for example, an example input helps a lot in reproducing the issue).

**Feature**: please write how you wish it would function and if it requires extra data, let me know what data you'd love to have in addition.

### Pull requests

Fork the project ([instructions](https://help.github.com/en/articles/fork-a-repo)), create a new branch and submit a pull requests to the project ([instructions](https://help.github.com/en/articles/creating-a-pull-request-from-a-fork)).

If your changes introduce any UI changes, please provide screenshots.

## LICENSE

This program is licensed with [MIT License](LICENSE).
