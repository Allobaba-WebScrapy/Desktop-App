import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY || "allobaba";

export function encryptData(data: any) {
  const dataString = JSON.stringify(data);
  const encryptedData = CryptoJS.AES.encrypt(dataString, SECRET_KEY).toString();
  return encryptedData;
}

export function decryptData(encryptedData: string) {
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
}

export function checkCookie(name: string, value: string): boolean {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.startsWith(name + "=")) {
      let cookieValue = cookie.substring(name.length + 1);
      cookieValue = decryptData(cookieValue)["code"];
      if (cookieValue === value) {
        return true; // Cookie exists and value matches
      }
    }
  }
  return false; // Cookie doesn't exist or value doesn't match
}

//! Simple Encryp Usage
// console.log(encryptData({ username: "john.doe", password: "password123" }));
// => U2FsdGVkX19cDXyHvds+sbwRfNyOgDPHN7H898Hj5fqcrBYXXlVnXeObmNBUtgW+oYpdILmFbTig7Ti7Kg73Zrk6dUpz037yRtKOdnMeExo=

//! Simple Decryp Usage
// console.log(
//   decryptData(
//     "U2FsdGVkX19cDXyHvds+sbwRfNyOgDPHN7H898Hj5fqcrBYXXlVnXeObmNBUtgW+oYpdILmFbTig7Ti7Kg73Zrk6dUpz037yRtKOdnMeExo="
//   )
// );
// => { username: "john.doe", password: "password123" }
