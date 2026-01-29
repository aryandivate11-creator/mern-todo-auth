import { google } from "googleapis";
import { getGoogleClient } from "./googleClient.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const credentials = require("../config/google-service-account.json");

const SERVICE_ACCOUNT_EMAIL = credentials.client_email;

export const createSheetForUser = async (accessToken, email) => {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const sheets = google.sheets({ version: "v4", auth });
  const drive = google.drive({ version: "v3", auth });

  // 1️⃣ Create sheet
  const response = await sheets.spreadsheets.create({
    requestBody: {
      properties: { title: `Todo List - ${email}` },
    },
  });

  const sheetId = response.data.spreadsheetId;
    
  // 2️⃣ Share with service account
  drive.permissions.create({
    fileId: sheetId,
    requestBody: {
      type: "user",
      role: "writer",
      emailAddress: SERVICE_ACCOUNT_EMAIL,
    },
  });

  return sheetId;
};

export const appendTodoRow = async (sheetId, todo) => {
  const auth = await getGoogleClient().getClient();

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "Sheet1!A:C",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          todo.title,
          todo.completed ? "Completed" : "Pending",
          new Date().toLocaleString(),
        ],
      ],
    },
  });
};
