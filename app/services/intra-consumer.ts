import dotenv from "dotenv";
const AWS = require("aws-sdk");
import { task_model } from "../models/task";
import { connectDB } from "./mongoConnector";

dotenv.config();
connectDB();

// Configure the AWS region
AWS.config.update({ region: "ap-south-1" });

// Create an SQS service object
const sqs = new AWS.SQS({ apiVersion: "2012-11-05" });

const queueUrl = process.env.AWS_SQS_QUEUE;

// Function to process messages
const processMessage = async (message: any) => {
  console.log("Processing message: ", message.Body);
  await task_model.create({ payload: message.Body });

  // Add your message processing logic here
};

// Function to delete messages from the queue
const deleteMessage = (receiptHandle: any) => {
  const deleteParams = {
    QueueUrl: queueUrl,
    ReceiptHandle: receiptHandle
  };

  sqs.deleteMessage(deleteParams, (err: any, data: any) => {
    if (err) {
      console.error("Delete Error", err);
    } else {
      console.log("Message Deleted", data);
    }
  });
};

// Function to poll the queue for messages
const pollQueue = () => {
  const receiveParams = {
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 10, // Maximum number of messages to retrieve
    WaitTimeSeconds: 20 // Enable long polling
  };

  sqs.receiveMessage(receiveParams, (err: any, data: any) => {
    if (err) {
      console.error("Receive Error", err);
    } else if (data.Messages) {
      data.Messages.forEach((message: any) => {
        processMessage(message);
        deleteMessage(message.ReceiptHandle);
      });
    }
    // Continue polling
    pollQueue();
  });
};

// Start polling the queue
pollQueue();
