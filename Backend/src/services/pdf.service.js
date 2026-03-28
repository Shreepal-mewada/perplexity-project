import { PDFParse } from "pdf-parse";

/**
 * Extracts plain text from a PDF buffer.
 * @param {Buffer} buffer — raw file buffer from multer
 * @returns {{ text: string, pageCount: number }}
 */
export async function extractTextFromPdf(buffer) {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error(
      `PDF_CORRUPT: The uploaded PDF could not be read. Please ensure it is a valid, uncorrupted PDF file.`,
    );
  }

  let data;
  try {
    const parser = new PDFParse({ data: buffer });
    data = await parser.getText();
  } catch (err) {
    throw new Error(
      `PDF_CORRUPT: The uploaded PDF could not be read. Please ensure it is a valid, uncorrupted PDF file.`,
    );
  }

  const text = data.text?.trim();

  if (!text || text.length < 20) {
    throw new Error(
      `PDF_EMPTY: This PDF appears to be empty or image-only (scanned). Text extraction is not supported for image-only PDFs.`,
    );
  }

  return {
    text,
    pageCount: data.total ?? data.numpages ?? 0,
  };
}
