import { React, useContext, useState, useEffect } from "react";
import { Redirect , Link} from "react-router-dom";
import { auth, storage, firestore } from "./firebase";
import { AuthContext } from "./AuthProvider";
import VideoCard from "./VideoCard";
import "./Home.css";

let Home = () => {
  let value = useContext(AuthContext);

  let [posts, setPosts] = useState([]);

  useEffect(() => {
    // onSnapshot -> ye ek function deta hai unsubsrcibe jisse ki hum
    // us real time communication se unsubscribe kar skte hai
    let unsubscribe = firestore
      .collection("posts")
      .onSnapshot((querySnapshot) => {
        setPosts(
          querySnapshot.docs.map((doc) => {
            return { ...doc.data(), id: doc.id };
          })
        );
      });

    // cleanUp Function->ye component ke umounting ke time
    // chalega
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      {value ? (
        <>
          <div className="post-container">
            {posts.map((post, index) => {
              return <VideoCard key={index} post={post} />;
            })}
          </div>
          <button
            className="logout-btn"
            onClick={() => {
              auth.signOut();
            }}
          >
            Logout
          </button>

          <Link to="/profile">
           <button id="profile">Profile</button>
          </Link>

          <label className="upload-btn">
            <input
              type="file"
              // -> bcoz agr hum same file choose
              // karenge to  koi change hogi he nhi
              // to onChange chlega he nhi
              // islea before selection hum usko
              // null kr deete hai
              onClick={(e) => {
                e.target.value = null;
              }}
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
                  .ref(`/posts/${value.uid}/${Date.now() + name}`)
                  .put(file);

                /* ->jab thodi si file upload hoti hai
                   -> snapshot obj uploadTask dega*/
                let f1 = (snapshot) => {
                  // console.log(snapshot.byteTransferred);
                  // console.log(snapshot.tottalBytes);
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
                      likesArr: [],
                      comments: [],
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
        <Redirect to="/"/>
      )}
    </div>
  );
};

export default Home;
