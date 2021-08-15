import { useContext, useEffect, useState } from "react";
import { firestore } from "./firebase";

import { AuthContext } from "./AuthProvider";

let VideoCard = (props) => {
  let [boxOpen, setboxOpen] = useState(false);
  let [playVideo, setPlay] = useState(false);
  let [currentUserComment, setCurrentUserComment] = useState("");
  let [allComments, setAllComments] = useState([]);
  let [postLikeArr, setPostLikeArr] = useState([]);
  // let [ulikedArr , setUserLikeArr] = useState([]);

  let value = useContext(AuthContext);

  useEffect(() => {
    let f = async () => {
      let allCommentId = props.post.comments;
      let arr = [];

      for (let i = 0; i < allCommentId.length; i++) {
        let id = allCommentId[i];

        let doc = await firestore.collection("comments").doc(id).get();
        let commentData = { ...doc.data(), id: doc.id };
        arr.push(commentData);
      }

      setAllComments(arr);
      setPostLikeArr(props.post.likesArr);
    };

    f();
  }, [props]);

  return (
    <div className="videoCard">
      <video
        onClick={(e) => {
          if (playVideo) {
            setPlay(false);
            e.currentTarget.pause();
          } else {
            setPlay(true);
            e.currentTarget.play();
          }
        }}
        className="video"
        src={props.post.url} // firebase se mil raha hai ye URL
      ></video>
      <>
        {postLikeArr.includes(value.uid) ? (
          <span className="material-icons-outlined like">favorite</span>
        ) : (
          <span
            className="material-icons-outlined like"
            onClick={async () => {
              console.log(props.post.id);

              let u = await firestore
                .collection("posts")
                .doc(props.post.id)
                .update({ likesArr: [...props.post.likesArr, value.uid] });
            }}
          >
            favorite_border
          </span>
        )}
      </>
      <span
        className="material-icons-outlined comment"
        onClick={() => {
          if (boxOpen) setboxOpen(false);
          else setboxOpen(true);
        }}
      >
        chat_bubble_outline
      </span>
      <p className="username">
        <b>{props.post.userName}</b>
      </p>
      <p className="song">
        <span className="material-icons-outlined">audiotrack</span>
        <marquee>song name</marquee>
      </p>

      {boxOpen ? (
        <div className="comment-box">
          <button
            onClick={() => {
              setboxOpen(false);
            }}
          >
            Close
          </button>

          <div className="all-comments">
            {allComments.map((comment, index) => {
              return (
                <div key={index}>
                  <img className="video-img" src={comment.pic} />
                  <div>
                    <p>
                      <b>{comment.username}</b>
                    </p>
                    <p className="inner-comment">{comment.comment}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="comment-form">
            <input
              type="text"
              value={currentUserComment}
              onChange={(e) => {
                setCurrentUserComment(e.currentTarget.value);
              }}
            />
            <button
              onClick={() => {
                let p = firestore.collection("comments").add({
                  comment: currentUserComment,
                  username: value.displayName,
                  pic: value.photoURL,
                });

                setCurrentUserComment("");

                p.then((docRef) => {
                  return docRef.get();
                }).then((doc) => {
                  console.log(props.post.id);
                  firestore
                    .collection("posts")
                    .doc(props.post.id)
                    .update({
                      comments: [...props.post.comments, doc.id],
                    });
                });
              }}
            >
              Post
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default VideoCard;
