'use strict';


const mongoose = require('mongoose');
const { Schema } = mongoose;

const StockSchema = new Schema ({
  symbol : { type:String, required : true},
  likes : { type: Array, default : []}
});

const StockModel = mongoose.model("Stock", StockSchema);

const anonymize = (...args) => import('ip-anonymize').then(({default: anonymize}) => anonymize(...args));
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function fetchStock(stock) {
  const URI = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${ stock }/quote`;
  console.log(URI);
  const response = await fetch(URI);
  const { symbol, latestPrice } = await response.json();
  
  return { symbol, latestPrice};
}

async function createStock(stock, like, ip) {
  const newStock = new StockModel({
    symbol : stock,
    likes : like ? [ip] : [],
  });
  
  try { 
    return await newStock.save();
  } catch(err) { console.log(err); }
}

async function findStock(stock) {
  try {
    return await StockModel.findOne({ symbol: stock }).exec();
  } catch(err) { console.log("findOne ERROR: {}".format(err)); }
}

async function saveStock(stock, like, ip) {
  let record = {};
  const foundStock = await findStock(stock);
  console.log("Found Stock: ", foundStock);
  if (!foundStock) {
    try {
      const createRecord = await createStock(stock, like, ip);
      record = createRecord;
      console.log(record);
      return record;
    } catch(err) { console.log(err); }
  } else {
    return foundStock;
  }
}


module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res){
      const { stock, like } = req.query;
      // console.log("From req.body: ",stock, like);
      const ip = anonymize(req.ip, 16, 16);

      if (Array.isArray(stock)) {
        let stockData = [];
        const { symbol, latestPrice } = await fetchStock(stock[0]);
        const { symbol: symbolx, latestPrice: latestPricex } = await fetchStock(stock[1]);

        const record = await saveStock(stock[0], like, ip);
        const recordx = await saveStock(stock[1], like, ip);

        if (!symbol) {
          stockData.push({
            rel_likes : record.likes.length - recordx.likes.length,
          });
        } else {
          stockData.push({
            stock : symbol,
            price : parseFloat(latestPrice,2),
            rel_likes : record.likes.length - recordx.likes.length,
          });
        }

        if (!symbolx) {
          stockData.push({
            rel_likes : recordx.likes.length - record.likes.length,
          });
        } else {
          stockData.push({
            stock : symbolx,
            price : parseFloat(latestPricex,2),
            rel_likes : recordx.likes.length - record.likes.length,
          });
        }
        
        res.json({ stockData });
        return;
      }

      try {
        const { symbol, latestPrice } = await fetchStock(stock);
        // console.log("stock:", stock, " Symbol: ", symbol, " Price: ", latestPrice);

        if (!symbol) {
          res.json({ 
            stockData: { 
              symbol : '',
              price : 0,
              likes: like ? 1 : 0 
            }
          });
          return;
        }

        try {
          const aStockData = await saveStock(symbol, like, req.ip);

          console.log("Stock Data: ", symbol, latestPrice);

          res.json({
            stockData: {
              stock : symbol.toString(),
              price : parseFloat(latestPrice, 2),
              likes : parseInt(aStockData.likes.length),
            }
          })
        } catch(err) { console.log(err); }

      } catch(err) {
        console.log(err)
      }
    });
};
