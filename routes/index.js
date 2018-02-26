var express = require('express');
var axios = require('axios');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/get-data', async function(req, res, next) {
	var resultArray = [];
	try {
    	// then we grab some data over an Ajax request
    	const coins = await axios ('https://www.cryptopia.co.nz/api/GetCurrencies');
    	// const bitfinex = await axios('https://api.bitfinex.com/v2/tickers?symbols=tBTCUSD,tLTCBTC,tETHBTC,tETCBTC,tRRTBTC,tZECBTC,tXMRBTC,tDSHBTC,tBTCEUR,tXRPBTC,tIOTBTC,tEOSBTC,tSANBTC,tOMGBTC,tBCHBTC,tNEOBTC,tETPBTC,tQTMBTC,tAVTBTC,tEDOBTC,tBTGBTC,tDATBTC,tQSHBTC,tYYWBTC,tGNTBTC,tSNTBTC,tBATBTC,tMNABTC,tFUNBTC,tZRXBTC,tTNBBTC,tSPKBTC,tTRXBTC,tRCNBTC,tRLCBTC,tAIDBTC,tSNGBTC,tREPBTC,tELFBTC');
    	const cijene = await axios('https://www.cryptopia.co.nz/api/GetMarkets/BTC');
    	//console.log(parovi.data); // mediocre code
    	var obj_coins = coins.data.Data;
    	var obj_cijene = cijene.data.Data;
    	var ok = 0;
    	
/*    	for (var bkey in bitfinex.data) {
                var cn = bitfinex.data[bkey][0].replace("BTC", '');
                var coinName = cn.substr(1);  //remove first character 't'
                    if (coinName === "IOT") {
                        coinName = "IOTA";
                    }
                var cr_last = (bitfinex.data[bkey][7] * 1000).toPrecision(5);
	    	for (var c in obj_cijene) {
	    		//kreiraj niz
	    		for (var n in obj_coins) {
	    			//var symstr = obj_cijene[c].Label;
	    			//var sym = symstr.replace('/BTC','');
	    			if (obj_cijene[c].Label.replace('/BTC','') == obj_coins[n].Symbol) {
	    				var lastprice = (obj_cijene[c].LastPrice * 1000).toPrecision(5);//.replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
	    				var askprice = (obj_cijene[c].AskPrice * 1000).toPrecision(5);
	    				var bidprice = (obj_cijene[c].BidPrice * 1000).toPrecision(5);
	    				var buyvolume = (obj_cijene[c].BuyVolume).formatMoney(2, '.', ',');
	    				//(123456789.12345).formatMoney(2, '.', ',');
	    				var sellvolume = (obj_cijene[c].SellVolume).formatMoney(2, '.', ',');
	    				// var sellvolume = (obj_cijene[c].SellVolume).toFixed(2);
	    				if (coinName == obj_coins[n].Symbol) {
	    					var difference = ((bitfinex.data[bkey][7]) - (obj_cijene[c].LastPrice)).toFixed(5);
	    					console.log(difference);
	    					resultArray.push({
					  			symbol: coinName,
				  				market_bitfinex: bitfinex.data[bkey][7] * 1000,
					  			market_cryptopia: obj_cijene[c].LastPrice * 1000,
					  			diff: difference,
					  			status: obj_coins[n].Status, 
					  			message: obj_coins[n].StatusMessage
					  		});
					  		ok++;
	    				}

				  		//console.log(obj_parovi[i].Label + ' ' + obj_cijene[n].LastPrice);
			  		}	
	    		}
	    	}
			  			// askprice: bitfinex.data[bkey][3],
			  			// bidprice: bitfinex.data[bkey][1],
			  			// buyvolume: bitfinex.data[bkey][4],
			  			// sellvolume: bitfinex.data[bkey][2]

    		// console.log(bitfinex.data[bkey][0]);
    	}
*/

    	for (var c in obj_cijene) {
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
    	}
    	console.log(resultArray);
	  	res.render('index', {coins: resultArray, ukupno: c, ok: ok});
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
