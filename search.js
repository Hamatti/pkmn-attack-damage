const STANDARD_FORMAT_SETS_STRING = "set.legalities.standard:Legal";
const EXPANDED_FORMAT_SETS_STRING = "set.legalities.expanded:Legal";

/**
 * Allows sorting of an array of objects by a key
 */
function dynamicSort(property) {
  return function (a, b) {
    return a[property].localeCompare(b[property]);
  };
}

/**
 * Generates an img tag string for an image of Pokemon type
 */
function getTypeImage(type) {
  return `<img src="${"assets/" + type.toLowerCase()}.png" />`;
}

/**
 * Get contents for Pokemon's types, including hidden values that are used for sorting
 */
function getPokemonTypes(types) {
  return types
    .map((type) => {
      const hiddenType = `<span class="hidden">${type.toLowerCase()}</span>`;
      const typeElement = getTypeImage(type);
      return `${hiddenType}${typeElement}`;
    })
    .join("");
}

/**
 * Build a DOM string for the rows of cards
 */
function getCardsDOM(cards, damageValue) {
  const dom = `${cards
    .map((card) => {
      let attack = card.attacks.filter(function (attack) {
        return attack.damage.startsWith(damageValue);
      })[0];

      if (attack) {
        return `<tr>
          <td class="card-name">${card.name} (${
          card.id
        }) <div class="card-image"><img src="${card.imageUrl}" /></div></td>
          <td>${attack.name}</td>
          <td>${getPokemonTypes(card.types)}</td>
          <td>${attack.damage}</td>
          <td>${attack.cost.map((cost) => getTypeImage(cost)).join("")}</td>
          <td>${attack.text}</td>
        </tr>
        `;
      }
    })
    .join("")}`;

  return dom;
}

//------ Main logic ------------//
var button = document.getElementById("submit");

button.addEventListener("click", function (ev) {
  ev.preventDefault();
  var damageValue = document.getElementById("damage").value;
  if (damageValue === "") return false;
  var expanded = document.getElementById("expanded").checked;
  var setQuery = "";
  if (expanded) {
    setQuery = EXPANDED_FORMAT_SETS_STRING;
  } else {
    setQuery = STANDARD_FORMAT_SETS_STRING;
  }

  var request = new Request(
    `https://api.pokemontcg.io/v2/cards?q=supertype:"Pokemon"%20attacks.damage:"${damageValue}"%20${setQuery}`,
    {
      headers: new Headers({
        "Page-Size": 1000,
      }),
    }
  );

  var hideDuplicates = document.getElementById("duplicates").checked;

  fetch(request)
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      var cards = json.data;
      cards.sort(dynamicSort("name"));

      if (hideDuplicates) {
        cards = _.uniqBy(cards, (c) =>
          JSON.stringify([c.name, c.attacks, c.hp, c.retreatCost, c.types])
        );
      }

      const headers = [
        "Pokemon / Card",
        "Name",
        "Type",
        "Damage",
        "Cost",
        "Description",
      ];

      const table = `
        <table class="table sortable">
          <thead>
            <tr>
            ${headers.map((header) => `<th>${header}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${getCardsDOM(cards, damageValue)}
          </tbody>
        </table>`;

      document.getElementById("results").innerHTML = table;

      let cardsdom = Array.prototype.slice.call(
        document.getElementsByClassName("card-name")
      );

      cardsdom.forEach((element) => {
        element.addEventListener("mouseover", (ev) => {
          const imageNode = ev.target.children[0];
          imageNode.classList.add("card-image-visible");
        });

        element.addEventListener("mouseout", (ev) => {
          const imageNode = ev.target.children[0];
          imageNode.classList.remove("card-image-visible");
        });
      });

      sorttable.makeSortable(document.getElementsByTagName("table")[0]);
    });
});
