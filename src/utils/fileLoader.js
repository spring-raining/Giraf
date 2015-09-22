const supportedImageTypes = [
  "image/gif",
  "image/png",
  "image/jpeg",
];

const supportedVideoTypes = [
  "video/mp4",
];

export default {
  check: (file) => {
    return (supportedImageTypes.indexOf(file.type) >= 0
         || supportedVideoTypes.indexOf(file.type) >= 0);
  },
  run: (file, fileApiObj) => {
    let p = new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(fileApiObj)
    });
    p.then(
      (result) => {
        file.update({content: result});
      },
      (error) => { throw error });
  }
}