const { supabase } = require("../utils/database");
import fetch from 'node-fetch';
const dotenv = require("dotenv").config();



exports.handler = async (event, context) => {

  let { data, error } = await supabase
  .from('discord_webhooks')
  .select('discord_url')

  // console.log(data);

  // const WHAT_WEBHOOK_URL = data;
  // console.log(WHAT_WEBHOOK_URL);
  const options = {
    method: 'POST',
    body: JSON.stringify({
      "content":"test"
    }), 
    headers: { 'Content-Type': 'application/json' }
}
// const discordUrls = data.discord_url;
// console.log(discordUrls);
// const discordUrls = [];
    try {

      // const discordUrls = data.map(url => {
      //   console.log(url);
      // })

      data.forEach(url => {
        console.log(url.discord_url);
        fetch(url.discord_url, options)
      })
    
  } catch (error) {
    
  }
  // console.log(discordUrls);

  return {
    statusCode: 200,
    body: JSON.stringify({ data }),
  };
 
}