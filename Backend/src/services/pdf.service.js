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

  console.log(`[PDF Extract] Buffer size: ${buffer.length} bytes`);

  let data;
  try {
    const parser = new PDFParse({ data: buffer });
    data = await parser.getText();
    
    console.log(`[PDF Extract] Raw result type:`, typeof data);
    console.log(`[PDF Extract] Raw result keys:`, data ? Object.keys(data) : 'null');
    console.log(`[PDF Extract] Text preview:`, data?.text?.substring(0, 200));
    console.log(`[PDF Extract] Text length:`, data?.text?.length || 0);
    console.log(`[PDF Extract] Page count:`, data?.total ?? data?.numpages ?? 0);
  } catch (err) {
    console.error(`[PDF Extract] Error:`, err.message, err.stack);
    throw new Error(
      `PDF_CORRUPT: The uploaded PDF could not be read. Please ensure it is a valid, uncorrupted PDF file.`,
    );
  }

  const text = data?.text?.trim() || "";

  if (!text || text.length < 5) {
    console.warn(`[PDF Extract] Extracted text is too short (${text.length} chars). PDF may be image-only.`);
    // Instead of throwing, return what we have - the MongoDB fallback will still work
    return {
      text: text || "[This PDF appears to be image-only with no extractable text]",
      pageCount: data?.total ?? data?.numpages ?? 0,
    };
  }

  return {
    text,
    pageCount: data?.total ?? data?.numpages ?? 0,
  };
}
