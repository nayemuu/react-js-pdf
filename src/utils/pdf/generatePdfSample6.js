import { jsPDF } from "jspdf";

export const generatePdfSample = () => {
  // Default export is a4 paper, portrait, using millimeters for units
  const document = new jsPDF();

  let content =
    "Computeristhemostwonderfulinventionofmodernscience.Itisoftenconsideredtobeasubstituteforthehumanbraininthedigitalworld.Thereishardlyanysectorsinourlife,wherewedonotusecomputer.Inagricultural,medical,educational,communicationandtransformationsectors,wehavebeenabletoattainthegreatachievementswiththehelpofcomputer.";

  let pageWidth = document.internal.pageSize.getWidth();

  const maxWidth = pageWidth - 2 * 10; // - 2 * 10 বিয়োগ করার কারণ হচ্ছে, left side and right side থেকে 10 pt জায়গা ফাঁকা রাখতে চাই

  let finalContent = document.splitTextToSize(content, maxWidth);

  console.log("finalContent = ", finalContent);

  document.text(finalContent, 10, 10);

  document.save("name.pdf"); // name of pdf
};
