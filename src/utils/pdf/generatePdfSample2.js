import { jsPDF } from "jspdf";

export const generatePdfSample = () => {
  const document = new jsPDF({
    orientation: "p",
    unit: "mm",
  });
  // p = portrait
  // mm = millimeters

  // pageWidth এর আমরা দুই ভাবে নিতে পারি
  const pageWidth = document.internal.pageSize.width;
  const pageWidth2 = document.internal.pageSize.getWidth();

  console.log("page width =", pageWidth);
  console.log("page width2 =", pageWidth2);

  const title = "Hello world!";
  const titleWidth = document.getTextDimensions(title).w;
  console.log("title =", titleWidth);

  const x = (pageWidth - titleWidth) / 2;
  document.text(title, x, 14);

  document.save("name.pdf"); // name of pdf
};
