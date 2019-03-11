# upload-files-firebase-reactjs
upload multiples files to firebase using react.js
--------------------------
import React, { Component } from "react";
import { storage } from "../teste/app1/src/firebase";

/*

import firebase from "firebase/app"
import 'firebase/storage';


// Initialize Firebase
var config = {
    apiKey: "AIzaSyBGK732WM5IfQromUe1oBDyGlLvN06Rbao",
    authDomain: "teste-62c55.firebaseapp.com",
    databaseURL: "https://teste-62c55.firebaseio.com",
    projectId: "teste-62c55",
    storageBucket: "gs://teste-62c55.appspot.com/",
    messagingSenderId: "866284817991"
  };
  firebase.initializeApp(config);

  const storage = firebase.storage();
 
  export  {

    storage, firebase as default 
  }


*/

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      url: "",
      progress: 0
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }
  handleChange = e => {
    if (e.target.files[0]) {
      const filesToStore = e.target.files;
      let oldFiles = this.state.files;
      this.setState(() => ({ files: oldFiles.concat(...filesToStore) }));
    }
  };
  handleUpload = async () => {
    console.log(this.state.files);

    await this.state.files.map(file => {
      const uploadTask = storage.ref(`multiplos/${file.name}`).put(file);
      uploadTask.on(
        "state_changed",
        snapshot => {
          // progrss function ....
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          this.setState({ progress });
        },
        error => {
          // error function ....
          console.log(error);
        },
        () => {
          // complete function ....
          storage
            .ref("multiplos")
            .child(file.name)
            .getDownloadURL()
            .then(url => {
              console.log(url);
              this.setState({ url });
            });
        }
      );
    });

    storage
      .ref("multiplos")
      .child("multiplos")
      .getDownloadURL()
      .then(url => {
        console.log(url);
        this.setState({ url });
      });

    this.setState({
      files: [],
      url: "",
      progress: 0
    });
  };
  render() {
    const style = {
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    };
    return (
      <div style={style}>
        <progress value={this.state.progress} max="100" />
        <br />
        <input type="file" onChange={this.handleChange} multiple />
        <button onClick={this.handleUpload}>Upload</button>
        <br />
        <img
          src={this.state.url || "http://via.placeholder.com/400x300"}
          alt="Uploaded images"
          height="300"
          width="400"
        />
      </div>
    );
  }
}

export default ProfilePage;
