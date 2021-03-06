var express = require('express');
var axios = require('axios');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index');
});


router.get('/get-data', async function(req, res, next) {
	var coins = {};			//niz coina za lastprice
	var arrcryptopia = [];
	var arrpoloniex = [];
	var arrbitfinex = [];
	var arrbinance = [];
	var val;				//trenutna valuta koju punimo sa lastprice

	try {
    	// then we grab some data over an Ajax request
    	const cryptopiaInfo = await axios ('https://www.cryptopia.co.nz/api/GetCurrencies');
    	const bitfinex = await axios('https://api.bitfinex.com/v2/tickers?symbols=tBTCUSD,tLTCBTC,tETHBTC,tETCBTC,tRRTBTC,tZECBTC,tXMRBTC,tDSHBTC,tBTCEUR,tXRPBTC,tIOTBTC,tEOSBTC,tSANBTC,tOMGBTC,tBCHBTC,tNEOBTC,tETPBTC,tQTMBTC,tAVTBTC,tEDOBTC,tBTGBTC,tDATBTC,tQSHBTC,tYYWBTC,tGNTBTC,tSNTBTC,tBATBTC,tMNABTC,tFUNBTC,tZRXBTC,tTNBBTC,tSPKBTC,tTRXBTC,tRCNBTC,tRLCBTC,tAIDBTC,tSNGBTC,tREPBTC,tELFBTC');
    	const cryptopiaBTC = await axios('https://www.cryptopia.co.nz/api/GetMarkets/BTC');
    	const poloniexBTC = await axios('https://poloniex.com/public?command=returnTicker');
    	const poloniexInfo = await axios('https://poloniex.com/public?command=returnCurrencies');
    	const binance = await axios('https://api.binance.com/api/v3/ticker/price');
    	const binanceInfo = await axios('https://www.binance.com/exchange/public/product');
    	const binancePrices = await axios('https://api.binance.com/api/v3/ticker/bookTicker');
    	
    	var obj_cryptopia_status = cryptopiaInfo.data.Data;
    	var obj_cryptopia = cryptopiaBTC.data.Data;
    	var obj_poloniex = poloniexBTC.data;
    	var obj_poloniexInfo = poloniexInfo.data;
    	var obj_binanceInfo = binanceInfo.data.data;
    	//======================== Binance ==============================================================
    	for (var key in obj_binanceInfo) {
    		if(obj_binanceInfo[key].symbol.includes('BTC')) {
    			// console.log(obj_binanceInfo[key].symbol, obj_binanceInfo[key].baseAssetName);
    			let coinName = obj_binanceInfo[key].symbol.replace("BTC", '');
    			arrbinance.push({
					symbol: coinName,
					name: obj_binanceInfo[key].baseAssetName,
					active: obj_binanceInfo[key].active,
					status: obj_binanceInfo[key].status
				});
    		}
    	}
    	// console.log(arrbinance);
    	for (var key in binance.data) {
    		if(binance.data[key].symbol.includes('BTC')) {
    			let coinName = binance.data[key].symbol.replace("BTC", '');
            	let last = (binance.data[key].price * 1000).toPrecision(4);
            	
            	for (let n = 0; n < arrbinance.length; n++) {

					if (arrbinance[n].symbol == coinName) {
						arrbinance[n].lastprice = last
					}
				}

				if (typeof coins[coinName] == "undefined") {
	            	coins[coinName] = {};
	            }
	            coins[coinName].Binance = last;
            }
    	}

    	for (var key in binancePrices.data) {
    		if(binancePrices.data[key].symbol.includes('BTC')) {
    			let coinName = binancePrices.data[key].symbol.replace("BTC", '');
            	let ask = (binancePrices.data[key].askPrice * 1000).toPrecision(4);
            	let bid = (binancePrices.data[key].bidPrice * 1000).toPrecision(4);
            	let buyvolume = Number(binancePrices.data[key].askQty).formatMoney(2, '.', ',');
            	let sellvolume = Number(binancePrices.data[key].bidQty).formatMoney(2, '.', ',');
            	
            	for (let n = 0; n < arrbinance.length; n++) {

					if (arrbinance[n].symbol == coinName) {
						arrbinance[n].askprice = ask,
						arrbinance[n].bidprice = bid,
						arrbinance[n].buyvolume = buyvolume,
						arrbinance[n].sellvolume = sellvolume
					}
				}
            }
    	}
    	//======================== Poloniex =============================================================
    	for (var key in obj_poloniex) {
    		for (var n in obj_poloniexInfo) {
	    		if( key.replace("BTC_", '') == n) {
	                var symbol = key.replace("BTC_", '');
	                var last = (obj_poloniex[key].last * 1000).toPrecision(4);
	    			var ask = (obj_poloniex[key].lowestAsk * 1000).toPrecision(4);
	    			var bid = (obj_poloniex[key].highestBid * 1000).toPrecision(4);
	    			// var buyvolume = (obj_poloniex[key].BuyVolume).formatMoney(2, '.', ',');
	    			// var sellvolume = (obj_poloniex[key].SellVolume).formatMoney(2, '.', ',');
	    				arrpoloniex.push({
				  			id: obj_poloniexInfo[n].id,
				  			symbol: symbol,
				  			name: obj_poloniexInfo[n].name,
				  			disabled: obj_poloniexInfo[n].disabled,
				  			delisted: obj_poloniexInfo[n].delisted, 
				  			frozen: obj_poloniexInfo[n].frozen,
				  			lastprice: last,
				  			askprice: ask,
				  			bidprice: bid
				  		});

	                if (typeof coins[symbol] == "undefined") {
		            	coins[symbol] = {};
		            }
		            coins[symbol].Poloniex = last;
	             }	
           }
    	}
    	//======================== Bitfinex =============================================================
											    // SYMBOL,
											    // BID, 
											    // BID_SIZE, 
											    // ASK, 
											    // ASK_SIZE, 
											    // DAILY_CHANGE, 
											    // DAILY_CHANGE_PERC, 
											    // LAST_PRICE, 
											    // VOLUME, 
											    // HIGH, 
											    // LOW
    	for (var key in bitfinex.data) {
        	var cn = bitfinex.data[key][0].replace("BTC", '');
            var coinName = cn.substr(1);  //remove first character 't'
                if (coinName === "IOT") {
                      coinName = "IOTA";
                }
            var bf_last = (bitfinex.data[key][7] * 1000).toPrecision(4);
            var ask = (bitfinex.data[key][3] * 1000).toPrecision(4);
            var bid = (bitfinex.data[key][1] * 1000).toPrecision(4);
            var buyvolume = (bitfinex.data[key][4]).formatMoney(2, '.', ',');
	    	var sellvolume = (bitfinex.data[key][2]).formatMoney(2, '.', ',');
            // ovdje punimo bitfinex
            val = coinName;						//aktuelna valuta
            arrbitfinex.push({
            	symbol : coinName,
            	lastprice : bf_last,
            	askprice : ask,
            	bidprice : bid,
            	buyvolume : buyvolume,
            	sellvolume : sellvolume
            });
            if (typeof coins[val] == "undefined") {
            	coins[val] = {};
            }
            coins[val].Bitfinex = bf_last;

    	}
    	
    	//======================== Cryptopia =============================================================
    	for (var c in obj_cryptopia) {
    		//kreiraj niz
    		for (var n in obj_cryptopia_status) {
    			//var symstr = obj_cryptopia[c].Label;
    			//var sym = symstr.replace('/BTC','');
    			if (obj_cryptopia[c].Label.replace('/BTC','') == obj_cryptopia_status[n].Symbol) {
    				var cr_last = (obj_cryptopia[c].LastPrice * 1000).toPrecision(4);	//.replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    				var ask = (obj_cryptopia[c].AskPrice * 1000).toPrecision(4);
    				var bid = (obj_cryptopia[c].BidPrice * 1000).toPrecision(4);
    				var buyvolume = (obj_cryptopia[c].BuyVolume).formatMoney(2, '.', ',');
    				var sellvolume = (obj_cryptopia[c].SellVolume).formatMoney(2, '.', ',');
    				arrcryptopia.push({
			  			id: obj_cryptopia_status[n].Id,
			  			symbol: obj_cryptopia_status[n].Symbol,
			  			name: obj_cryptopia_status[n].Name,
			  			status: obj_cryptopia_status[n].Status,
			  			listingstatus: obj_cryptopia_status[n].ListingStatus, 
			  			message: obj_cryptopia_status[n].StatusMessage,
			  			lastprice: cr_last,
			  			askprice: ask,
			  			bidprice: bid,
			  			buyvolume: buyvolume,
			  			sellvolume: sellvolume
			  		});

					val = obj_cryptopia_status[n].Symbol;
					if (val != 'BAT' && val != 'BTG'){
						if (typeof coins[val] == "undefined") {
							coins[val] = {};
						}
						coins[val].Cryptopia = cr_last;
					}
		  		}	
    		}
    	}

    	// coins["ETH"].Stanko = 455.21;								//ovo radi ovako!

    	for (var coin in coins){
			var min = 1000000;
			var max = 0;
			var mmin;
			var mmax;
				obj = coins[coin];
			  for (var i in obj){
			/*   console.log(obj[i]); */
			   	if (obj[i] < min) {min = obj[i]; mmin = i;}
			   	if (obj[i] > max) {max = obj[i]; mmax = i;}
			  }
			  coins[coin].Min = min;
			  coins[coin].Max = max;
			  coins[coin].MarkMin = mmin;
			  coins[coin].MarkMax = mmax;
			  coins[coin].Razlika = (((max / min)-1)*100).toPrecision(3);

		}
    	// console.log(JSON.stringify(coins));
    	//brisemo ako nema niakve razlike
    	//console.log(coins);
    	for (var key in coins) {
		    if (isNaN(coins[key].Razlika) || coins[key].Razlika == 0) {	
		        delete coins[key];
		    }
		} 

		//sortiranje i novi niz
		var arr = [];
		for (var key in coins) {
			// console.log(coins[key][0].ask);					///generisati novi niz za prikaz, sa svim parametrrina
			if (key != 'EUR' && key != 'USD' && key != 'USD') {	//privremeno izbacujem USD EUR, ne prikazuje kako treba... treba istraziti
				arr.push([key, 
		    		coins[key].Razlika, 
		    		coins[key].MarkMin,
			  		coins[key].MarkMax
		    ]);
			}
		}      
		// console.log(arr);
		// arr.sort(function(a, b) {
		//         a = a[1];
		//         b = b[1];
		//         return b - a;
		//         // return a > b ? -1 : (a < b ? 1 : 0);
		// });
		// console.log(arr);
		// console.log(arrcryptopia);
		
		var results = [];
		for (let i = 0; i < arr.length; i++) { 
			results.push({
						 	coin: arr[i][0],
						 	razlika: arr[i][1],
						 	Lo: arr[i][2],
						 	Hi: arr[i][3]
			});
		}
		for (let i = 0; i < arr.length; i++) {
			for (let n = 0; n < arrcryptopia.length; n++) {
				// console.log(arrcryptopia[n].symbol);
				if (arr[i][0] == arrcryptopia[n].symbol) {
					results[i].Cryptopia = arrcryptopia[n].lastprice;
					results[i].CrName = arrcryptopia[n].name;
					results[i].CrStatus  = arrcryptopia[n].status;
					results[i].CrListingStatus  = arrcryptopia[n].listingstatus;
					results[i].CrMessage = arrcryptopia[n].message;
					results[i].CrAsk = arrcryptopia[n].askprice;
					results[i].CrBid = arrcryptopia[n].bidprice;
					results[i].CrBuyVol = arrcryptopia[n].buyvolume;
					results[i].CrSellVol = arrcryptopia[n].sellvolume;
				}
			}

		}

		for (let i = 0; i < results.length; i++) {
			for (let n = 0; n < arrpoloniex.length; n++) {
				// console.log(results[i].coin , '|' , arrpoloniex[n].symbol);
				if (results[i].coin == arrpoloniex[n].symbol) {
					results[i].Poloniex = arrpoloniex[n].lastprice;
					results[i].PolName = arrpoloniex[n].name;
					results[i].disabled  = arrpoloniex[n].disabled;
					results[i].delisted  = arrpoloniex[n].delisted;
					results[i].frozen = arrpoloniex[n].frozen;
					results[i].PolAsk = arrpoloniex[n].askprice;
					results[i].PolBid = arrpoloniex[n].bidprice;
				}

			}
		}
		for (let i = 0; i < results.length; i++) {
			for (let n = 0; n < arrbitfinex.length; n++) {
				if (results[i].coin == arrbitfinex[n].symbol) {
					results[i].Bitfinex = arrbitfinex[n].lastprice;
					results[i].BfAsk = arrbitfinex[n].askprice;
					results[i].BfBid = arrbitfinex[n].bidprice;
					results[i].BfBuyVol = arrbitfinex[n].buyvolume;
					results[i].BfSellVol = arrbitfinex[n].sellvolume;
				}

			}
		}
		for (let i = 0; i < results.length; i++) {
			for (let n = 0; n < arrbinance.length; n++) {
				if (results[i].coin == arrbinance[n].symbol) {
					results[i].BinSymbol = arrbinance[n].symbol;
					results[i].BinName = arrbinance[n].name;
					results[i].Binance = arrbinance[n].lastprice;
					results[i].BinActive = arrbinance[n].active;
					results[i].BinStatus = arrbinance[n].status;
					results[i].BinAsk = arrbinance[n].askprice;
					results[i].BinBid = arrbinance[n].bidprice;
					results[i].BinBuyVol = arrbinance[n].buyvolume;
					results[i].BinSellVol = arrbinance[n].sellvolume;
				}

			}
		}
		// console.log(results);
	  	res.render('index', {results: results});
	}
	catch (e) {
	    console.error(e); // 💩
	}
});


