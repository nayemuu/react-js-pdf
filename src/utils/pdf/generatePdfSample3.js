import { jsPDF } from "jspdf";

export const generatePdfSample = () => {
  // Default export is a4 paper, portrait, using millimeters for units
  const document = new jsPDF();

  let content =
    "Computer is the most wonderful invention of modern science.It is often considered to be a substitute for the human brain in the digital world. There is hardly any sectors in our life, where we do not use computer. In agricultural, medical, educational, communication and transformation sectors, we have been able to attain the great achievements with the help of computer.";
  document.text(content, 10, 10);

  document.save("name.pdf"); // name of pdf
};
