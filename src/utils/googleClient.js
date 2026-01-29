import { google } from "googleapis";
import fs from "fs";
import path from "path";

const KEY_PATH = path.resolve("src/config/google-service-account.json");

export const getGoogleClient = () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_PATH,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return auth;
};
