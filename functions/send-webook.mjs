const { supabase } = require("../utils/database");
import fetch from 'node-fetch';
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
    username: "Benediction Queue Status",
    embeds: [{
      "title": `Number in queue 0`,
      "description": `Blizzard ETA: 0`,
      "image": {
        "url": queueUrl
      },
      "footer": {
        "text": `${queueData.as_of} EST`
      }
    }]
    }), 
    headers: { 'Content-Type': 'application/json' }
}
    try {

      discordData.forEach(url => {
        console.log(url.discord_url);
        fetch(url.discord_url, options)
      })
    
  } catch (error) {
    
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ discordData, queueData }),
  };
 
}