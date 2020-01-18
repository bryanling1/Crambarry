import firebase from "firebase/app"
import "firebase/firestore";
import "firebase/auth"
var config = {
apiKey: "AIzaSyB04OlaeF7BqbfC44Etwu5q9xFqdmO3Nxc",
authDomain: "studylobby.firebaseapp.com",
databaseURL: "https://studylobby.firebaseio.com",
projectId: "studylobby",
storageBucket: "studylobby.appspot.com",
messagingSenderId: "243694196986"
};
firebase.initializeApp(config);
firebase.firestore().settings({ timestampsInSnapshots: true });

export default firebase