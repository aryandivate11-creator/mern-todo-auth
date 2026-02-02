import xlsx from "xlsx";

export const parseExcel = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const data = xlsx.utils.sheet_to_json(sheet);

  return data.map(row => row.title?.trim()).filter(Boolean);
};
