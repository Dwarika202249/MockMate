const pdfParse = require('pdf-parse');

const extractTextFromPDF = async (pdfBuffer) => {
  try {
    const data = await pdfParse(pdfBuffer);
    return data.text;
  } catch (error) {
    throw new Error('Failed to parse PDF');
  }
};

module.exports = { extractTextFromPDF };
