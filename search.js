const STANDARD_FORMAT_SETS = [ "sm1", "smp", "sm2", "sm3", "sm35", "sm4", "sm5", "sm6", "sm7", "sm75", "sm8" ];
const EXPANDED_FORMAT_SETS = [ "bwp", "bw1", "bw2", "bw3", "bw4", "bw5", "bw6", "dv1", "bw7", "bw8", "bw9", "bw10", "xyp", "bw11", "xy0", "xy1", "xy2", "xy3", "xy4", "xy5", "dc1", "xy6", "xy7", "xy8", "xy9", "g1", "xy10", "xy11", "xy12", ...STANDARD_FORMAT_SETS ];
const STANDARD_FORMAT_SETS_STRING = STANDARD_FORMAT_SETS.join("|");
const EXPANDED_FORMAT_SETS_STRING = EXPANDED_FORMAT_SETS.join("|");

/**
 * Allows sorting of an array of objects by a key
 */
function dynamicSort(property) {
  return function(a, b) {
    return a[property].localeCompare(b[property]);
  };
}

/**
 * Generates an img tag string for an image of Pokemon type
 */
function getTypeImage(type) {
  return `<img src="${'assets/' + type.toLowerCase()}.png" />`;
}

/**
 * Get contents for Pokemon's types, including hidden values that are used for sorting
 */
function getPokemonTypes(types) {
  return types.map(type => {
    const hiddenType = `<span class="hidden">${type.toLowerCase()}</span>`
    const typeElement = getTypeImage(type);
    return `${hiddenType}${typeElement}`
  }).join('')
}

/**
 * Build a DOM string for the rows of cards
 */
function getCardsDOM(cards, damageValue) {
  return `${cards.map(card => {
    let attack = card.attacks.filter(function(attack) {
      return attack.damage.startsWith(damageValue);
    })[0];

    if(attack) {
      return `<tr>
          <td>${card.name} (${card.id})</td>
          <td>${attack.name}</td>
          <td>${getPokemonTypes(card.types)}</td>
          <td>${attack.damage}</td>
          <td>${attack.cost.map(cost => getTypeImage(cost)).join('')}</td>
          <td>${attack.text}</td>
        </tr>
        `
    }
  }
  ).join('')}`
}

//------ Main logic ------------//
var button = document.getElementById("submit");

button.addEventListener("click", function(ev) {
  ev.preventDefault();
  var damageValue = document.getElementById("damage").value;
  if (damageValue === "") return false;
  var expanded = document.getElementById("expanded").checked;
  var setQuery = "";
  if (expanded) {
    setQuery = `&setCode=${EXPANDED_FORMAT_SETS_STRING}`;
  } else {
    setQuery = `&setCode=${STANDARD_FORMAT_SETS_STRING}`;
  }

  var request = new Request(
    `https://api.pokemontcg.io/v1/cards?attackDamage=${damageValue}${setQuery}`,
    {
      headers: new Headers({
        "Page-Size": 1000
      })
    }
  );

  var hideDuplicates = document.getElementById("duplicates").checked;

  fetch(request)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var cards = data.cards;
      cards.sort(dynamicSort("name"));

      if (hideDuplicates) {
        cards = _.uniqBy(cards, c =>
          JSON.stringify([c.name, c.attacks, c.hp, c.retreatCost, c.types])
        );
      }

      const headers = [
        "Pokemon / Card",
        "Name",
        "Type",
        "Damage",
        "Cost",
        "Description"
      ];

      const table = `
        <table class="table sortable">
          <thead>
            <tr>
            ${headers.map(header => `<th>${header}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${getCardsDOM(cards, damageValue)}
          </tbody>
        </table>`;

      document.getElementById("results").innerHTML = table;

      sorttable.makeSortable(document.getElementsByTagName('table')[0]);
    });
});
