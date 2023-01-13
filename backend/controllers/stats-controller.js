const Stats = require("../models/Stats");
const puppeteer = require("puppeteer");

//scrape and save stats
module.exports.saveStats = async (req, res) => {
  (async () => {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4298.0 Safari/537.36');
    await page.goto(`https://hokej.si/stat/?stat_s=28&stat_c=151`, {waitUntil: "networkidle0"});
  
    const tbody = "#rankings > tbody"; //length = 4
    await page.waitForSelector(tbody);
  
    // Extract the results from the page.
    for (let i=0;i<1;i++) {
      const  trs = await page.$$('#rankings > tbody > tr');

      for (const tr of trs) {
        const var_ranking = await tr.$eval('tr :nth-child(1)', e=>{return e.innerText}); 
        const var_team = await tr.$eval('tr :nth-child(3)', e=>{return e.innerText});
        const var_gamesPlayed = await tr.$eval('tr :nth-child(4)', e=>{return e.innerText});
        const var_wins = await tr.$eval('tr :nth-child(5)', e=>{return e.innerText});
        const var_overtimeWin = await tr.$eval('tr :nth-child(6)', e=>{return e.innerText});
        const var_overtimeLoss = await tr.$eval('tr :nth-child(7)', e=>{return e.innerText});
        const var_losses = await tr.$eval('tr :nth-child(8)', e=>{return e.innerText});
        const var_goalsFor = await tr.$eval('tr :nth-child(9)', e=>{return e.innerText});
        const var_goalsAgainst = await tr.$eval('tr :nth-child(10)', e=>{return e.innerText});
        const var_diff = await tr.$eval('tr :nth-child(11)', e=>{return e.innerText});
        const var_penalties = await tr.$eval('tr :nth-child(12)', e=>{return e.innerText});
        const var_points = await tr.$eval('tr :nth-child(13)', e=>{return e.innerText});

        var statsObj = new Stats();
        statsObj.ranking = var_ranking;
        statsObj.team = var_team;
        statsObj.gamesPlayed = var_gamesPlayed;
        statsObj.wins = var_wins;
        statsObj.overtimeWin = var_overtimeWin;
        statsObj.overtimeLoss = var_overtimeLoss;
        statsObj.losses = var_losses;
        statsObj.goalsFor = var_goalsFor;
        statsObj.goalsAgainst = var_goalsAgainst;
        statsObj.diff = var_diff;
        statsObj.penalties = var_penalties;
        statsObj.points = var_points;

        statsObj.save((err)=>{
          if(!err)console.log('successfully saved');
          else console.log('something went wrong! Fix it..' + err);
        });
      }
    }
    await browser.close();
  })();
};

//get all stats
module.exports.getStats = async (req, res) => {
  try {
    const stats = await Stats.find();
    res.json(stats);
  } catch (error) {
    res.status(500).json({message: error.message})
  }
};
