import { BillingInterval, LATEST_API_VERSION } from "@shopify/shopify-api";
import { shopifyApp } from "@shopify/shopify-app-express";
import { restResources } from "@shopify/shopify-api/rest/admin/2024-10";
import { MySQLSessionStorage } from "@shopify/shopify-app-session-storage-mysql";
import dotenv from "dotenv";

dotenv.config();

const billingConfig = {
  "My Shopify One-Time Charge": {
    // This is an example configuration that would do a one-time charge for $5 (only USD is currently supported)
    amount: 5.0,
    currencyCode: "USD",
    interval: BillingInterval.OneTime,
  },
};
const dbUrl = process.env.SHOPIFY_APP_MYSQL_URL;
if (!dbUrl) {
  throw new Error("Missing SHOPIFY_APP_MYSQL_URL in environment variables");
} else {
  console.log("----------DB Connected-------------");
}
const shopify = shopifyApp({
  api: {
    scopes: process.env.SCOPES,
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecretKey: process.env.SHOPIFY_API_SECRET,
    apiVersion: LATEST_API_VERSION,
    restResources,
    future: {
      customerAddressDefaultFix: true,
      lineItemBilling: true,
      unstable_managedPricingSupport: true,
    },
    billing: undefined, // or replace with billingConfig above to enable example billing
    // hostName: "shopify.hexagn.in",
  },
  auth: {
    path: "/api/auth",
    callbackPath: "/api/auth/callback",
    isOnline: false,
  },
  webhooks: {
    path: "/api/webhooks",
  },
  sessionStorage: new MySQLSessionStorage(dbUrl),
});

export default shopify;
