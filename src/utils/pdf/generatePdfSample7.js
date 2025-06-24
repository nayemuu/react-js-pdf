import { jsPDF } from "jspdf";

export const generatePdfSample = () => {
  // Default export is a4 paper, portrait, using millimeters for units
  const document = new jsPDF();

  let content =
    "Computer is the most wonderful invention of modern science.It is often considered to be a substitute for the human brain in the digital world. There is hardly any sectors in our life, where we do not use computer. In agricultural, medical, educational, communication and transformation sectors, we have been able to attain the great achievements with the help of computer.";

  let content2 =
    "Traffic jams are a common problem in every big city, causing delays and frustration for everyone. Understanding traffic jam, its causes, effects, and solutions is important for students because it relates to everyday life and helps create awareness about city development and better habits. This article will provide clear, grade-wise paragraphs, Bengali meaning, writing strategies, facts, and FAQs on the topic traffic jam.";

  let pageWidth = document.internal.pageSize.getWidth();
  const margin = 10;
  const maxWidth = pageWidth - 2 * margin; // - 2 * 10 বিয়োগ করার কারণ হচ্ছে, left side and right side থেকে 10 pt জায়গা ফাঁকা রাখতে চাই

  // Split and write first content
  let finalContent = document.splitTextToSize(content, maxWidth);

  document.text(finalContent, margin, margin);

  // Calculate Y position for next content
  const lineHeight = 7; // মনে করি finalContent এর প্রত্যেকটা লাইন 7pt পরিমাণ hight জায়গা নিয়েছে

  // তাহলে পরবর্তী content এর জন্য y-axis এর position বের করি
  const nextY = margin + finalContent.length * lineHeight;

  // Split and write second content (optional if you want to wrap it as well)
  const finalContent2 = document.splitTextToSize(content2, maxWidth);
  document.text(finalContent2, margin, nextY);

  document.save("name.pdf"); // name of pdf
};
