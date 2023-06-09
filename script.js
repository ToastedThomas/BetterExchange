const searchBox = document.getElementById("searchBox");
const resultContainer = document.getElementById("resultsContainer");
const itemContainer = document.getElementById("itemContainer");

let maxSearch = 5;

let degrimeBool = false;
let herbAmount = 1;
let natureAmount = 0;

let plankSpellBool = false;

let priceMapForCalcs = "";

const fletchAmmoDiv = document.getElementById("fletchAmmoCalc");
const cookingFoodDiv = document.getElementById("cookingCalc");
const herbCleaningDiv = document.getElementById("herbCleaningCalc");
const plankMakingDiv = document.getElementById("plankMakingCalc");
const fruitPackageDiv = document.getElementById("fruitPackaging");
const gemBoltTipsDiv = document.getElementById("gemBoltTips");
const craftingJewelleryDiv = document.getElementById("craftingJewellery");

let natureRune = "";
let apiUrl = "https://api.weirdgloop.org/exchange/history/osrs/latest?id="; //this gets ge guide price and daily volume of specific item

let apiMap = "";
let mapUrl = "https://prices.runescape.wiki/api/v1/osrs/mapping"; //this provides basic item info i.e. 'examine text' 'low alch value' 'buy limit' 

let offerMap = "";
let offerUrl = "https://prices.runescape.wiki/api/v1/osrs/latest"; //this gets latest insta-buy/sell prices used for flipping offers

let volumeInfo = "";
let volumeUrl = "https://prices.runescape.wiki/api/v1/osrs/1h"; //this link gets the buy/sell volumes for every item in the last 1hr

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
    offerMap = await fetch(offerUrl, {
      cache: 'no-cache'
    }).then(response => {
      return response.json();
    })
    
    let test = await fetch("https://oldschool.runescape.wiki/w/Module:GEPrices/data.json?action=raw", {//this api call gets only name and the ge guide price
      cache: 'no-cache'// change to no-cache on live version
    });

    let test1 = await test.text();
    let test2 = await test1.replace("return ", "");
    let test3 = await test2.replace(/\[/g, "");
    let test4 = await test3.replace(/\]/g, "");
    let test5 = await test4.replace(/ =/g, ":");
    priceMapForCalcs = JSON.parse(test5);


    volumeInfo = await getJson(volumeUrl, "");
    console.log(volumeInfo)

    apiMap = await getJson(mapUrl, "");
}

main();

const unixToReadable = (unix) => {
  let unixDate = new Date(unix * 1000);
  console.log(unix);
  console.log(unixDate);
  let nowDate = new Date();
  console.log(nowDate);
  let diff = Math.floor((nowDate.getTime() - unixDate.getTime()) / 1000);
  console.log(diff);
  if(diff >= 60) {
    return "about " + Math.floor(diff / 60) + " minute(s) ago";
  } else {
    return "about " + diff + " seconds ago";
  }
  return diff;
}

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

const createPriceGraph = () => {
  const holdingDiv = document.createElement("div");

  const titleDiv = document.createElement("div");
  holdingDiv.appendChild(titleDiv);
  const title = document.createElement("h2");
  title.innerHTML = "Price graph";
  titleDiv.appendChild(title);

  holdingDiv.appendChild(document.createElement("hr"));



  return holdingDiv;
}

const spawnNewInfoBox = (data, geData) => {//takes data from api fetch and assigns it to created elements
  const holdingDiv = document.createElement("div");

  const subDiv = document.createElement("div");
  subDiv.classList.add("subDiv");
  holdingDiv.appendChild(subDiv);

  const itemImg = document.createElement("img");
  itemImg.style.maxWidth = 128 + "px";
  itemImg.style.maxHeight = 128 + "px";
  let imgSrc = data.icon.replace(/ /g, "_");
  imgSrc = imgSrc.replace("(", "%28");
  imgSrc = imgSrc.replace(")", "%29");
  imgSrc = imgSrc.replace("'", "%27");
  imgSrc = imgSrc.replace(".png", "");
  itemImg.src = "https://oldschool.runescape.wiki/images/" + imgSrc + "_detail.png";
  subDiv.appendChild(itemImg);

  const itemDiv1 = document.createElement("div");
  itemDiv1.classList.add("itemInfo");
  const itemName = document.createElement("h2");
  itemName.innerHTML = data.name;
  itemDiv1.appendChild(itemName);
  const examineText = document.createElement("p");
  examineText.innerHTML = data.examine;
  itemDiv1.appendChild(examineText);
  subDiv.appendChild(itemDiv1);

  const itemDiv2 = document.createElement("div");
  itemDiv2.classList.add("itemInfo2");
  const gePrice = document.createElement("h2");
  gePrice.innerHTML = "GE Price: " + geData[data.id].price;
  itemDiv2.appendChild(gePrice);
  itemDiv2.appendChild(document.createElement("br"));
  const buyLimit = document.createElement("p");
  buyLimit.innerHTML = "Buy Limit: " + data.limit;
  itemDiv2.appendChild(buyLimit);
  itemDiv2.appendChild(document.createElement("br"));
  const dailyVolume = document.createElement("p");
  dailyVolume.innerHTML = "Daily Volume: " + geData[data.id].volume;
  itemDiv2.appendChild(dailyVolume);
  subDiv.appendChild(itemDiv2);

  const subDiv2 = document.createElement("div");
  holdingDiv.appendChild(subDiv2);

  const itemDiv3 = document.createElement("div");
  itemDiv3.classList.add("itemInfo3");
  itemDiv3.classList.add("subDiv");
  const itemId = document.createElement("p");
  itemId.innerHTML = "Item Id: " + data.id;
  itemDiv3.appendChild(itemId);
  const memberBool = document.createElement("p");
  memberBool.innerHTML = "Members: " + data.members;
  itemDiv3.appendChild(memberBool);
  const timestamp = document.createElement("p");
  timestamp.innerHTML = "GE Update: " + unixToReadable(new Date(geData[data.id].timestamp).getTime() / 1000);
  itemDiv3.appendChild(timestamp);
  subDiv2.appendChild(itemDiv3);
  console.log(new Date(geData[data.id].timestamp));

  const itemDiv4 = document.createElement("div");
  itemDiv4.classList.add("itemInfo4");
  itemDiv4.classList.add("subDiv");
  const value = document.createElement("p");
  value.innerHTML = "Value: " + data.value;
  itemDiv4.appendChild(value);
  const highAlchProfit = document.createElement("p");
  highAlchProfit.innerHTML = "High Alch Profit: " + (data.highalch - (offerMap.data[data.id].low + offerMap.data[561].low));
  itemDiv4.appendChild(highAlchProfit);
  itemDiv4.appendChild(document.createElement("hr"));
  const lowAlch = document.createElement("p");
  lowAlch.innerHTML = "Low Alch: " + data.lowalch;
  itemDiv4.appendChild(lowAlch);
  const buyLimitAlchProfit = document.createElement("p");
  buyLimitAlchProfit.innerHTML = "Buy Limit Alch Profit: " + (data.limit * (data.highalch - (offerMap.data[data.id].low + offerMap.data[561].low)));
  itemDiv4.appendChild(buyLimitAlchProfit);
  itemDiv4.appendChild(document.createElement("hr"));
  const highAlch = document.createElement("p");
  highAlch.innerHTML = "High Alch: " + data.highalch; 
  itemDiv4.appendChild(highAlch);
  const empty = document.createElement("p");
  itemDiv4.appendChild(empty);
  itemDiv4.appendChild(document.createElement("hr"));
  const approxBuy = document.createElement("p");
  approxBuy.innerHTML = "Approx. buy price: " + offerMap.data[data.id].low;
  itemDiv4.appendChild(approxBuy);
  const lastBuy = document.createElement("p");
  lastBuy.innerHTML = "Last buy time: " + unixToReadable(offerMap.data[data.id].lowTime);
  itemDiv4.appendChild(lastBuy);
  itemDiv4.appendChild(document.createElement("hr"));
  const approxSell = document.createElement("p");
  approxSell.innerHTML = "Approx. sell price: " + offerMap.data[data.id].high;
  itemDiv4.appendChild(approxSell);
  const lastSell = document.createElement("p");
  lastSell.innerHTML = "Last sell time: " + unixToReadable(offerMap.data[data.id].highTime);
  itemDiv4.appendChild(lastSell);
  itemDiv4.appendChild(document.createElement("hr"));
  const taxText = document.createElement("p");
  taxText.innerHTML = "Tax: " + Math.ceil(offerMap.data[data.id].high * -.01);
  itemDiv4.appendChild(taxText);
  const flipProfit = document.createElement("p");
  flipProfit.innerHTML = "Flipping profit: " + (offerMap.data[data.id].high + Math.ceil(offerMap.data[data.id].high * -.01) - offerMap.data[data.id].low);
  itemDiv4.appendChild(flipProfit);
  subDiv2.appendChild(itemDiv4);

  itemContainer.appendChild(holdingDiv);

  //const priceGraph = createPriceGraph();
 // itemContainer.appendChild(priceGraph);
}

