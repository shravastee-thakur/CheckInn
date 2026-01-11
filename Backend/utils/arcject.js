import arcjet, { shield, detectBot } from "@arcjet/node";
import dotenv from "dotenv";
dotenv.config();

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({ mode: "LIVE", sqlInjection: true, crossSiteScripting: true }),

    detectBot({
      mode: process.env.NODE_ENV === "production" ? "LIVE" : "DRY_RUN",

      allow: [
        "CATEGORY:SEARCH_ENGINE", // Googlebot, Bingbot, etc.
        "HTTP_CLIENT:POSTMAN", // For local/dev testing
      ],
    }),
  ],
});

export default aj;
