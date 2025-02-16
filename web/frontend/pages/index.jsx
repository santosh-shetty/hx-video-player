import React, { useState } from "react";
import {
  Page,
  LegacyCard,
  Form,
  FormLayout,
  TextField,
  Checkbox,
  Select,
  Button,
  Layout,
  Stack,
  Tabs,
} from "@shopify/polaris";
import ShopifyVideoPicker from "../components/ShopifyVideoPicker";
import RenderLivePreview from "../components/RenderLivePreview";

const VideoPlayerForm = () => {

   const tabOptions = [
     { id: "settings", content: "Settings" },
     { id: "preview", content: "Live Preview" },
   ];
   const [selectedTab, setSelectedTab] = useState(0);
   
  const [formState, setFormState] = useState({
    playerName: "My Video Player",
    containerWidth: "100",
    theme: "vjs-theme-fantasy",
    margin: "60px 0px 60px 0px",
    padding: "0px",
    alignment: "center",
    gap: "20",
    columns: "1",
    videoBlocks: [
      {
        id: 1,
        videoSource: "external",
        shopifyVideoUrl: "",
        externalVideoUrl: "https://widgetic.com/assets/widgets/demo/Videos/Ladybug.mp4",
        videoPoster:
          "https://images.unsplash.com/photo-1579353977828-2a4eab540b9a?q=80&w=1374&auto=format&fit=crop",
        autoplay: false,
        loop: false,
        muted: false,
        fluid: true,
        playbackRates: "0.5,1,1.5,2",
      },
    ],
  });

    const handleTabChange = (selectedTabIndex) => {
      setSelectedTab(selectedTabIndex);
    };

  const handleChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleVideoBlockChange = (index, field, value) => {
    const updatedBlocks = [...formState.videoBlocks];
    updatedBlocks[index][field] = value;
    setFormState((prev) => ({ ...prev, videoBlocks: updatedBlocks }));
  };

  const handleShopifyVideoPicker = (index, field, shopifyVideo) => {
    const updatedBlocks = [...formState.videoBlocks];
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      videoSource: field,
      shopifyVideoUrl: shopifyVideo.videoUrl,
      videoPoster: shopifyVideo.previewImage,
      externalVideoUrl: "",
    };
    setFormState((prev) => ({ ...prev, videoBlocks: updatedBlocks }));
  };

  const addVideoBlock = () => {
    const newBlock = {
      id: Date.now(),
      videoSource: "shopify",
      shopifyVideoUrl: "",
      externalVideoUrl: "",
      videoPoster: "",
      autoplay: false,
      loop: false,
      muted: false,
      fluid: true,
      playbackRates: "0.5,1,1.5,2",
    };
    setFormState((prev) => ({ ...prev, videoBlocks: [...prev.videoBlocks, newBlock] }));
  };


   const handleSubmit = async () => {
     try {
       const response = await fetch(`/api/save-video-player-settings`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(formState),
       });

       if (response.ok) {
         console.log("Settings saved successfully!");
       } else {
         console.error("Error saving settings:", response.statusText);
       }
     } catch (error) {
       console.error("Error saving settings:", error);
     }
   };

  const renderSettingsForm = () => {
    return (
        <LegacyCard title="Setting" sectioned>
      <Form onSubmit={handleSubmit}>
        <FormLayout>
          <TextField
            label="Video Player Name"
            value={formState.playerName}
            onChange={(value) => handleChange("playerName", value)}
            autoComplete="off"
          />
          <TextField
            type="number"
            label="Container Width (%)"
            value={formState.containerWidth}
            onChange={(value) => handleChange("containerWidth", value)}
          />
          <TextField
            label="Margin"
            value={formState.margin}
            onChange={(value) => handleChange("margin", value)}
            autoComplete="off"
          />
          <TextField
            label="Padding"
            value={formState.padding}
            onChange={(value) => handleChange("padding", value)}
            autoComplete="off"
          />
          <TextField
            type="number"
            label="Number of Columns"
            value={formState.columns}
            onChange={(value) => handleChange("columns", value)}
          />
          <TextField
            type="number"
            label="Gap (px)"
            value={formState.gap}
            onChange={(value) => handleChange("gap", value)}
          />

          {formState.videoBlocks.map((block, index) => (
            <LegacyCard key={block.id} sectioned title={`Video Block ${index + 1}`}>
              <FormLayout>
                <Select
                  label="Video Source"
                  options={[
                    { label: "Shopify Hosted Video", value: "shopify" },
                    { label: "External URL", value: "external" },
                  ]}
                  value={block.videoSource}
                  onChange={(value) =>
                    handleVideoBlockChange(index, "videoSource", value)
                  }
                />
                {block.videoSource === "shopify" ? (
                  <Stack vertical>
                    <TextField
                      label="Shopify Video URL"
                      value={block.shopifyVideoUrl}
                      onChange={(value) =>
                        handleVideoBlockChange(index, "shopifyVideoUrl", value)
                      }
                      autoComplete="off"
                    />
                    <ShopifyVideoPicker
                      onSelect={(shopifyVideo) =>
                        handleShopifyVideoPicker(index, "shopifyVideoUrl", shopifyVideo)
                      }
                    />
                  </Stack>
                ) : (
                  <TextField
                    label="External Video URL"
                    value={block.externalVideoUrl}
                    onChange={(value) =>
                      handleVideoBlockChange(index, "externalVideoUrl", value)
                    }
                    autoComplete="off"
                  />
                )}
                <TextField
                  label="Video Poster URL"
                  value={block.videoPoster}
                  onChange={(value) =>
                    handleVideoBlockChange(index, "videoPoster", value)
                  }
                  autoComplete="off"
                />
                <Stack distribution="equalSpacing">
                  <Checkbox
                    label="Autoplay"
                    checked={block.autoplay}
                    onChange={(value) => handleVideoBlockChange(index, "autoplay", value)}
                  />
                  <Checkbox
                    label="Loop"
                    checked={block.loop}
                    onChange={(value) => handleVideoBlockChange(index, "loop", value)}
                  />
                  <Checkbox
                    label="Muted"
                    checked={block.muted}
                    onChange={(value) => handleVideoBlockChange(index, "muted", value)}
                  />
                </Stack>
                <Checkbox
                  label="Fluid (Responsive)"
                  checked={block.fluid}
                  onChange={(value) => handleVideoBlockChange(index, "fluid", value)}
                />
                <TextField
                  label="Playback Rates (comma-separated)"
                  value={block.playbackRates}
                  onChange={(value) =>
                    handleVideoBlockChange(index, "playbackRates", value)
                  }
                  autoComplete="off"
                />
              </FormLayout>
            </LegacyCard>
          ))}
          <Button onClick={addVideoBlock}>Add Video Block</Button>
          <Button primary submit>
            Save Video Player
          </Button>
        </FormLayout>
      </Form>
      </LegacyCard>
    );
  };



  return (
    <Page title="Add/Edit Video Player">
      <Tabs tabs={tabOptions} selected={selectedTab} onSelect={handleTabChange} />
      <Layout>
        <Layout.Section>
          {selectedTab === 0 ? (
            renderSettingsForm()
          ) : (
            <RenderLivePreview formState={formState} />
          )}
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default VideoPlayerForm;
