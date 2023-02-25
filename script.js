const searchBox = document.getElementById("searchBox");
const resultContainer = document.getElementById("resultsContainer");
const itemContainer = document.getElementById("itemContainer");
let maxSearch = 5;

let priceMapForCalcs = "";

const fletchAmmoDiv = document.getElementById("fletchAmmoCalc");

let natureRune = "";
let apiUrl = "https://api.weirdgloop.org/exchange/history/osrs/latest?id=";

let apiMap = "";
let mapUrl = "https://prices.runescape.wiki/api/v1/osrs/mapping";

const headers = {
  'User-Agent': 'item_data_and_profit_calculator - @ToastedBahlahkay#2267'
}

async function getJson(url, id) { //use this function to grab latest price data for specific item using item id in game
    let response = await fetch(url + id);
    let data = await response.json()
    return data;
}

async function main() { //grabs necessary data for item searching and calcs
    //OPTION 1
    //getJson(apiUrl)
    //    .then(data => console.log(data));

    //OPTION 2
    natureRune = await getJson(apiUrl, 561)

    let test = await fetch("https://oldschool.runescape.wiki/w/Module:GEPrices/data?action=raw", {
      cache: 'default'// change to no-cache on live version
    });

    let test1 = await test.text();
    let test2 = await test1.replace("return ", "");
    let test3 = await test2.replace(/\[/g, "");
    let test4 = await test3.replace(/\]/g, "");
    let test5 = await test4.replace(/ =/g, ":");
    priceMapForCalcs = JSON.parse(test5);


    

    apiMap = await getJson(mapUrl, "");
}

main();

const searchMap = (value) => {
  let numOfResults = 0;
  if(value != "") {
    for(let i = 0; i < apiMap.length; i++) {
      if(apiMap[i].name.toLowerCase().startsWith(value)) { // compares item names to search box value
        appenedResult(apiMap[i].name, apiMap[i].icon, apiMap[i].id);
        numOfResults++;
      }
      if(numOfResults >= maxSearch) { // stops for loop after reaching maxSearch
        i = apiMap.length + 5;
      }
    }
  }
}

const appenedResult = (text, image, id) => {
  const resultDiv = document.createElement("div");
  resultDiv.classList.add("result");
  const resultImg = document.createElement("img");
  let imgSrc = image.replace(/ /g, "_");
  imgSrc = imgSrc.replace("(", "%28");
  imgSrc = imgSrc.replace(")", "%29");
  imgSrc = imgSrc.replace("'", "%27");
  resultImg.src = "https://oldschool.runescape.wiki/images/" + imgSrc;
  const resultText =  document.createElement("p");
  resultText.innerHTML = text;

  resultDiv.appendChild(resultImg);
  resultDiv.appendChild(resultText);
  resultDiv.onmousedown = function() {
    getItemInfo(id);
  }
  resultContainer.appendChild(resultDiv);
}

const getItemInfo = (itemId) => {// grabs item data from api and map 
  clearItemViewer();
  let itemData;
  let itemGeData;

  apiMap.forEach(element => {
    if(element.id == itemId) {
      itemData = element;
    }
  })

  

  fetch('https://api.weirdgloop.org/exchange/history/osrs/latest?id=' + itemId)
   .then(response => response.json())
   .then(json => {
    itemGeData = json;
    spawnNewInfoBox(itemData, itemGeData);
  })
  .catch(error => {
    console.log(error);
  });
}