const nameToId = (element) => {
  for(let i = 0; i < apiMap.length; i++) {
    if(apiMap[i].name == element) {
      return apiMap[i].id;
    }
  }
}

const createTableHead = () => {
  const tableHead = document.createElement("thead");
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
  const headCell6 = document.createElement("th");
  headCell6.innerHTML = "Buying Volume (per hour)";
  headRow.appendChild(headCell6);
  const headCell7 = document.createElement("th");
  headCell7.innerHTML = "Selling Volume (per hour)";
  headRow.appendChild(headCell7);

  return tableHead;
}

const createItemRow = (name, craft1, craft2, craft3, nameVar) => {
  const product = nameToId(name);
  const item1 = nameToId(craft1);
  const item2 = nameToId(craft2);
  if(craft3) {
    var item3 = nameToId(craft3);
  }

  const itemRow = document.createElement("tr");

  const itemCell1 = document.createElement("td");
  if(nameVar) {
    itemCell1.innerHTML = name + nameVar;
  } else {
    itemCell1.innerHTML = name;
  }
  itemRow.appendChild(itemCell1);

  const itemCell2 = document.createElement("td");
  if(craft2 && craft3) {
    var craftCost = offerMap.data[item1].low + offerMap.data[item2].low + offerMap.data[item3].low;
  } else if(craft2) {
    var craftCost = offerMap.data[item1].low + offerMap.data[item2].low;
  } else {
    var craftCost = offerMap.data[item1].low;
  }
  itemCell2.innerHTML = craftCost;
  itemRow.appendChild(itemCell2);

  const itemCell3 = document.createElement("td");
  const sellPrice = offerMap.data[product].high;
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

  const itemCell6 = document.createElement("td");
  let highVolume;
  if (!volumeInfo.data.hasOwnProperty(product)) {
    highVolume = 0;
  } else {
    highVolume = volumeInfo.data[product].highPriceVolume
  }
  itemCell6.innerHTML = highVolume;
  itemRow.appendChild(itemCell6);

  const itemCell7 = document.createElement("td");
  let lowVolume;
  if (!volumeInfo.data.hasOwnProperty(product)) {
    lowVolume = 0;
  } else {
    lowVolume = volumeInfo.data[product].lowPriceVolume
  }
  itemCell7.innerHTML = lowVolume;
  itemRow.appendChild(itemCell7);

  return itemRow
}
const createItemRow2 = (numMade, name, num1, craft1, num2, craft2, nameVar) => {
  const product = nameToId(name);
  const item1 = nameToId(craft1);
  const item2 = nameToId(craft2);

  const itemRow = document.createElement("tr");

  const itemCell1 = document.createElement("td");
  if(nameVar) {
    itemCell1.innerHTML = name + nameVar;
  } else {
    itemCell1.innerHTML = name;
  }
  itemRow.appendChild(itemCell1);

  const itemCell2 = document.createElement("td");
  if(craft2) {
    var craftCost = (offerMap.data[item1].low * num1) + (offerMap.data[item2].low * num2);
  } else {
    var craftCost = offerMap.data[item1].low * num1;
  }
  itemCell2.innerHTML = craftCost;
  itemRow.appendChild(itemCell2);

  const itemCell3 = document.createElement("td");
  const sellPriceEach = offerMap.data[product].high;
  const sellPriceTotal = offerMap.data[product].high * numMade;
  itemCell3.innerHTML = sellPriceTotal;
  itemRow.appendChild(itemCell3);

  const itemCell4 = document.createElement("td");
  const tax = Math.ceil(sellPriceEach * -.01) * numMade;
  itemCell4.innerHTML = tax;
  if (tax < 0) {
    itemCell4.classList.add("redText");
  } else {
    itemCell4.classList.add("greenText");
  }
  itemRow.appendChild(itemCell4);

  const itemCell5 = document.createElement("td");
  const itemProfit = sellPriceTotal + tax - craftCost;
  itemCell5.innerHTML = itemProfit;
  if (itemProfit < 0) {
    itemCell5.classList.add("redText");
  } else {
    itemCell5.classList.add("greenText");
  }
  itemRow.appendChild(itemCell5);

  const itemCell6 = document.createElement("td");
  let highVolume;
  if (!volumeInfo.data.hasOwnProperty(product)) {
    highVolume = 0;
  } else {
    highVolume = volumeInfo.data[product].highPriceVolume
  }
  itemCell6.innerHTML = highVolume;
  itemRow.appendChild(itemCell6);

  const itemCell7 = document.createElement("td");
  let lowVolume;
  if (!volumeInfo.data.hasOwnProperty(product)) {
    lowVolume = 0;
  } else {
    lowVolume = volumeInfo.data[product].lowPriceVolume
  }
  itemCell7.innerHTML = lowVolume;
  itemRow.appendChild(itemCell7);

  return itemRow
}
const createHerbRow = (name, craft1) => {
  const product = nameToId(name);
  const item1 = nameToId(craft1);

  const itemRow = document.createElement("tr");

  const itemCell1 = document.createElement("td");
  itemCell1.innerHTML = name;
  itemRow.appendChild(itemCell1);

  const itemCell2 = document.createElement("td");
  if(degrimeBool) {
    var craftCost = (offerMap.data[item1].low * 27) + (offerMap.data[561].low * 2);
  } else {
    var craftCost = offerMap.data[item1].low;
  }
  itemCell2.innerHTML = craftCost;
  itemRow.appendChild(itemCell2);

  const itemCell3 = document.createElement("td");
  if(degrimeBool) {
    var sellPrice = offerMap.data[product].high * 27;
  } else {
    var sellPrice = offerMap.data[product].high;
  }
  itemCell3.innerHTML = sellPrice;
  itemRow.appendChild(itemCell3);

  const itemCell4 = document.createElement("td");
  if(degrimeBool) {
    var tax = Math.ceil((sellPrice / 27) * -.01) * 27;
  } else {
    var tax = Math.ceil(sellPrice * -.01);
  }
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

  const itemCell6 = document.createElement("td");
  let highVolume;
  if (!volumeInfo.data.hasOwnProperty(product)) {
    highVolume = 0;
  } else {
    highVolume = volumeInfo.data[product].highPriceVolume
  }
  itemCell6.innerHTML = highVolume;
  itemRow.appendChild(itemCell6);

  const itemCell7 = document.createElement("td");
  let lowVolume;
  if (!volumeInfo.data.hasOwnProperty(product)) {
    lowVolume = 0;
  } else {
    lowVolume = volumeInfo.data[product].lowPriceVolume
  }
  itemCell7.innerHTML = lowVolume;
  itemRow.appendChild(itemCell7);

  return itemRow
}
const createPlankRow = (name, craft1, coins) => {
  const product = nameToId(name);
  const item1 = nameToId(craft1);

  const itemRow = document.createElement("tr");

  const itemCell1 = document.createElement("td");
  itemCell1.innerHTML = name;
  itemRow.appendChild(itemCell1);

  const itemCell2 = document.createElement("td");
  if(plankSpellBool) {
    var craftCost = offerMap.data[item1].low + (coins * .7) + offerMap.data[561].low + (offerMap.data[9075].low * 2); //561 is item Id for nature runes and 9075 is for astral runes
  } else {
    var craftCost = offerMap.data[item1].low + coins;
  }
  itemCell2.innerHTML = craftCost;
  itemRow.appendChild(itemCell2);

  const itemCell3 = document.createElement("td");
  const sellPrice = offerMap.data[product].high;
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

  const itemCell6 = document.createElement("td");
  let highVolume;
  if (!volumeInfo.data.hasOwnProperty(product)) {
    highVolume = 0;
  } else {
    highVolume = volumeInfo.data[product].highPriceVolume
  }
  itemCell6.innerHTML = highVolume;
  itemRow.appendChild(itemCell6);

  const itemCell7 = document.createElement("td");
  let lowVolume;
  if (!volumeInfo.data.hasOwnProperty(product)) {
    lowVolume = 0;
  } else {
    lowVolume = volumeInfo.data[product].lowPriceVolume
  }
  itemCell7.innerHTML = lowVolume;
  itemRow.appendChild(itemCell7);

  return itemRow
}

