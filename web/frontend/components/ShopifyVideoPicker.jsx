import React, { useState } from "react";
import {
  Modal,
  Button,
  ResourceList,
  Spinner,
  TextContainer,
  Thumbnail,
} from "@shopify/polaris";

const ShopifyVideoPicker = ({ onSelect }) => {
  const [active, setActive] = useState(false);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => {
    setActive(true);
    fetchVideos();
  };

  const handleClose = () => setActive(false);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/shopify/videos");
      const data = await response.json();
      if (data?.videos) {
        setVideos(data.videos);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
    setLoading(false);
  };

  const handleSelectVideo = (video) => {
    onSelect(video);
    setActive(false);
  };

  return (
    <>
      <Button onClick={handleOpen}>Select Shopify Video</Button>
      <Modal open={active} onClose={handleClose} title="Select a Shopify Video">
        <Modal.Section>
          {loading ? (
            <Spinner accessibilityLabel="Loading videos" size="large" />
          ) : videos.length > 0 ? (
            <ResourceList
              resourceName={{ singular: "video", plural: "videos" }}
              items={videos}
              renderItem={(video) => (
                <ResourceList.Item
                  key={video.id}
                  id={video.id}
                  onClick={() => handleSelectVideo(video)}
                >
                  <Thumbnail
                    source={video.previewImage || ""}
                    alt={video.altText || "Video preview"}
                    size="large"
                  />
                  <TextContainer>
                    <p>{video.altText || "No description available"}</p>
                  </TextContainer>
                </ResourceList.Item>
              )}
            />
          ) : (
            <TextContainer>No videos found.</TextContainer>
          )}
        </Modal.Section>
      </Modal>
    </>
  );
};

export default ShopifyVideoPicker;
