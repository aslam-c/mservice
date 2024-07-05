const fs = require("fs");
const path = require("path");
import {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand
} from "@aws-sdk/client-s3";

let chunkIndex = 0;
//Local Part
const prepareLocalChunksForUploading = async () => {
  const filePath = path.join(__dirname, "./abc.mp4");
  const chunkSize = 10485760;
  const readStream = fs.createReadStream(filePath, {
    highWaterMark: chunkSize
  });

  readStream.on("data", (chunk: any) => {
    const chunkFilePath = path.join(__dirname, `chunk_${chunkIndex}`);
    fs.writeFile(chunkFilePath, chunk, (err: any) => {
      if (err) {
        console.error("Error writing chunk:", err);
      } else {
        console.log(`Chunk ${chunkIndex} written successfully`);
      }
    });
    chunkIndex++;
  });

  readStream.on("end", () => {
    console.log("File reading completed");
  });

  readStream.on("error", (err: any) => {
    console.error("Error reading file:", err);
  });
};
//S3 Part
const client = new S3Client();

let UploadId: any;
const etagAndPartNumberArray: any = [];
const S3FinalKey = "";
const Bucket = "chunk-test001";
const region = "ap-south-1";

const GenerateMultiUploadId = async () => {
  try {
    const input = {
      Bucket,
      Key: S3FinalKey,
      region
    };
    const command = new CreateMultipartUploadCommand(input);
    const response = await client.send(command);
    UploadId = response.UploadId;
  } catch (error: any) {
    console.log("Upload initiation failed " + error?.message);
  }
};

const uploadChunks = async () => {
  let i;
  let PartNumber: any;
  console.log("max sizePPP ", chunkIndex);
  try {
    for (i = 0; i <= chunkIndex - 1; i++) {
      PartNumber = i + 1;
      let chunk_name = `./chunk_${i}`;
      const input: any = {
        Body: Buffer.from(fs.readFileSync(chunk_name)),
        Bucket,
        Key: S3FinalKey,
        PartNumber,
        UploadId
      };

      console.log("Uping ", i);

      const command = new UploadPartCommand(input);
      const response = await client.send(command);
      etagAndPartNumberArray.push({
        ETag: response.ETag,
        PartNumber: String(PartNumber)
      });
    }
  } catch (error: any) {
    console.log("Upload chunk failed " + i, " ", error.message);
  }
};
const completePartUpload = async () => {
  console.log("Complete uploads ");

  console.log(etagAndPartNumberArray);

  const input: any = {
    Bucket,
    Key: S3FinalKey,
    MultipartUpload: {
      Parts: etagAndPartNumberArray
    },
    UploadId
  };
  const command = new CompleteMultipartUploadCommand(input);
  const response = await client.send(command);
};

//s3 invoke block
const startS3Task = async () => {
  await GenerateMultiUploadId();
  await uploadChunks();
  await completePartUpload();
};

prepareLocalChunksForUploading();
startS3Task();
