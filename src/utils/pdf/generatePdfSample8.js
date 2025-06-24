import { jsPDF } from "jspdf";

export const generatePdfSample = () => {
  const document = new jsPDF();

  const content =
    "Computer is the most wonderful invention of modern science. It is often considered to be a substitute for the human brain in the digital world. There is hardly any sector in our life where we do not use computers. In agricultural, medical, educational, communication, and transportation sectors, we have been able to attain great achievements with the help of computers.";

  const content2 =
    "Traffic jams are a common problem in every big city, causing delays and frustration for everyone. Understanding traffic jam, its causes, effects, and solutions is important for students because it relates to everyday life and helps create awareness about city development and better habits. This article will provide clear, grade-wise paragraphs, Bengali meaning, writing strategies, facts, and FAQs on the topic traffic jam.";

  const pageWidth = document.internal.pageSize.getWidth();
  const margin = 10;
  const maxWidth = pageWidth - 2 * margin;

  const fontSize = 12;
  const lineHeight = 6;

  document.setFontSize(fontSize);

  const finalContent = document.splitTextToSize(content, maxWidth);

  let currentY = margin;
  finalContent.forEach((line) => {
    document.text(line, margin, currentY);
    currentY += lineHeight;
  });

  const finalContent2 = document.splitTextToSize(content2, maxWidth);
  finalContent2.forEach((line) => {
    document.text(line, margin, currentY + 5);
    currentY += lineHeight;
  });

  document.save("name.pdf");
};
