import React from "react";
import * as tf from "@tensorflow/tfjs";

// Create a function to classify the image with a Readable stream
const classifyImage = async (image, setData) => {
  let Model;
  const worker = new Worker(new URL("./Worker.js", import.meta.url));

  function indexOfMax(arr) {
    if (arr.length === 0) {
      return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
      if (arr[i] > max) {
        maxIndex = i;
        max = arr[i];
      }
    }

    return maxIndex;
  }

  if (!Model) {
    console.log(tf);
    // Make sure to update the NEXT_PUBLIC_MODEL_URL environment variable on Vercel (or .env file) to point to the model.json file
    Model = await tf.loadGraphModel(process.env.NEXT_PUBLIC_MODEL_URL);
  }

  const b = Buffer.from(
    image.replace(/^data:image\/(png|jpeg);base64,/, ""),
    "base64"
  );

  var img = new Image();
  img.src = image;
  var input = tf.browser.fromPixels(img);
  const data = JSON.stringify(input.arraySync());

  worker.postMessage(data);

  worker.onmessage = (e) => {
    setData(e.data);
  };
};

export default classifyImage;
