import React from "react";
import {
  LegacyCard,
  Button,
} from "@shopify/polaris";

import VideoPlayerPreview from "../components/VideoPlayerPreview";

const RenderLivePreview = ({ formState }) => {

    const generateEmbedCode = () => {
          const embedId = formState.playerName.trim()
            ? formState.playerName.replace(/\s+/g, "-").toLowerCase()
            : "video-player";
          return `<section class="video-app-section">
        <div class="video-app-container">
          ${formState.videoBlocks
            .map((block, index) => {
              return `<video id="shopify-video-${index + 1}" class="video-js ${
                formState.theme
              }" controls ${block.autoplay ? "autoplay muted" : block.muted ? "muted" : ""} ${
                block.loop ? "loop" : ""
              } poster="${block.videoPoster}" data-setup='{
              "fluid": ${block.fluid},
              "playbackRates": [${block.playbackRates}],
              "controlBar": { "volumePanel": { "inline": false } }
            }'>
            ${
              block.videoSource === "shopify" && block.shopifyVideoUrl
                ? `<source src="${block.shopifyVideoUrl}" type="video/mp4">`
                : block.videoSource === "external" && block.externalVideoUrl
                ? `<source src="${block.externalVideoUrl}" type="video/mp4">`
                : `<p class="vjs-no-js">No video selected. Please add a video from settings.</p>`
            }
            </video>`;
            })
            .join("")}
        </div>
      </section>`;
        };
      
        const copyEmbedCode = () => {
          const code = generateEmbedCode();
          navigator.clipboard.writeText(code);
        };
      


  return (
    <LegacyCard title="Live Preview" sectioned>
      <div
        style={{
          border: "1px solid #dfe3e8",
          padding: "20px",
          borderRadius: "4px",
          textAlign: formState.alignment,
          margin: formState.margin,
          width: formState.containerWidth + "%",
          display: "grid",
          gridTemplateColumns: `repeat(${formState.columns}, 1fr)`,
          gap: `${formState.gap}px`,
        }}
      >
        {formState.videoBlocks.map((block, index) => {
          const videoUrl =
            block.videoSource === "shopifyVideoUrl"
              ? block.shopifyVideoUrl
              : block.externalVideoUrl;
              
          return ( 
            <div key={block.id} style={{ padding: "10px" }}>
              <VideoPlayerPreview 
                key={index}
                videoUrl={videoUrl}
                autoplay={block.autoplay}
                loop={block.loop}
                muted={block.autoplay ? true : block.muted}
                poster={block.videoPoster}
                fluid={block.fluid}
                playbackRates={block.playbackRates}
                theme={formState.theme}
              />
            </div>
          );
        })}
        <hr />
        {/* <TextField label="Embed Code" value={generateEmbedCode()} readOnly multiline /> */}
      </div>
      <Button onClick={copyEmbedCode}>Copy Embed Code</Button>
    </LegacyCard>
  );
};

export default RenderLivePreview;
