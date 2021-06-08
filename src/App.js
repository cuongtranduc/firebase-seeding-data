import { useEffect } from "react";
import firebase from "firebase";
import Papa from "papaparse";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
};

firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
const csv_url =
  "https://raw.githubusercontent.com/akhiltak/inspirational-quotes/master/Quotes.csv";

function App() {
  useEffect(() => {
    firestore
      .collection("quotes")
      .get()
      .then((snapshot) => {
        console.log("snapshot", snapshot);
        if (snapshot.size === 0) {
          return fetch(csv_url).then(async function (response) {
            let reader = response.body.getReader();
            let decoder = new TextDecoder("utf-8");
            const result = await reader.read(); // raw array
            const csv = decoder.decode(result.value); // the csv text
            const results = Papa.parse(csv, { header: true }); // object with { data, errors, meta }
            const rows = results.data;

            await Promise.all(
              rows.map(async (row) => {
                return firestore.collection("quotes").doc(row.QUOTE).set(row);
              })
            );
            alert(`seed successfully ${rows.length} quotes`);
          });
        } else {
          console.log("number of quotes: ", snapshot.size);
        }
      });
  }, []);

  return <div></div>;
}

export default App;
