var button = document.getElementById("submit");

function costMap(cost) {
  var _map = {
    Grass: "[G]",
    Fire: "[R]",
    Water: "[W]",
    Lightning: "[L]",
    Fighting: "[F]",
    Psychic: "[P]",
    Colorless: "[C]",
    Darkness: "[D]",
    Metal: "[M]",
    Fairy: "[Y]"
  };

  return _map[cost];
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

button.addEventListener("click", function(ev) {
  ev.preventDefault();
  var damageValue = document.getElementById("damage").value;
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

  fetch(request)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      // Remove old result
      document.getElementById("results").innerHTML = "";
      let table = document.createElement("table");
      table.className = "table";
      let thead = document.createElement("thead");
      table.appendChild(thead);

      let headers = ["Pokemon / Card", "Name", "Damage", "Cost", "Description"];
      let tr = document.createElement("tr");
      headers.map(function(header) {
        let th = document.createElement("th");
        th.appendChild(document.createTextNode(header));
        tr.appendChild(th);
      });
      thead.appendChild(tr);

      let tbody = document.createElement("tbody");
      table.appendChild(tbody);

      data.cards.map(function(card) {
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
          let costs = attack.cost.map(function(cost) {
            return costMap(cost);
          });
          attackCost.appendChild(document.createTextNode(costs.join("")));

          let attackDesc = document.createElement("td");
          attackDesc.appendChild(document.createTextNode(attack.text));

          let attackDamage = document.createElement("td");
          attackDamage.appendChild(document.createTextNode(attack.damage));

          tr.appendChild(attackName);
          tr.appendChild(attackDamage);
          tr.appendChild(attackCost);
          tr.appendChild(attackDesc);
        }

        tbody.appendChild(tr);
      });

      document.getElementById("results").appendChild(table);
    });
});
