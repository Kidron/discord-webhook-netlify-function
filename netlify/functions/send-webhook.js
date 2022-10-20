const { supabase } = require("../../utils/database");
const fetch = require('node-fetch');
const dotenv = require("dotenv").config();



exports.handler = async (event, context) => {

  const { data: discord_data, error: discord_error } = await supabase
  .from('discord_webhooks')
  .select()
  const discordData = discord_data;

  // console.log(discordData);


  const { data: queue_data, error: queue_error } = await supabase
  .from('benediction-queue')
  .select()

  const queueData = queue_data[0];

  const queueUrl = "https://ciktdhbfjlocsbqtikcn.supabase.co/storage/v1/object/public/public/current-bene-queue.png";


  // if queue starts update queue_started to true
  if(queueData.number_in_queue > 0 && !queueData.queue_started) {
    await supabase
    .from('benediction-queue')
    .update({ queue_started: true })
    .eq('id', 1)
  } 

  if(queueData.number_in_queue < 1 && queueData.queue_started) {
    await supabase
    .from('benediction-queue')
    .update({ queue_started: false })
    .eq('id', 1)
  } 

  // if(queueData.queue_started && queueData.number_in_queue > 0) {
  //   await supabase
  //   .from('benediction-queue')
  //   .update({ notify: true })
  //   .eq('id', 1)
  // }

  // if (queueData.queue_started && queueData.notify) {
  //   await supabase
  //   .from('benediction-queue')
  //   .update({ notify: false })
  //   .eq('id', 1)
  // }

  // if(queueData.queue_started && !queueData.notify) {
  //   await supabase
  //   .from('benediction-queue')
  //   .update({ notify: true })
  //   .eq('id', 1)
  // }

// Handle queue color - default green, greater than 1 orange, more than 999 red
let embedColor = 2021216;
if (queueData.number_in_queue > 999) {
  embedColor = 16711680;
} else if (queueData.number_in_queue > 0) {
  embedColor = 16753920;
}

  

//POST to any URLs in db
  const requests = discordData.map(url => {   
     

    const discordRoleId = `<@&${url.role_id}>`

    const config = {
      method: 'POST',
      body: JSON.stringify({
        "content": `${queueData.notify ? discordRoleId : ""}`,
      username: `Benediction Current Queue: ${queueData.number_in_queue}`,
      embeds: [{
        "color": `${embedColor}`,
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

    fetch(url.discord_url, config)
  });
  const responses = await Promise.all(requests);
  const promises = responses.map(response => response.text());
  const fetchData = await Promise.all(promises);
    
  //Need to add error handling

  return {
    statusCode: 200,
    body: JSON.stringify({ 
      fetchData
    }),
  };
 
}