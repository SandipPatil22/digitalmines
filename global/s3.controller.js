import pkg from 'aws-sdk';
const { S3, AWS } = pkg;

import { v4 as uuid } from "uuid";
import dotenv from "dotenv";

dotenv.config({
  path: "../env",
});

const s3Upload = async (files) => {
  const s3 = new S3();

  const params = files.map((file) => {
    let Key = `oremetrics/${uuid()}-${file.originalname}`;
    return {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: Key,
      Body: file.buffer,
    };
  });
  const results = await Promise.all(
    params.map((param) => s3.upload(param).promise())
  );

  return { results: results, Key: params.map(param => param.Key) };
};

export default s3Upload;