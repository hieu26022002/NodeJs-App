import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: "us-east-1",     // SeaweedFS ignores region but SDK needs a value
  endpoint: "http://localhost:8333", // your SeaweedFS S3 gateway
  forcePathStyle: true,    // IMPORTANT for SeaweedFS
  credentials: {
    accessKeyId: "admin",
    secretAccessKey: "password"
  },
});

// -------------------------------
// Generate GET presigned URL
// -------------------------------
export async function presignGet(req, res) {
  const command = new GetObjectCommand({
    Bucket: "my-bucket",
    Key: "test.jpg",
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  console.log("GET Presigned URL:", url);
  res.json({ url });
}

// -------------------------------
// Generate PUT presigned URL
// -------------------------------
async function presignPut() {
  const command = new PutObjectCommand({
    Bucket: "my-bucket",
    Key: "upload.jpg",
    ContentType: "image/jpeg",
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  console.log("PUT Presigned URL:", url);
}