const fletchAmmoCalc = () => {
  const holdingDiv = document.createElement("div");
  itemContainer.appendChild(holdingDiv);

  const title = document.createElement("h2");
  title.innerHTML = 'Fletching ammo';
  title.classList.add("calcTitle");
  holdingDiv.appendChild(title);

  const fletchCalcTable = document.createElement("table");
  holdingDiv.appendChild(fletchCalcTable);

  const tableHead = createTableHead();
  fletchCalcTable.appendChild(tableHead);

  const tableBody = document.createElement("tbody");
  fletchCalcTable.appendChild(tableBody);

  let headlessArrow = createItemRow("Headless arrow", 'Arrow shaft', 'Feather');
  tableBody.appendChild(headlessArrow);
  let arrowShaftLogs = createItemRow2(15, "Arrow shaft", 1, 'Logs', null, null, " (logs)");
  tableBody.appendChild(arrowShaftLogs);
  let arrowShaftOak = createItemRow2(30, "Arrow shaft", 1, 'Oak logs', null, null, " (oak logs)");
  tableBody.appendChild(arrowShaftOak);
  let arrowShaftWillow = createItemRow2(45, "Arrow shaft", 1, 'Willow logs', null, null, " (willow logs)");
  tableBody.appendChild(arrowShaftWillow);
  let arrowShaftMaple = createItemRow2(60, "Arrow shaft", 1, 'Maple logs', null, null, " (maple logs)");
  tableBody.appendChild(arrowShaftMaple);
  let arrowShaftYew = createItemRow2(75, "Arrow shaft", 1, 'Yew logs', null, null, " (yew logs)");
  tableBody.appendChild(arrowShaftYew);
  let arrowShaftMagic = createItemRow2(90, "Arrow shaft", 1, 'Magic logs', null, null, " (magic logs)");
  tableBody.appendChild(arrowShaftMagic);
  let arrowShaftRed = createItemRow2(105, "Arrow shaft", 1, 'Redwood logs', null, null, " (redwood logs)");
  tableBody.appendChild(arrowShaftRed);

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
    const value1 = parseInt(row1.cells[row1.cells.length - 3].textContent);
    const value2 = parseInt(row2.cells[row2.cells.length - 3].textContent);
    return value2 - value1;
  });
  
  fletchCalcTable.innerHTML = '';
  for (const row of rows) {
    fletchCalcTable.appendChild(row);
  }
}
const gemBoltTipsCalc = () => {
  const holdingDiv = document.createElement("div");
  itemContainer.appendChild(holdingDiv);

  const title = document.createElement("h2");
  title.innerHTML = 'Cutting bolt tips';
  title.classList.add("calcTitle");
  holdingDiv.appendChild(title);

  const gemBoltTipCalcTable = document.createElement("table");
  holdingDiv.appendChild(gemBoltTipCalcTable);

  const tableHead = createTableHead();
  gemBoltTipCalcTable.appendChild(tableHead);

  const tableBody = document.createElement("tbody");
  gemBoltTipCalcTable.appendChild(tableBody);

  let opalBoltTips = createItemRow2(12, "Opal bolt tips", 1, "Opal", null, null, null);
  tableBody.appendChild(opalBoltTips);
  let jadeBoltTips = createItemRow2(12, "Jade bolt tips", 1, "Jade", null, null, null);
  tableBody.appendChild(jadeBoltTips);
  let pearlBoltTips1 = createItemRow2(6, "Pearl bolt tips", 1, "Oyster pearl", null, null, " (oyster pearl)");
  tableBody.appendChild(pearlBoltTips1);
  let pearlBoltTips2 = createItemRow2(24, "Pearl bolt tips", 1, "Oyster pearls", null, null, " (oyster pearls)");
  tableBody.appendChild(pearlBoltTips2);
  let topazBoltTips = createItemRow2(12, "Topaz bolt tips", 1, "Red topaz", null, null, null);
  tableBody.appendChild(topazBoltTips);
  let sapphireBoltTips = createItemRow2(12, "Sapphire bolt tips", 1, "Sapphire", null, null, null);
  tableBody.appendChild(sapphireBoltTips);
  let emeraldBoltTips = createItemRow2(12, "Emerald bolt tips", 1, "Emerald", null, null, null);
  tableBody.appendChild(emeraldBoltTips);
  let rubyBoltTips = createItemRow2(12, "Ruby bolt tips", 1, "Ruby", null, null, null);
  tableBody.appendChild(rubyBoltTips);
  let diamondBoltTips = createItemRow2(12, "Diamond bolt tips", 1, "Diamond", null, null, null);
  tableBody.appendChild(diamondBoltTips);
  let dragonstoneBoltTips = createItemRow2(12, "Dragonstone bolt tips", 1, "Dragonstone", null, null, null);
  tableBody.appendChild(dragonstoneBoltTips);
  let onyxBoltTips = createItemRow2(12, "Onyx bolt tips", 1, "Onyx", null, null, null);
  tableBody.appendChild(onyxBoltTips);
  let amethystBoltTips = createItemRow2(15, "Amethyst bolt tips", 1, "Amethyst", null, null, null);
  tableBody.appendChild(amethystBoltTips);


  const rows = Array.from(gemBoltTipCalcTable.rows);
  
  rows.sort((row1, row2) => {// sorts by profit highest to lowest
    const value1 = parseInt(row1.cells[row1.cells.length - 3].textContent);
    const value2 = parseInt(row2.cells[row2.cells.length - 3].textContent);
    return value2 - value1;
  });
  
  gemBoltTipCalcTable.innerHTML = '';
  for (const row of rows) {
    gemBoltTipCalcTable.appendChild(row);
  }
}
const cookingProfitCalc = () => {
  const holdingDiv = document.createElement("div");
  itemContainer.appendChild(holdingDiv);

  const title = document.createElement("h2");
  title.innerHTML = 'Cooking food';
  title.classList.add("calcTitle");
  holdingDiv.appendChild(title);

  const cookCalcTable = document.createElement("table");
  holdingDiv.appendChild(cookCalcTable);

  const tableHead = createTableHead();
  cookCalcTable.appendChild(tableHead);

  const tableBody = document.createElement("tbody");
  cookCalcTable.appendChild(tableBody);

  let cookedMeatBeef = createItemRow("Cooked meat", 'Raw beef', null, null, " (raw beef)");
  tableBody.appendChild(cookedMeatBeef);
  let cookedMeatBear = createItemRow("Cooked meat", 'Raw bear meat', null, null, " (raw bear meat)");
  tableBody.appendChild(cookedMeatBear);
  let cookedMeatBoar = createItemRow("Cooked meat", 'Raw boar meat', null, null, " (raw boar meat)");
  tableBody.appendChild(cookedMeatBoar);
  let cookedMeatRat = createItemRow("Cooked meat", 'Raw rat meat', null, null, " (raw rat meat)");
  tableBody.appendChild(cookedMeatRat);
  let cookedMeatYak = createItemRow("Cooked meat", 'Raw yak meat', null, null, " (raw yak meat)");
  tableBody.appendChild(cookedMeatYak);

  let sinewBeef = createItemRow("Sinew", 'Raw beef', null, null, " (raw beef)");
  tableBody.appendChild(sinewBeef);
  let sinewBear = createItemRow("Sinew", 'Raw bear meat', null, null, " (raw bear meat)");
  tableBody.appendChild(sinewBear);
  let sinewBoar = createItemRow("Sinew", 'Raw boar meat', null, null, " (raw boar meat)");
  tableBody.appendChild(sinewBoar);
  let sinewMonkey = createItemRow("Sinew", 'Damaged monkey tail', null, null, " (damaged monkey tail)");
  tableBody.appendChild(sinewMonkey);

  let shrimps = createItemRow("Shrimps", "Raw shrimps");
  tableBody.appendChild(shrimps);
  let cookedChicken = createItemRow("Cooked chicken", "Raw chicken");
  tableBody.appendChild(cookedChicken);
  let cookedRabbit = createItemRow("Cooked rabbit", "Raw rabbit");
  tableBody.appendChild(cookedRabbit);
  let roastRabbit = createItemRow("Roast rabbit", "Raw rabbit");
  tableBody.appendChild(roastRabbit);
  let roastBirdMeat = createItemRow("Roast bird meat", "Raw bird meat");
  tableBody.appendChild(roastBirdMeat);
  let anchovies = createItemRow("Anchovies", "Raw anchovies");
  tableBody.appendChild(anchovies);
  let sardine = createItemRow("Sardine", "Raw sardine");
  tableBody.appendChild(sardine);
  let ugthankiMeat = createItemRow("Ugthanki meat", "Raw ugthanki meat");
  tableBody.appendChild(ugthankiMeat);
  let herring = createItemRow("Herring", "Raw herring");
  tableBody.appendChild(herring);
  let mackerel = createItemRow("Mackerel", "Raw mackerel");
  tableBody.appendChild(mackerel);
  let trout = createItemRow("Trout", "Raw trout");
  tableBody.appendChild(trout);
  let thinSnailMeat = createItemRow("Thin snail meat", "Thin snail");
  tableBody.appendChild(thinSnailMeat);
  let leanSnailMeat = createItemRow("Lean snail meat", "Lean snail");
  tableBody.appendChild(leanSnailMeat);
  let fatSnailMeat = createItemRow("Fat snail meat", "Fat snail");
  tableBody.appendChild(fatSnailMeat);
  let cod = createItemRow("Cod", "Raw cod");
  tableBody.appendChild(cod);
  let pike = createItemRow("Pike", "Raw pike");
  tableBody.appendChild(pike);
  let roastBeastMeat = createItemRow("Roast beast meat", "Raw beast meat");
  tableBody.appendChild(roastBeastMeat);
  let salmon = createItemRow("Salmon", "Raw salmon");
  tableBody.appendChild(salmon);
  let cookedSlimyEel = createItemRow("Cooked slimy eel", "Raw slimy eel");
  tableBody.appendChild(cookedSlimyEel);
  let tuna = createItemRow("Tuna", "Raw tuna");
  tableBody.appendChild(tuna);
  let cookedKarambwan = createItemRow("Cooked karambwan", "Raw karambwan");
  tableBody.appendChild(cookedKarambwan);
  let cookedChompy = createItemRow("Cooked chompy", "Raw chompy");
  tableBody.appendChild(cookedChompy);
  let rainbowFish = createItemRow("Rainbow fish", "Raw rainbow fish");
  tableBody.appendChild(rainbowFish);
  let caveEel = createItemRow("Cave eel", "Raw cave eel");
  tableBody.appendChild(caveEel);
  let lobster = createItemRow("Lobster", "Raw lobster");
  tableBody.appendChild(lobster);
  let cookedJubbly = createItemRow("Cooked jubbly", "Raw jubbly");
  tableBody.appendChild(cookedJubbly);
  let bass = createItemRow("Bass", "Raw bass");
  tableBody.appendChild(bass);
  let swordfish = createItemRow("Swordfish", "Raw swordfish");
  tableBody.appendChild(swordfish);
  let monkfish = createItemRow("Monkfish", "Raw monkfish");
  tableBody.appendChild(monkfish);
  let shark = createItemRow("Shark", "Raw shark");
  tableBody.appendChild(shark);
  let seaTurtle = createItemRow("Sea turtle", "Raw sea turtle");
  tableBody.appendChild(seaTurtle);
  let anglerfish = createItemRow("Anglerfish", "Raw anglerfish");
  tableBody.appendChild(anglerfish);
  let darkCrab = createItemRow("Dark crab", "Raw dark crab");
  tableBody.appendChild(darkCrab);
  let mantaRay = createItemRow("Manta ray", "Raw manta ray");
  tableBody.appendChild(mantaRay);

  let bread = createItemRow("Bread", "Bread dough");
  tableBody.appendChild(bread);

  let plainPizza = createItemRow("Plain pizza", "Pizza base", "Tomato", "Cheese");
  tableBody.appendChild(plainPizza);
  let meatPizza = createItemRow("Meat pizza", "Plain pizza", "Cooked meat", null, " (cooked meat)");
  tableBody.appendChild(meatPizza);
  let meatPizzaChicken = createItemRow("Meat pizza", "Plain pizza", "Cooked chicken", null, " (cooked chicken)");
  tableBody.appendChild(meatPizzaChicken);
  let anchovyPizza = createItemRow("Anchovy pizza", "Plain pizza", "Anchovies");
  tableBody.appendChild(anchovyPizza);
  let pineapplePizzaRing = createItemRow("Pineapple pizza", "Plain pizza", "Pineapple ring", null, " (pineapple ring)");
  tableBody.appendChild(pineapplePizzaRing);
  let pineapplePizzaChunks = createItemRow("Pineapple pizza", "Plain pizza", "Pineapple chunks", null, " (pineapple chunks)");
  tableBody.appendChild(pineapplePizzaChunks);
  let chocolateCakeBar = createItemRow("Chocolate cake", "Cake", "Chocolate bar", null, " (chocolate bar)");
  tableBody.appendChild(chocolateCakeBar);
  let chocolateCakeDust = createItemRow("Chocolate cake", "Cake", "Chocolate dust", null, " (chocolate dust)");
  tableBody.appendChild(chocolateCakeDust);

  let jugOfWine = createItemRow("Jug of wine", "Grapes", "Jug of water");
  tableBody.appendChild(jugOfWine);
  let wineOfZamorak = createItemRow("Wine of zamorak", "Zamorak's grapes", "Jug of water");
  tableBody.appendChild(wineOfZamorak);

  let bakedPotato = createItemRow("Baked potato", "Potato");
  tableBody.appendChild(bakedPotato);
  let potatoWithButter = createItemRow("Potato with butter", "Baked potato", "Pat of butter");
  tableBody.appendChild(potatoWithButter);
  let chilliPotato = createItemRow("Chilli potato", "Potato with butter", "Chilli con carne");
  tableBody.appendChild(chilliPotato);
  let eggPotato = createItemRow("Egg potato", "Potato with butter", "Egg and tomato");
  tableBody.appendChild(eggPotato);
  let mushroomPotato = createItemRow("Mushroom potato", "Potato with butter", "Mushroom & onion");
  tableBody.appendChild(mushroomPotato);
  let potatoWithCheese = createItemRow("Potato with cheese", "Potato with butter", "Cheese");
  tableBody.appendChild(potatoWithCheese);
  let tunaPotato = createItemRow("Tuna potato", "Potato with butter", "Tuna and corn");
  tableBody.appendChild(tunaPotato);

  let spicySauce = createItemRow("Spicy sauce", "Chopped garlic", "Gnome spice");
  tableBody.appendChild(spicySauce);
  let scrambledEgg = createItemRow("Scrambled egg", "Uncooked egg");
  tableBody.appendChild(scrambledEgg);
  let eggAndTomato = createItemRow("Egg and tomato", "Scrambled egg", "Tomato");
  tableBody.appendChild(eggAndTomato);
  let cookedSweetcorn = createItemRow("Cooked sweetcorn", "Sweetcorn");
  tableBody.appendChild(cookedSweetcorn);
  let friedOnions = createItemRow("Fried onions", "Chopped onion");
  tableBody.appendChild(friedOnions);
  let friedMushrooms = createItemRow("Fried mushrooms", "Sliced mushrooms");
  tableBody.appendChild(friedMushrooms);
  let mushroomAndOnion = createItemRow("Mushroom & onion", "Fried mushrooms", "Fried onions");
  tableBody.appendChild(mushroomAndOnion);

  let potOfCream = createItemRow("Pot of cream", "Bucket of milk");
  tableBody.appendChild(potOfCream);
  let patOfButterMilk = createItemRow("Pat of butter", "Bucket of milk");
  tableBody.appendChild(patOfButterMilk);
  let patOfButterCream = createItemRow("Pat of butter", "Pot of cream");
  tableBody.appendChild(patOfButterCream);
  let cheeseMilk = createItemRow("Cheese", "Bucket of milk");
  tableBody.appendChild(cheeseMilk);
  let cheeseCream = createItemRow("Cheese", "Pot of cream");
  tableBody.appendChild(cheeseCream);
  let cheeseButter = createItemRow("Cheese", "Pat of butter");
  tableBody.appendChild(cheeseButter);
  let ugthankiKebab = createItemRow("Ugthanki kebab", "Kebab mix", "Pitta bread");
  tableBody.appendChild(ugthankiKebab);
  /*These are the foodstuffs

  */

  const rows = Array.from(cookCalcTable.rows);
  
  rows.sort((row1, row2) => {// sorts by profit highest to lowest
    const value1 = parseInt(row1.cells[row1.cells.length - 3].textContent);
    const value2 = parseInt(row2.cells[row2.cells.length - 3].textContent);
    return value2 - value1;
  });
  
  cookCalcTable.innerHTML = '';
  for (const row of rows) {
    cookCalcTable.appendChild(row);
  }
}
const herbCleaningCalc = () => {
  const holdingDiv = document.createElement("div");
  itemContainer.appendChild(holdingDiv);

  const title = document.createElement("h2");
  title.innerHTML = 'Herb cleaning';
  title.classList.add("calcTitle");
  holdingDiv.appendChild(title);

  const manualOption = document.createElement("input");
  manualOption.type = 'radio';
  manualOption.name = 'cleanType';
  manualOption.checked = !degrimeBool;
  manualOption.onclick = function() {
    herbAmount = 1;
    natureAmount = 0;
    degrimeBool = false;
    clearItemViewer();
    herbCleaningCalc();
  }
  holdingDiv.appendChild(manualOption);

  const manualText = document.createElement("p");
  manualText.innerHTML = 'Manual cleaning';
  manualText.classList.add('optionText');
  holdingDiv.appendChild(manualText);

  const degrimeOption = document.createElement("input");
  degrimeOption.type = 'radio';
  degrimeOption.name = 'cleanType';
  degrimeOption.checked = degrimeBool;
  degrimeOption.onclick = function() {
    herbAmount = 27;
    natureAmount = 2;
    degrimeBool = true;
    clearItemViewer();
    herbCleaningCalc();
  }
  holdingDiv.appendChild(degrimeOption);

  const degrimeText = document.createElement("p");
  degrimeText.innerHTML = 'Degrime spell*';
  degrimeText.classList.add('optionText');
  holdingDiv.appendChild(degrimeText);

  const degrimeTextNote = document.createElement("p");
  degrimeTextNote.innerHTML = "*Using degrime spell assumes you clean 27 herbs at a time. Nature runes are taken into account when calculating profits."
  holdingDiv.appendChild(degrimeTextNote);
  

  const herbCleanTable = document.createElement("table");
  holdingDiv.appendChild(herbCleanTable);

  const tableHead = createTableHead();
  herbCleanTable.appendChild(tableHead);

  const tableBody = document.createElement("tbody");
  herbCleanTable.appendChild(tableBody);

  let guamLeaf = createHerbRow("Guam leaf", 'Grimy guam leaf', 'Nature rune');
  tableBody.appendChild(guamLeaf);
  let marrentill = createHerbRow("Marrentill", 'Grimy marrentill', 'Nature rune');
  tableBody.appendChild(marrentill);
  let tarromin = createHerbRow("Tarromin", 'Grimy tarromin', 'Nature rune');
  tableBody.appendChild(tarromin);
  let harralander = createHerbRow("Harralander", 'Grimy harralander', 'Nature rune');
  tableBody.appendChild(harralander);
  let ranarrWeed = createHerbRow("Ranarr weed", 'Grimy ranarr weed', 'Nature rune');
  tableBody.appendChild(ranarrWeed);
  let toadflax = createHerbRow("Toadflax", 'Grimy toadflax', 'Nature rune');
  tableBody.appendChild(toadflax);
  let iritLeaf = createHerbRow("Irit leaf", 'Grimy irit leaf', 'Nature rune');
  tableBody.appendChild(iritLeaf);
  let avantoe = createHerbRow("Avantoe", 'Grimy avantoe', 'Nature rune');
  tableBody.appendChild(avantoe);
  let kwuarm = createHerbRow("Kwuarm", 'Grimy kwuarm', 'Nature rune');
  tableBody.appendChild(kwuarm);
  let snapdragon = createHerbRow("Snapdragon", 'Grimy snapdragon', 'Nature rune');
  tableBody.appendChild(snapdragon);
  let cadantine = createHerbRow("Cadantine", 'Grimy cadantine', 'Nature rune');
  tableBody.appendChild(cadantine);
  let lantadyme = createHerbRow("Lantadyme", 'Grimy lantadyme', 'Nature rune');
  tableBody.appendChild(lantadyme);
  let dwarfWeed = createHerbRow("Dwarf weed", 'Grimy dwarf weed', 'Nature rune');
  tableBody.appendChild(dwarfWeed);
  let torstol = createHerbRow("Torstol", 'Grimy torstol', 'Nature rune');
  tableBody.appendChild(torstol);

  const rows = Array.from(herbCleanTable.rows);
  
  rows.sort((row1, row2) => {// sorts by profit highest to lowest
    const value1 = parseInt(row1.cells[row1.cells.length - 3].textContent);
    const value2 = parseInt(row2.cells[row2.cells.length - 3].textContent);
    return value2 - value1;
  });
  
  herbCleanTable.innerHTML = '';
  for (const row of rows) {
    herbCleanTable.appendChild(row);
  }
}
const plankMakingCalc = () => {
  const holdingDiv = document.createElement("div");
  itemContainer.appendChild(holdingDiv);

  const title = document.createElement("h2");
  title.innerHTML = 'Plank making';
  title.classList.add("calcTitle");
  holdingDiv.appendChild(title);

  const sawmillOption = document.createElement("input");
  sawmillOption.type = 'radio';
  sawmillOption.name = 'makeType';
  sawmillOption.checked = !plankSpellBool;
  sawmillOption.onclick = function() {
    plankSpellBool = false;
    clearItemViewer();
    plankMakingCalc();
  }
  holdingDiv.appendChild(sawmillOption);

  const sawmillText = document.createElement("p");
  sawmillText.innerHTML = 'Sawmill';
  sawmillText.classList.add('optionText');
  holdingDiv.appendChild(sawmillText);

  const spellOption = document.createElement("input");
  spellOption.type = 'radio';
  spellOption.name = 'makeType';
  spellOption.checked = plankSpellBool;
  spellOption.onclick = function() {
    plankSpellBool = true;
    clearItemViewer();
    plankMakingCalc();
  }
  holdingDiv.appendChild(spellOption);

  const spellText = document.createElement("p");
  spellText.innerHTML = 'Plank make spell';
  spellText.classList.add('optionText');
  holdingDiv.appendChild(spellText);

  const plankMakeTable = document.createElement("table");
  holdingDiv.appendChild(plankMakeTable);

  const tableHead = createTableHead();
  plankMakeTable.appendChild(tableHead);

  const tableBody = document.createElement("tbody");
  plankMakeTable.appendChild(tableBody);

  let plank = createPlankRow("Plank", 'Logs', 100);
  tableBody.appendChild(plank);
  let oakPlank = createPlankRow("Oak plank", 'Oak logs', 250);
  tableBody.appendChild(oakPlank);
  let teakPlank = createPlankRow("Teak plank", 'Teak logs', 500);
  tableBody.appendChild(teakPlank);
  let mahoganyPlank = createPlankRow("Mahogany plank", 'Mahogany logs', 1500);
  tableBody.appendChild(mahoganyPlank);

  const rows = Array.from(plankMakeTable.rows);
  
  rows.sort((row1, row2) => {// sorts by profit highest to lowest
    const value1 = parseInt(row1.cells[row1.cells.length - 3].textContent);
    const value2 = parseInt(row2.cells[row2.cells.length - 3].textContent);
    return value2 - value1;
  });
  
  plankMakeTable.innerHTML = '';
  for (const row of rows) {
    plankMakeTable.appendChild(row);
  }
}
const packagingCalc = () => {
  const holdingDiv = document.createElement("div");
  itemContainer.appendChild(holdingDiv);

  const title = document.createElement("h2");
  title.innerHTML = 'Packaging fruits/vegtables';
  title.classList.add("calcTitle");
  holdingDiv.appendChild(title);

  const packagingTable = document.createElement("table");
  holdingDiv.appendChild(packagingTable);

  const tableHead = createTableHead();
  packagingTable.appendChild(tableHead);
  
  const tableBody = document.createElement("tbody");
  packagingTable.appendChild(tableBody);

  let apples5 = createItemRow2(1, "Apples(5)", 1, 'Basket', 5, "Cooking apple");
  tableBody.appendChild(apples5);
  let bananas5 = createItemRow2(1, "Bananas(5)", 1, 'Basket', 5, "Banana");
  tableBody.appendChild(bananas5);
  let oranges5 = createItemRow2(1, "Oranges(5)", 1, 'Basket', 5, "Orange");
  tableBody.appendChild(oranges5);
  let strawberries5 = createItemRow2(1, "Strawberries(5)", 1, 'Basket', 5, "Strawberry");
  tableBody.appendChild(strawberries5);
  let tomatoes5 = createItemRow2(1, "Tomatoes(5)", 1, 'Basket', 5, "Tomato");
  tableBody.appendChild(tomatoes5);
  let cabbages10 = createItemRow2(1, "Cabbages(10)", 1, 'Empty sack', 10, "Cabbage");
  tableBody.appendChild(cabbages10);
  let onions10 = createItemRow2(1, "Onions(10)", 1, 'Empty sack', 10, "Onion");
  tableBody.appendChild(onions10);
  let potatoes10 = createItemRow2(1, "Potatoes(10)", 1, 'Empty sack', 10, "Potato");
  tableBody.appendChild(potatoes10);

  const rows = Array.from(packagingTable.rows);
  
  rows.sort((row1, row2) => {// sorts by profit highest to lowest
    const value1 = parseInt(row1.cells[row1.cells.length - 3].textContent);
    const value2 = parseInt(row2.cells[row2.cells.length - 3].textContent);
    return value2 - value1;
  });
  
  packagingTable.innerHTML = '';
  for (const row of rows) {
    packagingTable.appendChild(row);
  }
}
const craftingJewelleryCalc = () => {
  const holdingDiv = document.createElement("div");
  itemContainer.appendChild(holdingDiv);

  const title = document.createElement("h2");
  title.innerHTML = 'Crafting Jewellery';
  title.classList.add("calcTitle");
  holdingDiv.appendChild(title);

  const craftingJewelleryCalcTable = document.createElement("table");
  holdingDiv.appendChild(craftingJewelleryCalcTable);

  const tableHead = createTableHead();
  craftingJewelleryCalcTable.appendChild(tableHead);

  const tableBody = document.createElement("tbody");
  craftingJewelleryCalcTable.appendChild(tableBody);

  //
  let opalRing = createItemRow("Opal ring", "Opal", "Silver bar", null, null);
  tableBody.appendChild(opalRing);
  let opalNecklace = createItemRow("Opal necklace", "Opal", "Silver bar", null, null);
  tableBody.appendChild(opalNecklace);
  let opalBracelet = createItemRow("Opal bracelet", "Opal", "Silver bar", null, null);
  tableBody.appendChild(opalBracelet);
  let opalAmuletU = createItemRow("Opal amulet (u)", "Opal", "Silver bar", null, null);
  tableBody.appendChild(opalAmuletU);
  let jadeRing = createItemRow("Jade ring", "Jade", "Silver bar", null, null);
  tableBody.appendChild(jadeRing);
  let jadeNecklace = createItemRow("Jade necklace", "Jade", "Silver bar", null, null);
  tableBody.appendChild(jadeNecklace);
  let jadeBracelet = createItemRow("Jade bracelet", "Jade", "Silver bar", null, null);
  tableBody.appendChild(jadeBracelet);
  let jadeAmuletU = createItemRow("Jade amulet (u)", "Jade", "Silver bar", null, null);
  tableBody.appendChild(jadeAmuletU);
  let topazRing = createItemRow("Topaz ring", "Red topaz", "Silver bar", null, null);
  tableBody.appendChild(topazRing);
  let topazNecklace = createItemRow("Topaz necklace", "Red topaz", "Silver bar", null, null);
  tableBody.appendChild(topazNecklace);
  let topazBracelet = createItemRow("Topaz bracelet", "Red topaz", "Silver bar", null, null);
  tableBody.appendChild(topazBracelet);
  let topazAmuletU = createItemRow("Topaz amulet (u)", "Red topaz", "Silver bar", null, null);
  tableBody.appendChild(topazAmuletU);

  let goldRing = createItemRow("Gold ring", "Gold bar", null, null, null);
  tableBody.appendChild(goldRing);
  let goldNecklace = createItemRow("Gold necklace", "Gold bar", null, null, null);
  tableBody.appendChild(goldNecklace);
  let goldBracelet = createItemRow("Gold bracelet", "Gold bar", null, null, null);
  tableBody.appendChild(goldBracelet);
  let goldAmuletU = createItemRow("Gold amulet (u)", "Gold bar", null, null, null);
  tableBody.appendChild(goldAmuletU);
  let goldTiara = createItemRow("Gold tiara", "Gold bar", null, null, null);
  tableBody.appendChild(goldTiara);
  let sapphireRing = createItemRow("Sapphire ring", "Gold bar", "Sapphire", null, null);
  tableBody.appendChild(sapphireRing);
  let sapphireNecklace = createItemRow("Sapphire necklace", "Gold bar", "Sapphire", null, null);
  tableBody.appendChild(sapphireNecklace);
  let sapphireBracelet = createItemRow("Sapphire bracelet", "Gold bar", "Sapphire", null, null);
  tableBody.appendChild(sapphireBracelet);
  let sapphireAmuletU = createItemRow("Sapphire amulet (u)", "Gold bar", "Sapphire", null, null);
  tableBody.appendChild(sapphireAmuletU);
  let emeraldRing = createItemRow("Emerald ring", "Gold bar", "Emerald", null, null);
  tableBody.appendChild(emeraldRing);
  let emeraldNecklace = createItemRow("Emerald necklace", "Gold bar", "Emerald", null, null);
  tableBody.appendChild(emeraldNecklace);
  let emeraldBracelet = createItemRow("Emerald bracelet", "Gold bar", "Emerald", null, null);
  tableBody.appendChild(emeraldBracelet);
  let emeraldAmuletU = createItemRow("Emerald amulet (u)", "Gold bar", "Emerald", null, null);
  tableBody.appendChild(emeraldAmuletU);
  let rubyRing = createItemRow("Ruby ring", "Gold bar", "Ruby", null, null);
  tableBody.appendChild(rubyRing);
  let rubyNecklace = createItemRow("Ruby necklace", "Gold bar", "Ruby", null, null);
  tableBody.appendChild(rubyNecklace);
  let rubyBracelet = createItemRow("Ruby bracelet", "Gold bar", "Ruby", null, null);
  tableBody.appendChild(rubyBracelet);
  let rubyAmuletU = createItemRow("Ruby amulet (u)", "Gold bar", "Ruby", null, null);
  tableBody.appendChild(rubyAmuletU);
  let diamondRing = createItemRow("Diamond ring", "Gold bar", "Diamond", null, null);
  tableBody.appendChild(diamondRing);
  let diamondNecklace = createItemRow("Diamond necklace", "Gold bar", "Diamond", null, null);
  tableBody.appendChild(diamondNecklace);
  let diamondBracelet = createItemRow("Diamond bracelet", "Gold bar", "Diamond", null, null);
  tableBody.appendChild(diamondBracelet);
  let diamondAmuletU = createItemRow("Diamond amulet (u)", "Gold bar", "Diamond", null, null);
  tableBody.appendChild(diamondAmuletU);
  let dragonstoneRing = createItemRow("Dragonstone ring", "Gold bar", "Dragonstone", null, null);
  tableBody.appendChild(dragonstoneRing);
  let dragonstoneNecklace = createItemRow("Dragon necklace", "Gold bar", "Dragonstone", null, null);
  tableBody.appendChild(dragonstoneNecklace);
  let dragonstoneBracelet = createItemRow("Dragonstone bracelet", "Gold bar", "Dragonstone", null, null);
  tableBody.appendChild(dragonstoneBracelet);
  let dragonstoneAmuletU = createItemRow("Dragonstone amulet (u)", "Gold bar", "Dragonstone", null, null);
  tableBody.appendChild(dragonstoneAmuletU);
  let onyxRing = createItemRow("Onyx ring", "Gold bar", "Onyx", null, null);
  tableBody.appendChild(onyxRing);
  let onyxNecklace = createItemRow("Onyx necklace", "Gold bar", "Onyx", null, null);
  tableBody.appendChild(onyxNecklace);
  let onyxBracelet = createItemRow("Onyx bracelet", "Gold bar", "Onyx", null, null);
  tableBody.appendChild(onyxBracelet);
  let onyxAmuletU = createItemRow("Onyx amulet (u)", "Gold bar", "Onyx", null, null);
  tableBody.appendChild(onyxAmuletU);
  let zenyteRing = createItemRow("Zenyte ring", "Gold bar", "Zenyte", null, null);
  tableBody.appendChild(zenyteRing);
  let zenyteNecklace = createItemRow("Zenyte necklace", "Gold bar", "Zenyte", null, null);
  tableBody.appendChild(zenyteNecklace);
  let zenyteBracelet = createItemRow("Zenyte bracelet", "Gold bar", "Zenyte", null, null);
  tableBody.appendChild(zenyteBracelet);
  let zenyteAmuletU = createItemRow("Zenyte amulet (u)", "Gold bar", "Zenyte", null, null);
  tableBody.appendChild(zenyteAmuletU);


  const rows = Array.from(craftingJewelleryCalcTable.rows);
  
  rows.sort((row1, row2) => {// sorts by profit highest to lowest
    const value1 = parseInt(row1.cells[row1.cells.length - 3].textContent);
    const value2 = parseInt(row2.cells[row2.cells.length - 3].textContent);
    return value2 - value1;
  });
  
  craftingJewelleryCalcTable.innerHTML = '';
  for (const row of rows) {
    craftingJewelleryCalcTable.appendChild(row);
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
cookingFoodDiv.onclick = function() {
  clearItemViewer();
  cookingProfitCalc();
}
herbCleaningDiv.onclick = function() {
  clearItemViewer();
  herbCleaningCalc();
}
plankMakingDiv.onclick = function() {
  clearItemViewer();
  plankMakingCalc();
}
fruitPackageDiv.onclick = function() {
  clearItemViewer();
  packagingCalc();
}
gemBoltTipsDiv.onclick = function() {
  clearItemViewer();
  gemBoltTipsCalc();
}
craftingJewelleryDiv.onclick = function() {
  clearItemViewer();
  craftingJewelleryCalc();
}