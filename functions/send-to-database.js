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
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
});

  const page = await browser.newPage();


  try {
    
    await page.goto(whatSite);

    const screenshot = await page.screenshot();
    const numberInQueue = await page.$eval('body > section:nth-child(1) > div > h2 > div:nth-child(1) > span', (el) => el.innerText);
    const blizzETA = await page.$eval('body > section:nth-child(1) > div > h2 > div:nth-child(2) > span', (el) => el.innerText);


    await browser.close();

      //send text to supbase
      // const { data, error } = await supabase
      // .from('benediction-queue')
      // .update({
      //   number_in_queue: numberInQueue,
      //   blizzard_eta: blizzETA,
      //   updated_at: new Date().toISOString().toLocaleString('en-US'),
      // }).match({
      //   id: 1,
      // })
      // console.log(data);
      let queueUrl = "";
      if(screenshot) {
        const { data, error } = await supabase
        .storage
        .from('images')
        .upload('public/', screenshot);
  
        console.log(data);

        if(error) {
          console.log(error);
        }

        if(data) {
          console.log(data);
      }
    }

      const { data, error } = await supabase
      .from("benediction-queue")
      .update({
        updated_at: new Date().toISOString().toLocaleString('en-US'),
        number_in_queue : numberInQueue,
        blizzard_eta: blizzETA,
        queue_url: screenshot
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