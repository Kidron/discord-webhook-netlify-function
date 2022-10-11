const { supabase } = require("../utils/database");
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const dotenv = require("dotenv").config();
// const Discord = require('discord.js');
// const client = new Discord.Client();

// const WHAT_CHANNEL = process.env.WHAT_CHANNELID;
// const WHAT_WHATHOOK_URL = process.env.WHAT_WHATHOOK_URL;
// const options = {
//   hostname: WHAT_WHATHOOK_URL.hostname,
//   path: WHAT_WHATHOOK_URL.pathname,
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' }
// }
const whatSite = 'https://multidollar.company/';



exports.handler = async (event, context) => {


  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath,
    headless: true,
    ignoreHTTPSErrors: true,
});

  const page = await browser.newPage();

  const elementFound = async (ele) => {
    try {

      console.log("Element", ele);
      return await page.$eval(ele, (el) => el.innerText);
      
    } catch (error) {
      console.log("No queue at this time");
        // numberInQueue = 0;
        // blizzETA = "None";
        // asOf = "N/A"
    }

  }

  try {
    
    await page.goto(whatSite);

    const screenshot = await page.screenshot();

      let numberInQueue = await elementFound('body > section:nth-child(1) > div > h2 > div:nth-child(1) > span');

      console.log(numberInQueue);
  
      let blizzETA = await elementFound('body > section:nth-child(1) > div > h2 > div:nth-child(2) > span')

  
      let asOf = await elementFound('body > section:nth-child(1) > div > p');
  
      // let test1 = await elementFound('body > section:nth-child(233)');
    

    await browser.close();

      let queueUrl = "";
      if(screenshot) {

        console.log("Screenshot if statement");
        const { data, error } = await supabase
        .storage
        .from('public')
        .upload('current-bene-queue.png', screenshot, {
          upsert: true,
          contentType: 'image/png'
        });
  
        console.log("Line 75", data);

        if(error) {
          console.log(error);
        }

        if(data) {
          queueUrl = data.Key
          console.log("Line 82", data);
      }
    }

    console.log("This code ran");

      const { data, error } = await supabase
      .from("benediction-queue")
      .update({
        updated_at: new Date().toISOString().toLocaleString('en-US'),
        number_in_queue : numberInQueue,
        blizzard_eta: blizzETA,
        as_of: asOf,
        queue_url: queueUrl
      })
      .match({
        id: 1
      })

      


    return {
      statusCode: 200,
      body: JSON.stringify(
        { 
          data
        })
    }


    } catch (error) {
    await browser.close();
    console.log(error);
    return {
        statusCode: 500,
        body: JSON.stringify({error: 'Failed'}),
    }
  }   
}