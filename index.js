const {PubSub} = require('@google-cloud/pubsub');
const incomingTopicNameOrId = 'XXXX-XXXX';
const outgoingTopicNameOrId = 'XXXX-XXXX';
const subscriptionNameOrId = "XXXX-XXXX";
const timeout = 60;

const pubSubClient = new PubSub({ projectId: "XXXX-XXXX"});
const data = JSON.stringify({
  /* Enter Message Here - JSON Format */
});

async function publishMessage() {
  const dataBuffer = Buffer.from(data);

  try {
    const messageId = await pubSubClient
      .topic(outgoingTopicNameOrId)
      .publishMessage({data: dataBuffer});
    console.log(`Message ${messageId} published.`);
  } catch (error) {
    console.error(`Received error while publishing: ${error.message}`);
    process.exitCode = 1;
  }
}

async function createSubscription(){
  try{
    const subscription = await pubSubClient
    .topic(incomingTopicNameOrId)
    .createSubscription(subscriptionNameOrId);
  }
  catch (error) {
    console.error(`Received error : ${error.message}`);
    process.exitCode = 1;
  }
}

async function listenForMessages() {
  const subscription = pubSubClient.subscription(subscriptionNameOrId);
  let messageCount = 0;
  
  const messageHandler = message => {
    console.log(`Received message ${message.id}:`);
    console.log(`\tData: ${message.data}`);
    console.log(`\tAttributes: ${message.attributes}`);
    messageCount += 1;
    message.ack();
  };

  subscription.on('message', messageHandler);

  setTimeout(() => {
    subscription.removeListener('message', messageHandler);
    console.log(`${messageCount} message(s) received.`);
  }, timeout * 3000);
}

createSubscription();
listenForMessages();
publishMessage();