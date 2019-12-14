import { storage } from './firebase';

export function uploadFile(file, name, cb = (progress) => console.log(progress)) {
  const storageRef = storage.ref();
  return new Promise((resolve, reject) => {
    const uploadTask = storageRef.child(name).put(file, {});
    uploadTask.on(
      'state_changed',
      snapshot => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        cb(progress);
      },
      error => {
        // Handle unsuccessful uploads
        if (error) {
          reject(error);
        }
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          resolve(downloadURL);
        });
      }
    );
  });
}