Number.prototype.formatMoney = function(c, d, t){
var n = this, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };

module.exports = router;



/*    	for (var c in obj_cijene) {
    		//kreiraj niz
    		for (var n in obj_coins) {
    			//var symstr = obj_cijene[c].Label;
    			//var sym = symstr.replace('/BTC','');
    			if (obj_cijene[c].Label.replace('/BTC','') == obj_coins[n].Symbol) {
    				var lastprice = (obj_cijene[c].LastPrice * 1000).toFixed(5).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    				var askprice = (obj_cijene[c].AskPrice * 1000).toFixed(5).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    				var bidprice = (obj_cijene[c].BidPrice * 1000).toFixed(5).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    				var buyvolume = (obj_cijene[c].BuyVolume).formatMoney(2, '.', ',');
    				//(123456789.12345).formatMoney(2, '.', ',');
    				var sellvolume = (obj_cijene[c].SellVolume).formatMoney(2, '.', ',');
    				// var sellvolume = (obj_cijene[c].SellVolume).toFixed(2);

			  		resultArray.push({
			  			id: obj_coins[n].Id,
			  			symbol: obj_coins[n].Symbol,
			  			name: obj_coins[n].Name,
			  			// label: obj_cijene[c].Label,
			  			status: obj_coins[n].Status,
			  			listingstatus: obj_coins[n].ListingStatus, 
			  			message: obj_coins[n].StatusMessage,
			  			lastprice: lastprice,
			  			askprice: askprice,
			  			bidprice: bidprice,
			  			buyvolume: buyvolume,
			  			sellvolume: sellvolume
			  		});
			  		ok++;
			  		//console.log(obj_parovi[i].Label + ' ' + obj_cijene[n].LastPrice);
		  		}	
    		}
    	}*/