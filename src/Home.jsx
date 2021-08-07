import { React, useContext } from "react";
import { Redirect } from "react-router-dom";
import { auth, storage, firestore } from "./firebase";
import { userContext } from "./App";
import VideoCard from "./VideoCard";
import "./Home.css";

let Home = () => {
  let value = useContext(userContext);


  return (
    <div>
      {value ? (
        <>
          <div className="post-container">
            <VideoCard />
            <VideoCard />
            <VideoCard />
          </div>
          <button
            className="logout-btn"
            onClick={() => {
              auth.signOut();
            }}
          >
            Logout
          </button>

          <label className="upload-btn">
            <input
              type="file"
              onChange={(e) => {
                if (!e.target.files[0]) return;

                let { name, size, type } = e.target.files[0];
                let file = e.target.files[0];
                console.log(name);
                size = size / 1000000; // mb conversion

                type = type.split("/")[0];

                if (type != "video") {
                  alert("Please Upload a video");
                  return;
                }

                if (size > 10) {
                  alert("file is too big");
                  return;
                }

                //using the firebase storage object we are getting reference of a file location
                //in our case posts/userId/fileName and uploading our file to that location
                let upLoadTask = storage
                  .ref(`/posts/${value.uid}/${name}`)
                  .put(file);

                /* ->jab thodi si file upload hoti hai
                   -> snapshot obj uploadTask dega*/
                let f1 = (snapshot) => {
                  console.log(snapshot.byteTransferred);
                  console.log(snapshot.tottalBytes);
                };

                /*-> error-handling
                  -> error uploadTask se he ayeega agr koi hoga to*/
                let f2 = (error) => {
                  console.log(error);
                };

                /* file upload hone ke bad*/
                let f3 = () => {
                  upLoadTask.snapshot.ref.getDownloadURL().then((url) => {

                    firestore.collection("posts").add({
                      userName: value.displayName,
                      url,
                      likes:0,
                      comments:[]
                    });


                  });
                };

                // the upload method gives us uploadTask which can be used to set up
                //state_changed event
                //this takes 3 callbacks
                upLoadTask.on("state_changed", f1, f2, f3);
              }}
            />
            Upload
          </label>
        </>
      ) : (
        <Redirect to="/" className="upload-btn" />
      )}
    </div>
  );
};

export default Home;
