import React, { useRef, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

// Import Video.js themes
import "@videojs/themes/dist/city/index.css";
import "@videojs/themes/dist/fantasy/index.css";
import "@videojs/themes/dist/forest/index.css";
import "@videojs/themes/dist/sea/index.css";
import { Text } from "@shopify/polaris";
const VideoPlayerPreview = ({
  videoUrl,
  autoplay = false,
  loop = false,
  muted = false,
  poster = "",
  fluid = false,
  playbackRates = "0.5,1,1.5,2",
  theme = "vjs-theme-fantasy",
}) => {

  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    // Convert playback rates from a comma-separated string to an array of numbers
    const playbackRatesArray = playbackRates
      .split(",")
      .map((rate) => parseFloat(rate.trim()));

    const options = {
      controls: true,
      autoplay,
      loop,
      muted,
      poster,
      fluid,
      playbackRates: playbackRatesArray,
      sources: [
        {
          src: videoUrl,
          type: "video/mp4",
        },
      ],
      controlBar: {
        volumePanel: { inline: false },
      },
    };

    // Initialize Video.js on the video element
    playerRef.current = videojs(videoRef.current, options);

    // Cleanup on unmount
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [videoUrl, autoplay, loop, muted, poster, fluid, playbackRates]);

  return (
    <div data-vjs-player>
      <video ref={videoRef} className={`video-js ${theme}`} />
    </div>
  );
};

export default VideoPlayerPreview;
