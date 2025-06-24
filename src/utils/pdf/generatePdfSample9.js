import { jsPDF } from "jspdf";

export const generatePdfSample = () => {
  // Create a new jsPDF document with portrait orientation and pixel units
  const document = new jsPDF({
    orientation: "p",
    unit: "px",
  });

  // Get the width of the page
  const pageWidth = document.internal.pageSize.width;

  // Define the text content and font size
  const title = "Hello world!";
  const fontSize = 40;
  document.setFontSize(fontSize);

  // Get text width and height for positioning and background sizing
  const textDimensions = document.getTextDimensions(title);
  const titleWidth = textDimensions.w;
  const titleHeight = textDimensions.h;

  // Define padding around the text and top margin
  const padding = 4;
  const topMargin = 10;

  // Calculate X and Y positions to center the text and apply margin
  const x = (pageWidth - titleWidth) / 2;
  const y = topMargin + titleHeight; // Y is the baseline of the text

  // Draw the green background rectangle behind the text
  document.setFillColor(0, 255, 0); // Green color
  document.rect(
    x - padding, // X start of rectangle
    y - titleHeight - padding, // Y start (adjust for text height)
    titleWidth + padding * 2, // Total width with padding
    titleHeight + padding * 2, // Total height with padding
    "F" // 'F' = fill only
  );

  // Set text color and draw the text
  document.setTextColor(0, 0, 0); // Black text
  document.text(title, x, y); // Text baseline is at Y

  // Save the PDF
  document.save("name.pdf");
};
