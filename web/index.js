// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import PrivacyWebhookHandlers from "./privacy.js";
import {
  CreateVideoPlayer,
  DeleteVideoSetting,
  EditVideoSetting,
  GetAllVideoSettings,
  GetVideoSettingById,
} from "./controller/VideoSetting.js";

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT || "3000", 10);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.get("/api/shopify/videos", async (req, res) => {
  try {
    const client = new shopify.api.clients.Graphql({
      session: res.locals.shopify.session,
    });

    const query = `
      query getAllVideos {
        files(first: 10, query: "filename:*.mp4 OR filename:*.mov OR filename:*.avi OR filename:*.mkv") {
          edges {
            node {
              id
              preview {
                image { 
                  src
                }
              }
              ... on Video {
                sources {
                  url
                }
              }
              alt
            }
          }
        }
      }
    `;

    const response = await client.request(query);

    const videos = response?.data?.files?.edges.map((edge) => ({
      id: edge.node.id,
      previewImage: edge.node.preview?.image?.src || null,
      videoUrl: edge.node.sources?.length > 0 ? edge.node.sources[0].url : null,
      altText: edge.node.alt || "",
    }));
    res.status(200).json({ videos });
  } catch (error) {
    console.error("Error fetching videos from Shopify:", error);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});

app.post("/api/save-video-player-settings", CreateVideoPlayer);
app.get("/api/video-settings", GetAllVideoSettings);
app.get("/api/video-settings/:id", GetVideoSettingById);
app.put("/api/video-settings/:id", EditVideoSetting);
app.delete("/api/video-settings/:id", DeleteVideoSetting);

app.get("/api/products/count", async (_req, res) => {
  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
  });

  const countData = await client.request(`
    query shopifyProductCount {
      productsCount {
        count
      }
    }
  `);

  res.status(200).send({ count: countData.data.productsCount.count });
});

app.post("/api/products", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(
      readFileSync(join(STATIC_PATH, "index.html"))
        .toString()
        .replace("%VITE_SHOPIFY_API_KEY%", process.env.SHOPIFY_API_KEY || "")
    );
});

app.listen(PORT);
