function dynamicSort(property) {
  return function(a, b) {
    return a[property].localeCompare(b[property]);
  };
}

function costMap(cost) {
  const node = document.createElement("img");
  node.src = `assets/${cost.toLowerCase()}.png`;
  return node;
}

var STANDARD_FORMAT_SETS = [
  "sm1",
  "smp",
  "sm2",
  "sm3",
  "sm35",
  "sm4",
  "sm5",
  "sm6",
  "sm7",
  "sm75",
  "sm8"
].join("|");

var EXPANDED_FORMAT_SETS = [
  "bwp",
  "bw1",
  "bw2",
  "bw3",
  "bw4",
  "bw5",
  "bw6",
  "dv1",
  "bw7",
  "bw8",
  "bw9",
  "bw10",
  "xyp",
  "bw11",
  "xy0",
  "xy1",
  "xy2",
  "xy3",
  "xy4",
  "xy5",
  "dc1",
  "xy6",
  "xy7",
  "xy8",
  "xy9",
  "g1",
  "xy10",
  "xy11",
  "xy12",
  "smp",
  "sm1",
  "sm2",
  "sm3",
  "sm35",
  "sm4",
  "sm5",
  "sm6",
  "sm7",
  "sm75",
  "sm8"
].join("|");

var button = document.getElementById("submit");

button.addEventListener("click", function(ev) {
  ev.preventDefault();
  var damageValue = document.getElementById("damage").value;
  if (damageValue === '') return false;
  var expanded = document.getElementById("expanded").checked;
  var setQuery = "";
  if (expanded) {
    setQuery = `&setCode=${EXPANDED_FORMAT_SETS}`;
  } else {
    setQuery = `&setCode=${STANDARD_FORMAT_SETS}`;
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
      // Remove old result
      document.getElementById("results").innerHTML = "";

      var cards = data.cards;
      cards.sort(dynamicSort("name"));

      if (hideDuplicates) {
        cards = _.uniqBy(cards, c =>
          JSON.stringify([c.name, c.attacks, c.hp, c.retreatCost, c.types])
        );
      }

      let table = document.createElement("table");
      table.className = "table sortable";
      let thead = document.createElement("thead");
      table.appendChild(thead);

      let headers = [
        "Pokemon / Card",
        "Name",
        "Type",
        "Damage",
        "Cost",
        "Description"
      ];
      let tr = document.createElement("tr");
      headers.map(function(header) {
        let th = document.createElement("th");
        th.appendChild(document.createTextNode(header));
        tr.appendChild(th);
      });
      thead.appendChild(tr);

      let tbody = document.createElement("tbody");
      table.appendChild(tbody);

      cards.map(function(card) {
        let tr = document.createElement("tr");
        let id = document.createElement("td");
        id.appendChild(document.createTextNode(`${card.name} (${card.id})`));

        let attack = card.attacks.filter(function(attack) {
          return attack.damage.startsWith(damageValue);
        })[0];

        tr.appendChild(id);
        if (attack) {
          let attackName = document.createElement("td");
          attackName.appendChild(document.createTextNode(attack.name));

          let attackCost = document.createElement("td");
          let costString = "";
          attack.cost.forEach(function(cost) {
            attackCost.appendChild(costMap(cost));
          });

          let attackDesc = document.createElement("td");
          attackDesc.appendChild(document.createTextNode(attack.text));

          let attackDamage = document.createElement("td");
          attackDamage.appendChild(document.createTextNode(attack.damage));

          let pokemonType = document.createElement("td");
          card.types.forEach(function(type) {
            const child = costMap(type);
            const hidden_type = document.createElement("span");
            hidden_type.appendChild(
              document.createTextNode(type.toLowerCase())
            );
            hidden_type.className = "hidden";
            pokemonType.appendChild(hidden_type);
            child.setAttribute("sorttable_customkey", type);
            pokemonType.appendChild(child);
          });

          tr.appendChild(attackName);
          tr.appendChild(pokemonType);
          tr.appendChild(attackDamage);
          tr.appendChild(attackCost);
          tr.appendChild(attackDesc);
        }

        tbody.appendChild(tr);
      });

      document.getElementById("results").appendChild(table);
      sorttable.makeSortable(table);
    });
});
