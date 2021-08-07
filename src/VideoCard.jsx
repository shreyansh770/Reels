import { React, useState } from "react";

let VideoCard = () => {
  let [boxOpen, setboxOpen] = useState(false);
  let [playVideo, setPlay] = useState(false);

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
        class="video"
        src="https://assets.mixkit.co/videos/preview/mixkit-top-aerial-shot-of-seashore-with-rocks-1090-large.mp4"
      ></video>
      <span className="material-icons-outlined like">favorite_border</span>
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
        <b>@username</b>
      </p>
      <p className="song">
        <span class="material-icons-outlined">audiotrack</span>
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

          <div className="all-comments"></div>

          <div className="comment-form">
            <input />
            <button>Post</button>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default VideoCard;
