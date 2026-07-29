import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // @ts-expect-error externalPackages is supported at runtime but not in the TS type defs for v1.20.2
  externalPackages: [
    "duckdb",
    "bcryptjs",
    "jose",
    "leaflet",
    "react-leaflet",
    "react-day-picker",
    "react-hook-form",
    "zod",
    "recharts",
    "framer-motion",
    "html2canvas",
    "jspdf",
    "qrcode",
    "otpauth",
    "@tinymce/tinymce-react",
    "ioredis",
    "socket.io-client",
  ],
});
