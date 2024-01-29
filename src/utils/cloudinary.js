import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }

    //Uploading file to the server.

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // File has been uploaded.

    // console.log("File is uploaded on cloudinary on url" , response.url);

    fs.unlinkSync(localFilePath);

    console.log(response);

    return response;


  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temporay file as the upload operation is failed
  }
};

export { uploadOnCloudinary };
