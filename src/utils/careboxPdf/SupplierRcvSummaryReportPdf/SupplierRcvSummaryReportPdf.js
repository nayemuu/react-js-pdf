import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  LOGO,
  LOGO_TYPE,
  LOGO_X_POSITION,
  LOGO_Y_POSITION,
  LOGO_HEIGHT,
  LOGO_WIDTH,
  COMPANY_NAME,
  FONT_WEIGHT_FOR_COMPANY_NAME,
  FONT_SIZE_FOR_COMPANY_NAME,
  COMPANY_NAME_Y_POSITION,
  MARGIN_BOTTOM_AFTER_COMPANY_NAME,
  CARE_BOX_ADDRESS,
  FONT_SIZE_FOR_CARE_BOX_ADDRESS,
  FONT_WEIGHT_FOR_CARE_BOX_ADDRESS,
  MARGIN_BOTTOM_FOR_CARE_BOX_ADDRESS,
  FONT_SIZE_FOR_PDF_TITLE,
  FONT_WEIGHT_FOR_PDF_TITLE,
  MARGIN_BOTTOM_FOR_PDF_TITLE,
  MAXGIN_X,
  MAXGIN_Y,
  FONT_FAMILY,
  FONT_SIZE_FOR_AUTO_TABLE,
} from "../../configs/portraitPdfConfigs";
import { convertDate, convertTime } from "../../ConvertDateTime";
import { isValidNumber } from "../../dataTypeCheck";

const addFooters = (doc, date, time) => {
  const pageCount = doc.internal.getNumberOfPages();
  doc.setFontSize(8);
  for (var i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      "Date:" + convertDate(date),
      MAXGIN_X,
      doc.internal.pageSize.height - 10
    );
    doc.text(
      "Page " + String(i) + " of " + String(pageCount),
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      {
        align: "center",
      }
    );

    let time_string = "Time:" + time;

    doc.text(
      time_string,
      doc.internal.pageSize.width -
        doc.getTextDimensions(time_string).w -
        MAXGIN_X,
      doc.internal.pageSize.height - 10
    );
  }
};

