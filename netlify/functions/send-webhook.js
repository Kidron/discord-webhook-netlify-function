const { supabase } = require("../../utils/database");
const fetch = require('node-fetch');
const axios = require('axios');
const dotenv = require("dotenv").config();



exports.handler = async (event, context) => {

  const { data: discord_data, error: discord_error } = await supabase
  .from('discord_webhooks')
  .select('discord_url')
  const discordData = discord_data;

  const { data: queue_data, error: queue_error } = await supabase
  .from('benediction-queue')
  .select()

  const queueData = queue_data[0];

  const queueUrl = "https://ciktdhbfjlocsbqtikcn.supabase.co/storage/v1/object/public/public/current-bene-queue.png";

  const config = {
    method: 'POST',
    body: JSON.stringify({
      "content": "",
    username: `Benediction Current Queue: ${queueData.number_in_queue}`,
    embeds: [{
      "color": `${queueData.number_in_queue > 0 ? 16711680 : 2021216}`,
      "title": `Number in queue: ${queueData.number_in_queue}`,
      "description": `Blizzard ETA: ${queueData.blizzard_eta}`,
      "image": {
        "url": queueUrl
      },
      "footer": {
        "text": `${queueData.as_of} EST \nTo add this to your server add Kidron#8857 on discord \nCredits to https://multidollar.company/, if they go down the count will be off`
      }
    }]
    }), 
    headers: { 'Content-Type': 'application/json' }
}

  // let response;

  const requests = discordData.map(url => fetch(url.discord_url, config));
  const responses = await Promise.all(requests);
  const promises = responses.map(response => response.text());
  const fetchData = await Promise.all(promises);
    // try {

      // discordData.forEach(url => {

      //     return axios(url.discord_url, config)
      //       .then(res => {
      //         console.log(`Webhook sent to ${url.discord_url}`);
      //       })

      // })



      // response = await discordData.map(url => 

      //   fetch(url.discord_url, requestOptions)

      //     )
      //     .then(result => result.text())
      //     .catch(error => throw error)
        
          // console.log(`Webhook sent to ${url.discord_url}`);
      // discordData.forEach(url => {
      //   fetch(url.discord_url, options)
      //   console.log(`Webhook sent to ${url.discord_url}`);

      // })
    
  // } catch (error) {
  //   console.log(error);

  //   return {
  //     statusCode: err.statusCode || 500,
  //     body: JSON.stringify({
  //       error: error
  //     })
  //   }
    
  // }

  return {
    statusCode: 200,
    body: JSON.stringify({ 
      fetchData
    }),
  };
 
}