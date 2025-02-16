import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { VideoSettings } from "../db/models.js";

export const GetAllVideoSettings = async (req, res) => {
  try {
    const [videoSettings] = await db.select().from(VideoSettings);
    return res.status(200).json({
      success: true,
      data: videoSettings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const CreateVideoPlayer = async (req, res) => {
  const {
    playerName,
    containerWidth,
    theme,
    margin,
    padding,
    alignment,
    gap,
    columns,
    videoBlocks,
  } = req.body;
  await db.transaction(async (tx) => {
    var videoBlocksJson = JSON.stringify(videoBlocks);
    try {
      const settings = {
        playerName,
        containerWidth,
        theme,
        margin,
        padding,
        alignment,
        gap,
        columns,
        videoBlocks: videoBlocksJson,
      };
      const [resp] = await tx.insert(VideoSettings).values(settings);

      if (!resp.affectedRows) {
        throw new Error("Failed to Save Video Setting.");
      }
      return res.status(201).json({
        success: true,
        message: "Video Setting successfully Save!",
      });
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    }
  });
};

export const EditVideoSetting = async (req, res) => {
  const { id } = req.params;
  const {
    playerName,
    containerWidth,
    theme,
    margin,
    padding,
    alignment,
    gap,
    columns,
    videoBlocks,
  } = req.body;

  const videoBlocksJson = JSON.stringify(videoBlocks);

  try {
    const settings = {
      playerName,
      containerWidth,
      theme,
      margin,
      padding,
      alignment,
      gap,
      columns,
      videoBlocks: videoBlocksJson,
    };

    const [updateResult] = await db
      .update(VideoSettings)
      .set(settings)
      .where(eq(VideoSettings.id, id));

    if (!updateResult.affectedRows) {
      return res.status(404).json({
        success: false,
        message: "Video Setting not found or no changes made.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Video Setting successfully updated!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const GetVideoSettingById = async (req, res) => {
  const { id } = req.params;

  try {
    const [videoSetting] = await db
      .select()
      .from(VideoSettings)
      .where(eq(VideoSettings.id, id));

    if (!videoSetting) {
      return res.status(404).json({
        success: false,
        message: "Video Setting not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: videoSetting,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const DeleteVideoSetting = async (req, res) => {
  const { id } = req.params;

  try {
    const [deleteResult] = await db.delete(VideoSettings).where(eq(VideoSettings.id, id));

    if (!deleteResult.affectedRows) {
      return res.status(404).json({
        success: false,
        message: "Video Setting not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Video Setting successfully deleted!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