const spawnNewInfoBox = (data, geData) => {//takes data from api fetch and assigns it to created elements
  const holdingDiv = document.createElement("div");

  const itemImg = document.createElement("img");
  itemImg.style.maxWidth = 128 + "px";
  itemImg.style.maxHeight = 128 + "px";
  let imgSrc = data.icon.replace(/ /g, "_");
  imgSrc = imgSrc.replace("(", "%28");
  imgSrc = imgSrc.replace(")", "%29");
  imgSrc = imgSrc.replace("'", "%27");
  imgSrc = imgSrc.replace(".png", "");
  itemImg.src = "https://oldschool.runescape.wiki/images/" + imgSrc + "_detail.png";
  holdingDiv.appendChild(itemImg);

  const itemDiv1 = document.createElement("div");
  itemDiv1.classList.add("itemInfo");
  const itemName = document.createElement("h2");
  itemName.innerHTML = data.name;
  itemDiv1.appendChild(itemName);
  const examineText = document.createElement("p");
  examineText.innerHTML = data.examine;
  itemDiv1.appendChild(examineText);
  holdingDiv.appendChild(itemDiv1);

  const itemDiv2 = document.createElement("div");
  itemDiv2.classList.add("itemInfo2");
  const gePrice = document.createElement("h2");
  gePrice.innerHTML = "GE Price: " + geData[data.id].price;
  itemDiv2.appendChild(gePrice);
  const buyLimit = document.createElement("p");
  buyLimit.innerHTML = "Buy Limit: " + data.limit;
  itemDiv2.appendChild(buyLimit);
  itemDiv2.appendChild(document.createElement("br"));
  const dailyVolume = document.createElement("p");
  dailyVolume.innerHTML = "Daily Volume: " + geData[data.id].volume;
  itemDiv2.appendChild(dailyVolume);
  holdingDiv.appendChild(itemDiv2);

  const subDiv = document.createElement("div");
  holdingDiv.appendChild(subDiv);

  const itemDiv3 = document.createElement("div");
  itemDiv3.classList.add("itemInfo3");
  const itemId = document.createElement("p");
  itemId.innerHTML = "Item Id: " + data.id;
  itemDiv3.appendChild(itemId);
  const memberBool = document.createElement("p");
  memberBool.innerHTML = "Members: " + data.members;
  itemDiv3.appendChild(memberBool);
  const timestamp = document.createElement("p");
  timestamp.innerHTML = "Time: " + geData[data.id].timestamp;
  itemDiv3.appendChild(timestamp);
  subDiv.appendChild(itemDiv3);

  const itemDiv4 = document.createElement("div");
  itemDiv4.classList.add("itemInfo4");
  const value = document.createElement("p");
  value.innerHTML = "Value: " + data.value;
  itemDiv4.appendChild(value);
  const highAlchProfit = document.createElement("p");
  highAlchProfit.innerHTML = "High Alch Profit: " + (data.highalch - (geData[data.id].price + natureRune[561].price));
  itemDiv4.appendChild(highAlchProfit);
  itemDiv4.appendChild(document.createElement("hr"));
  const lowAlch = document.createElement("p");
  lowAlch.innerHTML = "Low Alch: " + data.lowalch;
  itemDiv4.appendChild(lowAlch);
  const buyLimitAlchProfit = document.createElement("p");
  buyLimitAlchProfit.innerHTML = "Buy Limit Alch Profit: " + (data.limit * (data.highalch - (geData[data.id].price + natureRune[561].price)));
  itemDiv4.appendChild(buyLimitAlchProfit);
  itemDiv4.appendChild(document.createElement("hr"));
  const highAlch = document.createElement("p");
  highAlch.innerHTML = "High Alch: " + data.highalch; 
  itemDiv4.appendChild(highAlch);
  subDiv.appendChild(itemDiv4);

  itemContainer.appendChild(holdingDiv);
}

const createItemRow = (name, craft1, craft2) => {
  const itemRow = document.createElement("tr");

  const itemCell1 = document.createElement("td");
  itemCell1.innerHTML = name;
  itemRow.appendChild(itemCell1);

  const itemCell2 = document.createElement("td");
  const craftCost = priceMapForCalcs[craft1] + priceMapForCalcs[craft2];
  itemCell2.innerHTML = craftCost;
  itemRow.appendChild(itemCell2);

  const itemCell3 = document.createElement("td");
  const sellPrice = priceMapForCalcs[name];
  itemCell3.innerHTML = sellPrice;
  itemRow.appendChild(itemCell3);

  const itemCell4 = document.createElement("td");
  const tax = Math.ceil(sellPrice * -.01);
  itemCell4.innerHTML = tax;
  if (tax < 0) {
    itemCell4.classList.add("redText");
  } else {
    itemCell4.classList.add("greenText");
  }
  itemRow.appendChild(itemCell4);

  const itemCell5 = document.createElement("td");
  const itemProfit = sellPrice + tax - craftCost;
  itemCell5.innerHTML = itemProfit;
  if (itemProfit < 0) {
    itemCell5.classList.add("redText");
  } else {
    itemCell5.classList.add("greenText");
  }
  itemRow.appendChild(itemCell5);

  return itemRow
}

