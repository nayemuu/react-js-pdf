import { jsPDF } from "jspdf";

export const generatePdfSample = () => {
  // Default export is a4 paper, portrait, using millimeters for units
  const document = new jsPDF(); // variable এর নাম যে document ই দিতে হবে এর কোনো বাধ্যবাধকতা নাই. তোমার ইচ্ছামত নাম দিতে পারো
  console.log("document = ", document);

  document.text("Hello world!", 10, 10);
  // "Hello world!" হচ্ছে পিডিএফ এর জন্য একটি text, 10 দ্বারা বোঝানো হচ্ছে "Hello world!" text এর অবস্থান হবে  x -axis (x-coordinate) থেকে 10 millimeters দূরে,
  // পরের 10 দ্বারা বোঝানো হচ্ছে y-axis (y-coordinate) থেকে 10 millimeters দূরে "Hello world!" text এর অবস্থান হবে

  document.save("name.pdf"); // name of pdf
};
