const { supabase } = require("../utils/database");
const fetch = require('node-fetch');
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

  console.log(queueData);

  const queueUrl = "https://ciktdhbfjlocsbqtikcn.supabase.co/storage/v1/object/public/public/current-bene-queue.png";

  const options = {
    method: 'POST',
    body: JSON.stringify({
      "content": "",
    username: `Benediction Current Queue: ${queueData.number_in_queue}`,
    embeds: [{
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
    try {

      discordData.forEach(url => {
        fetch(url.discord_url, options)
        console.log(`Webhook sent to ${url.discord_url}`);

      })
    
  } catch (error) {
    console.log(error);
    
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ discordData, queueData }),
  };
 
}