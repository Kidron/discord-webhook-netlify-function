const { supabase } = require("../utils/database");
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const dotenv = require("dotenv").config();


const whatSite = 'https://multidollar.company/';



exports.handler = async (event, context) => {


  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath,
    headless: chromium.true,
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
  
      let blizzETA = await elementFound('body > section:nth-child(1) > div > h2 > div:nth-child(2) > span')

  
      let asOf = await elementFound('body > section:nth-child(1) > div > p');
      

    await browser.close();

      let queueUrl = "";
      if(screenshot) {

        const { data, error } = await supabase
        .storage
        .from('public')
        .upload('current-bene-queue.png', screenshot, {
          upsert: true,
          contentType: 'image/png'
        });
  
        if(error) {
          console.log(error);
        }

        if(data) {
          queueUrl = data.Key
          console.log(`Bucket url ${queueUrl}`);
      }
    }

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
      console.log("Data added to supabase");

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