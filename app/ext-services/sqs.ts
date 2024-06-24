const { SQSClient } = require("@aws-sdk/client-sqs");
const { SendMessageCommand } = require("@aws-sdk/client-sqs");

const REGION = "ap-south-1";
const sqsClient = new SQSClient({ region: REGION });

const SQS_QUEUE_URL =
  "https://sqs.ap-south-1.amazonaws.com/167572213833/tasks_01";

const params = {
  DelaySeconds: 10,
  MessageAttributes: {
    Title: {
      DataType: "String",
      StringValue: "The Whistler"
    },
    Author: {
      DataType: "String",
      StringValue: "John Grisham"
    },
    WeeksOn: {
      DataType: "Number",
      StringValue: "6"
    }
  },
  MessageBody:
    "Information about current NY Times fiction bestseller for week of 12/11/2016.",
  // MessageDeduplicationId: “TheWhistler”, // Required for FIFO queues
  // MessageGroupId: “Group1”, // Required for FIFO queues
  QueueUrl: SQS_QUEUE_URL //SQS_QUEUE_URL; e.g., ‘https://sqs.REGION.amazonaws.com/ACCOUNT-ID/QUEUE-NAME’
};

export async function run() {
  try {
    const data = await sqsClient.send(new SendMessageCommand(params));
    console.log("Success, message sent. MessageID:", data.MessageId);
    return data;
  } catch (error: any) {
    console.log("Err is " + error.message);
  }
}

// export { run };