const fletchAmmoCalc = () => {
  const holdingDiv = document.createElement("div");
  itemContainer.appendChild(holdingDiv);

  const fletchCalcTable = document.createElement("table");
  holdingDiv.appendChild(fletchCalcTable);

  const tableHead = document.createElement("thead");
  fletchCalcTable.appendChild(tableHead);
  const headRow = document.createElement("tr");
  tableHead.appendChild(headRow);
  const headCell1 = document.createElement("th");
  headCell1.innerHTML = "Item";
  headRow.appendChild(headCell1);
  const headCell2 = document.createElement("th");
  headCell2.innerHTML = "Cost";
  headRow.appendChild(headCell2);
  const headCell3 = document.createElement("th");
  headCell3.innerHTML = "Sell Price";
  headRow.appendChild(headCell3);
  const headCell4 = document.createElement("th");
  headCell4.innerHTML = "Tax";
  headRow.appendChild(headCell4);
  const headCell5 = document.createElement("th");
  headCell5.innerHTML = "Profit";
  headRow.appendChild(headCell5);

  const tableBody = document.createElement("tbody");
  fletchCalcTable.appendChild(tableBody);

  let bronzeArrow = createItemRow("Bronze arrow", 'Headless arrow', 'Bronze arrowtips');
  tableBody.appendChild(bronzeArrow);
  let ironArrow = createItemRow("Iron arrow", 'Headless arrow', 'Iron arrowtips');
  tableBody.appendChild(ironArrow);
  let steelArrow = createItemRow("Steel arrow", 'Headless arrow', 'Steel arrowtips');
  tableBody.appendChild(steelArrow);
  let mithrilArrow = createItemRow("Mithril arrow", 'Headless arrow', 'Mithril arrowtips');
  tableBody.appendChild(mithrilArrow);
  let adamantArrow = createItemRow("Adamant arrow", 'Headless arrow', 'Adamant arrowtips');
  tableBody.appendChild(adamantArrow);
  let runeArrow = createItemRow("Rune arrow", 'Headless arrow', 'Rune arrowtips');
  tableBody.appendChild(runeArrow);
  let dragonArrow = createItemRow("Dragon arrow", 'Headless arrow', 'Dragon arrowtips');
  tableBody.appendChild(dragonArrow);
  let amethystArrow = createItemRow("Amethyst arrow", 'Headless arrow', 'Amethyst arrowtips');
  tableBody.appendChild(amethystArrow);
  let ogreArrow = createItemRow("Ogre arrow", 'Flighted ogre arrow', 'Wolfbone arrowtips');
  tableBody.appendChild(ogreArrow);

  let bronzeBrutal = createItemRow("Bronze brutal", 'Flighted ogre arrow', 'Bronze nails');
  tableBody.appendChild(bronzeBrutal);
  let ironBrutal = createItemRow("Iron brutal", 'Flighted ogre arrow', 'Iron nails');
  tableBody.appendChild(ironBrutal);
  let steelBrutal = createItemRow("Steel brutal", 'Flighted ogre arrow', 'Steel nails');
  tableBody.appendChild(steelBrutal);
  let blackBrutal = createItemRow("Black brutal", 'Flighted ogre arrow', 'Black nails');
  tableBody.appendChild(blackBrutal);
  let mithrilBrutal = createItemRow("Mithril brutal", 'Flighted ogre arrow', 'Mithril nails');
  tableBody.appendChild(mithrilBrutal);
  let adamantBrutal = createItemRow("Adamant brutal", 'Flighted ogre arrow', 'Adamantite nails');
  tableBody.appendChild(adamantBrutal);
  let runeBrutal = createItemRow("Rune brutal", 'Flighted ogre arrow', 'Rune nails');
  tableBody.appendChild(runeBrutal);

  let bronzeBolts = createItemRow("Bronze bolts", 'Feather', 'Bronze bolts (unf)');
  tableBody.appendChild(bronzeBolts);
  let ironBolts = createItemRow("Iron bolts", 'Feather', 'Iron bolts (unf)');
  tableBody.appendChild(ironBolts);
  let steelBolts = createItemRow("Steel bolts", 'Feather', 'Steel bolts (unf)');
  tableBody.appendChild(steelBolts);
  let mithrilBolts = createItemRow("Mithril bolts", 'Feather', 'Mithril bolts (unf)');
  tableBody.appendChild(mithrilBolts);
  let adamantBolts = createItemRow("Adamant bolts", 'Feather', 'Adamant bolts(unf)');
  tableBody.appendChild(adamantBolts);
  let runiteBolts = createItemRow("Runite bolts", 'Feather', 'Runite bolts (unf)');
  tableBody.appendChild(runiteBolts);
  let dragonBolts = createItemRow("Dragon bolts", 'Feather', 'Dragon bolts (unf)');
  tableBody.appendChild(dragonBolts);
  let broadBolts = createItemRow("Broad bolts", 'Feather', 'Unfinished broad bolts');
  tableBody.appendChild(broadBolts);
  let amethystBroadBolts = createItemRow("Amethyst broad bolts", 'Amethyst bolt tips', 'Broad bolts');
  tableBody.appendChild(amethystBroadBolts);

  let opalBolts = createItemRow("Opal bolts", 'Bronze bolts', 'Opal bolt tips');
  tableBody.appendChild(opalBolts);
  let pearlBolts = createItemRow("Pearl bolts", 'Iron bolts', 'Pearl bolt tips');
  tableBody.appendChild(pearlBolts);
  let topazBolts = createItemRow("Topaz bolts", 'Steel bolts', 'Topaz bolt tips');
  tableBody.appendChild(topazBolts);
  let sapphireBolts = createItemRow("Sapphire bolts", 'Mithril bolts', 'Sapphire bolt tips');
  tableBody.appendChild(sapphireBolts);
  let emeraldBolts = createItemRow("Emerald bolts", 'Mithril bolts', 'Emerald bolt tips');
  tableBody.appendChild(emeraldBolts);
  let rubyBolts = createItemRow("Ruby bolts", 'Adamant bolts', 'Ruby bolt tips');
  tableBody.appendChild(rubyBolts);
  let diamondBolts = createItemRow("Diamond bolts", 'Adamant bolts', 'Diamond bolt tips');
  tableBody.appendChild(diamondBolts);
  let dragonstoneBolts = createItemRow("Dragonstone bolts", 'Runite bolts', 'Dragonstone bolt tips');
  tableBody.appendChild(dragonstoneBolts);
  let onyxBolts = createItemRow("Onyx bolts", 'Runite bolts', 'Onyx bolt tips');
  tableBody.appendChild(onyxBolts);

  let opalDragonBolts = createItemRow("Opal dragon bolts", 'Dragon bolts', 'Opal bolt tips');
  tableBody.appendChild(opalDragonBolts);
  let jadeDragonBolts = createItemRow("Jade dragon bolts", 'Dragon bolts', 'Jade bolt tips');
  tableBody.appendChild(jadeDragonBolts);
  let pearlDragonBolts = createItemRow("Pearl dragon bolts", 'Dragon bolts', 'Pearl bolt tips');
  tableBody.appendChild(pearlDragonBolts);
  let topazDragonBolts = createItemRow("Topaz dragon bolts", 'Dragon bolts', 'Topaz bolt tips');
  tableBody.appendChild(topazDragonBolts);
  let sapphireDragonBolts = createItemRow("Sapphire dragon bolts", 'Dragon bolts', 'Sapphire bolt tips');
  tableBody.appendChild(sapphireDragonBolts);
  let emeraldDragonBolts = createItemRow("Emerald dragon bolts", 'Dragon bolts', 'Emerald bolt tips');
  tableBody.appendChild(emeraldDragonBolts);
  let rubyDragonBolts = createItemRow("Ruby dragon bolts", 'Dragon bolts', 'Ruby bolt tips');
  tableBody.appendChild(rubyDragonBolts);
  let diamondDragonBolts = createItemRow("Diamond dragon bolts", 'Dragon bolts', 'Diamond bolt tips');
  tableBody.appendChild(diamondDragonBolts);
  let dragonstoneDragonBolts = createItemRow("Dragonstone dragon bolts", 'Dragon bolts', 'Dragonstone bolt tips');
  tableBody.appendChild(dragonstoneDragonBolts);
  let onyxDragonBolts = createItemRow("Onyx dragon bolts", 'Dragon bolts', 'Onyx bolt tips');
  tableBody.appendChild(onyxDragonBolts);

  let bronzeDart = createItemRow("Bronze dart", 'Feather', 'Bronze dart tip');
  tableBody.appendChild(bronzeDart);
  let ironDart = createItemRow("Iron dart", 'Feather', 'Iron dart tip');
  tableBody.appendChild(ironDart);
  let steelDart = createItemRow("Steel dart", 'Feather', 'Steel dart tip');
  tableBody.appendChild(steelDart);
  let mithrilDart = createItemRow("Mithril dart", 'Feather', 'Mithril dart tip');
  tableBody.appendChild(mithrilDart);
  let adamantDart = createItemRow("Adamant dart", 'Feather', 'Adamant dart tip');
  tableBody.appendChild(adamantDart);
  let runeDart = createItemRow("Rune dart", 'Feather', 'Rune dart tip');
  tableBody.appendChild(runeDart);
  let dragonDart = createItemRow("Dragon dart", 'Feather', 'Dragon dart tip');
  tableBody.appendChild(dragonDart);
  let amethystDart = createItemRow("Amethyst dart", 'Feather', 'Amethyst dart tip');
  tableBody.appendChild(amethystDart);

  let bronzeJavelin = createItemRow("Bronze javelin", 'Javelin shaft', 'Bronze javelin heads');
  tableBody.appendChild(bronzeJavelin);
  let ironJavelin = createItemRow("Iron javelin", 'Javelin shaft', 'Iron javelin heads');
  tableBody.appendChild(ironJavelin);
  let steelJavelin = createItemRow("Steel javelin", 'Javelin shaft', 'Steel javelin heads');
  tableBody.appendChild(steelJavelin);
  let mithrilJavelin = createItemRow("Mithril javelin", 'Javelin shaft', 'Mithril javelin heads');
  tableBody.appendChild(mithrilJavelin);
  let adamantJavelin = createItemRow("Adamant javelin", 'Javelin shaft', 'Adamant javelin heads');
  tableBody.appendChild(adamantJavelin);
  let runeJavelin = createItemRow("Rune javelin", 'Javelin shaft', 'Rune javelin heads');
  tableBody.appendChild(runeJavelin);
  let dragonJavelin = createItemRow("Dragon javelin", 'Javelin shaft', 'Dragon javelin heads');
  tableBody.appendChild(dragonJavelin);

  const rows = Array.from(fletchCalcTable.rows);
  
  rows.sort((row1, row2) => {// sorts by profit highest to lowest
    const value1 = parseInt(row1.cells[row1.cells.length - 1].textContent);
    const value2 = parseInt(row2.cells[row2.cells.length - 1].textContent);
    return value2 - value1;
  });
  
  fletchCalcTable.innerHTML = '';
  for (const row of rows) {
    fletchCalcTable.appendChild(row);
  }
}

const clearItemViewer = () => {
  while(itemContainer.firstChild) {
    itemContainer.removeChild(itemContainer.lastChild);
  }
}
const clearResults = () => {
  while(resultContainer.firstChild) {
    resultContainer.removeChild(resultContainer.lastChild);
  }
}

searchBox.onblur = function() {
  clearResults();
}
searchBox.onfocus = function() {
  searchMap(searchBox.value);
}
searchBox.onkeyup = function() { // start search on key up
  clearResults();
  searchMap(searchBox.value);
}
fletchAmmoDiv.onclick = function() {
  clearItemViewer();
  fletchAmmoCalc();
}