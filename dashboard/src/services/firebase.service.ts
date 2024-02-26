import { initializeApp } from 'firebase/app';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyA7zEU_a3vNJJLG09uyUcnxkw0KwFilOe0',
  authDomain: 'dgefc-2023.firebaseapp.com',
  projectId: 'dgefc-2023',
  storageBucket: 'dgefc-2023.appspot.com',
  messagingSenderId: '809859987227',
  appId: '1:809859987227:web:a17411dcc670a3b00b45be',
};

initializeApp(firebaseConfig);
const storage = getStorage();

export async function uploadFileFirebaseStrategy(file: File) {
  const storageRef = ref(
    storage,
    `dgefc/${file.name}_${new Date().toISOString()}`,
  );
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
}