const SupplierRcvSummaryReportPdf = (data, reportTitle, pdfTitle) => {
  const date = new Date();
  //   console.log("data = ", data);

  if (data?.data?.results?.length) {
    // console.log("data.data.results = ", data.data.results);
  } else {
    return alert("No Data Found");
  }

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Create and embed logo image
  const img = new Image();
  img.src = LOGO;

  //Tracking_variable
  let lastYPosition = 0;

  //reuseable_variable
  let textWidth;
  let textXPosition;
  let textDimensions;

  img.onload = () => {
    // Care-Box Logo
    doc.addImage(
      img,
      LOGO_TYPE,
      LOGO_X_POSITION,
      LOGO_Y_POSITION,
      LOGO_WIDTH,
      LOGO_HEIGHT
    );

    // Care-Box Title
    doc.setFont(FONT_FAMILY, FONT_WEIGHT_FOR_COMPANY_NAME);
    doc.setFontSize(FONT_SIZE_FOR_COMPANY_NAME);

    textWidth = doc.getTextDimensions(COMPANY_NAME).w;
    textXPosition = (pageWidth - textWidth) / 2;

    textDimensions = doc.getTextDimensions(COMPANY_NAME);
    doc.text(
      COMPANY_NAME,
      textXPosition,
      COMPANY_NAME_Y_POSITION + textDimensions.h
    );

    lastYPosition +=
      COMPANY_NAME_Y_POSITION +
      textDimensions.h +
      MARGIN_BOTTOM_AFTER_COMPANY_NAME;

    // Care-Box Address
    doc.setFontSize(FONT_SIZE_FOR_CARE_BOX_ADDRESS);
    doc.setFont(FONT_FAMILY, FONT_WEIGHT_FOR_CARE_BOX_ADDRESS);
    textWidth = doc.getTextDimensions(CARE_BOX_ADDRESS).w;
    textXPosition = (pageWidth - textWidth) / 2;
    textDimensions = doc.getTextDimensions(CARE_BOX_ADDRESS);

    doc.text(CARE_BOX_ADDRESS, textXPosition, lastYPosition + textDimensions.h);

    lastYPosition += textDimensions.h + MARGIN_BOTTOM_FOR_CARE_BOX_ADDRESS;

    // Pdf Title
    doc.setFont(FONT_FAMILY, FONT_WEIGHT_FOR_PDF_TITLE);
    doc.setFontSize(FONT_SIZE_FOR_PDF_TITLE);

    textWidth = doc.getTextDimensions(reportTitle).w;
    textXPosition = (pageWidth - textWidth) / 2;
    textDimensions = doc.getTextDimensions(reportTitle);

    doc.text(reportTitle, textXPosition, lastYPosition + textDimensions.h);

    lastYPosition += textDimensions.h + MARGIN_BOTTOM_FOR_PDF_TITLE;

    //Supplier
    data.data.results.map((supplier) => {
      //   console.log("supplier = ", supplier);

      let headerRows = [
        [
          {
            content: `Supplier Name : ${supplier.supplier_name}`,
            colSpan: 10,
            styles: { valign: "middle", halign: "center" },
          },
        ],

        [
          {
            content: "Purchase ID",
            styles: { valign: "middle", halign: "center" },
          },
          {
            content: "Purchase Reference",
            styles: { valign: "middle", halign: "center" },
          },
          {
            content: "Purchase Date",
            styles: { valign: "middle", halign: "center" },
          },
          {
            content: "Total Purchase Value",
            styles: { valign: "middle", halign: "center" },
          },
          {
            content: "Total Vat",
            styles: { valign: "middle", halign: "center" },
          },
          {
            content: "Additional Commission",
            styles: { valign: "middle", halign: "center" },
          },

          {
            content: "Qty (In PCS)",
            styles: { valign: "middle", halign: "center" },
          },
          {
            content: "Bonus Qty (In PCS)",
            styles: { valign: "middle", halign: "center" },
          },
          {
            content: "Net Purchase Value",
            styles: { valign: "middle", halign: "center" },
          },
          {
            content: "User",
            styles: { valign: "middle", halign: "center" },
          },
        ],
      ];

      // Table body data
      const tableRows = [];

      supplier?.purchases?.length &&
        supplier.purchases.map((purchase, index) => {
          let singleRowData = [];

          singleRowData.push(purchase?.purchase_id ? purchase.purchase_id : "");

          singleRowData.push(
            purchase?.purchase_reference ? purchase.purchase_reference : ""
          );

          singleRowData.push(
            purchase?.purchase_date ? convertDate(purchase.purchase_date) : ""
          );

          singleRowData.push({
            content: isValidNumber(purchase?.purchase_value_at_cost)
              ? purchase.purchase_value_at_cost
              : "",
            styles: {
              halign: "right",
            },
          });

          singleRowData.push({
            content: isValidNumber(purchase?.purchase_vat)
              ? purchase.purchase_vat
              : "",
            styles: {
              halign: "right",
            },
          });

          singleRowData.push({
            content: isValidNumber(purchase?.purchase_additional_commission)
              ? purchase.purchase_additional_commission
              : "",
            styles: {
              halign: "right",
            },
          });

          singleRowData.push({
            content: isValidNumber(purchase?.purchase_received_quantity_in_pcs)
              ? purchase.purchase_received_quantity_in_pcs
              : "",
            styles: {
              halign: "right",
            },
          });

          singleRowData.push({
            content: isValidNumber(purchase?.purchase_bonus_quantity_in_pcs)
              ? purchase.purchase_bonus_quantity_in_pcs
              : "",
            styles: {
              halign: "right",
            },
          });

          singleRowData.push({
            content: isValidNumber(purchase?.purchase_net_purchase_value)
              ? purchase.purchase_net_purchase_value
              : "",
            styles: {
              halign: "right",
            },
          });

          singleRowData.push(purchase?.posted_by ? purchase.posted_by : "");
          tableRows.push(singleRowData);
        });

      //   console.log("tableRows = ", tableRows);

      if (doc?.lastAutoTable) {
        let gap_between_table = 10;
        lastYPosition = doc.lastAutoTable.finalY + gap_between_table;
      } else {
        let margin_top_for_first_table = 10;
        lastYPosition = lastYPosition + margin_top_for_first_table;
      }

      let singleRowDataForTotal = [
        {
          content: "Grand Total",
          styles: {
            fontStyle: "bold",
            halign: "center",
          },
        },
        "",
        "",
        {
          content: isValidNumber(supplier?.supplier_value_at_cost)
            ? supplier.supplier_value_at_cost
            : "",
          styles: {
            fontStyle: "bold",
            halign: "right",
          },
        },
        {
          content: isValidNumber(supplier?.supplier_purchase_vat)
            ? supplier.supplier_purchase_vat
            : "",
          styles: {
            fontStyle: "bold",
            halign: "right",
          },
        },
        {
          content: isValidNumber(supplier?.supplier_additional_commission)
            ? supplier.supplier_additional_commission
            : "",
          styles: {
            fontStyle: "bold",
            halign: "right",
          },
        },
        {
          content: isValidNumber(supplier?.supplier_received_quantity_in_pcs)
            ? supplier.supplier_received_quantity_in_pcs
            : "",
          styles: {
            fontStyle: "bold",
            halign: "right",
          },
        },
        {
          content: isValidNumber(supplier?.supplier_bonus_quantity_in_pcs)
            ? supplier.supplier_bonus_quantity_in_pcs
            : "",
          styles: {
            fontStyle: "bold",
            halign: "right",
          },
        },
        {
          content: isValidNumber(supplier?.supplier_net_purchase_value)
            ? supplier.supplier_net_purchase_value
            : "",
          styles: {
            fontStyle: "bold",
            halign: "right",
          },
        },
        "",
      ];

      tableRows.push(singleRowDataForTotal);

      //   console.log("headerRows = ", headerRows);
      //   console.log("tableRows = ", tableRows);

      autoTable(doc, {
        startY: lastYPosition,
        head: headerRows,
        body: tableRows,
        theme: "plain",
        styles: {
          lineColor: "DCE0E4",
          lineWidth: 0.2,
          valign: "middle",
          fontSize: FONT_SIZE_FOR_AUTO_TABLE,
          font: FONT_FAMILY,
        },
        headStyles: {
          valign: "middle",
          fontSize: FONT_SIZE_FOR_AUTO_TABLE,
          font: FONT_FAMILY,
        },

        margin: { left: MAXGIN_Y, right: MAXGIN_Y },
      });
    });

    addFooters(doc, date.toLocaleDateString(), date.toLocaleTimeString());
    doc.save(`${pdfTitle}_${date.toLocaleTimeString()}`);
  };
};

export default SupplierRcvSummaryReportPdf;
