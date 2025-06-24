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
  MARGIN_BOTTOM_AFTER_COMPANY_NAME,
  CARE_BOX_ADDRESS,
  FONT_SIZE_FOR_CARE_BOX_ADDRESS,
  FONT_WEIGHT_FOR_CARE_BOX_ADDRESS,
  MARGIN_BOTTOM_FOR_CARE_BOX_ADDRESS,
  FONT_SIZE_FOR_PDF_TITLE,
  FONT_WEIGHT_FOR_PDF_TITLE,
  MARGIN_BOTTOM_FOR_PDF_TITLE,
  MAXGIN_Y,
} from "../configs/portraitPdfConfigs";

const SupplierRcvReportPdf = (data, reportTitle, pdfTitle) => {
  console.log("data = ", data);

  if (data?.data?.results?.length) {
    // console.log("data.data.results = ", data.data.results);
  } else {
    return alert("No Data Found");
  }

  const FONT_FAMILY = "times";

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
    doc.text(COMPANY_NAME, textXPosition, MAXGIN_Y + textDimensions.h);

    lastYPosition +=
      MAXGIN_Y + textDimensions.h + MARGIN_BOTTOM_AFTER_COMPANY_NAME;

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

    data.data.results.map((supplier) => {
      console.log("supplier = ", supplier);

      let headerRows = [
        [
          {
            content: `Supplier Name : ${supplier.supplier_name}`,
            colSpan: 9,
            styles: { valign: "middle", halign: "center" },
          },
        ],

        [
          "Dosage Form /Sub Cat.",
          "Barcode",
          "Product Information",
          "Variation Name",
          "CPU",
          "Batch",
          "Received Qty (Variation wise)",
          "Received Qty (In PCS)",
          "Total Value at Cost + Purchase Vat",
        ],
      ];

      // Table body data
      const tableRows = [];

      supplier?.purchases?.length &&
        supplier.purchases.map((purchase, index) => {
          // console.log("purchase = ", purchase);

          if (purchase?.products?.length) {
            purchase.products.map((product, i) => {
              if (product?.variations?.length) {
                product.variations.map((variation, variationIndex) => {
                  if (variationIndex === 0) {
                    let singleRowData = [];

                    let subCategory =
                      product?.product_location &&
                      product.product_location === "medicare"
                        ? product?.dosage_strength
                          ? product.dosage_strength
                          : "N/A"
                        : product?.product_sub_category
                        ? product.product_sub_category
                        : "N/A";

                    let column1 = {
                      content: subCategory,
                      styles: {
                        valign: "middle",
                      },
                      rowSpan: product.variations.length,
                    };

                    singleRowData.push(column1);

                    let product_barcode = product?.product_barcode
                      ? product.product_barcode
                      : "N/A";

                    let column2 = {
                      content: product_barcode,
                      styles: {
                        valign: "middle",
                      },
                      rowSpan: product.variations.length,
                    };

                    singleRowData.push(column2);

                    let product_info = [
                      product?.product_name || "N/A",
                      product?.product_unit || "N/A",
                      product?.generic_name || "N/A",
                    ].join(" ");

                    let column3 = {
                      content: product_info,
                      styles: {
                        valign: "middle",
                      },
                      rowSpan: product.variations.length,
                    };
                    singleRowData.push(column3);

                    //common fields

                    let variation_name = variation?.variation_name
                      ? variation.variation_name
                      : "N/A";

                    singleRowData.push(variation_name);

                    let variation_cpu = variation?.product_cpu
                      ? variation.product_cpu
                      : "N/A";

                    singleRowData.push(variation_cpu);

                    let batch_name = variation?.batch_name
                      ? variation.batch_name
                      : "N/A";

                    singleRowData.push(batch_name);

                    let received_quantity = variation?.received_quantity
                      ? variation.received_quantity
                      : "N/A";

                    singleRowData.push(received_quantity);

                    let qty_in_pcs = variation?.qty_in_pcs
                      ? variation.qty_in_pcs
                      : "N/A";

                    singleRowData.push(qty_in_pcs);

                    let net_purchase_value = variation?.net_purchase_value
                      ? variation.net_purchase_value
                      : "N/A";

                    singleRowData.push(net_purchase_value);

                    tableRows.push(singleRowData);
                  } else {
                    let singleRowData = [];

                    //common fields
                    let variation_name = variation?.variation_name
                      ? variation.variation_name
                      : "N/A";

                    singleRowData.push(variation_name);

                    let variation_cpu = variation?.product_cpu
                      ? variation.product_cpu
                      : "N/A";

                    singleRowData.push(variation_cpu);

                    let batch_name = variation?.batch_name
                      ? variation.batch_name
                      : "N/A";

                    singleRowData.push(batch_name);

                    let received_quantity = variation?.received_quantity
                      ? variation.received_quantity
                      : "N/A";

                    singleRowData.push(received_quantity);

                    let qty_in_pcs = variation?.qty_in_pcs
                      ? variation.qty_in_pcs
                      : "N/A";

                    singleRowData.push(qty_in_pcs);

                    let net_purchase_value = variation?.net_purchase_value
                      ? variation.net_purchase_value
                      : "N/A";

                    singleRowData.push(net_purchase_value);

                    tableRows.push(singleRowData);
                  }
                });
              } else {
                let singleRowData = [];

                let subCategory =
                  product?.product_location &&
                  product.product_location === "medicare"
                    ? product?.dosage_strength
                      ? product.dosage_strength
                      : "N/A"
                    : product?.product_sub_category
                    ? product.product_sub_category
                    : "N/A";

                singleRowData.push(subCategory);

                let product_barcode = product?.product_barcode
                  ? product.product_barcode
                  : "N/A";
                singleRowData.push(product_barcode);

                let product_info = [
                  product?.product_name || "N/A",
                  product?.product_unit || "N/A",
                  product?.generic_name || "N/A",
                ].join(" ");

                singleRowData.push(product_info);

                singleRowData.push("N/A");

                let product_cpu = product?.product_cpu
                  ? product.product_cpu
                  : "N/A";
                singleRowData.push(product_cpu);

                let batch_name = product?.batch_name
                  ? product.batch_name
                  : "N/A";
                singleRowData.push(batch_name);

                let received_quantity = product?.received_quantity
                  ? product.received_quantity
                  : "N/A";

                singleRowData.push(received_quantity);

                let qty_in_pcs = product?.received_quantity
                  ? product.received_quantity
                  : "N/A";

                singleRowData.push(qty_in_pcs);

                let net_purchase_value = product?.net_purchase_value
                  ? product.net_purchase_value
                  : "N/A";

                singleRowData.push(net_purchase_value);

                tableRows.push(singleRowData);
              }
            });
          } else {
            tableRows.push([
              {
                content: "No Products Found",
                styles: {
                  halign: "center",
                },
                colSpan: headerRows[1].length,
              },
            ]);
          }
        });

      // console.log("doc?.lastAutoTable = ", doc?.lastAutoTable);

      if (doc?.lastAutoTable) {
        let gap_between_table = 10;
        lastYPosition = doc.lastAutoTable.finalY + gap_between_table;
      } else {
        let margin_top_for_first_table = 10;
        lastYPosition = lastYPosition + margin_top_for_first_table;
      }

      autoTable(doc, {
        startY: lastYPosition,
        head: headerRows,
        body: tableRows,
        theme: "plain",
        styles: {
          lineColor: "DCE0E4",
          lineWidth: 0.2,
          valign: "middle",
          fontSize: 8,
          font: FONT_FAMILY,
        },
        headStyles: {
          valign: "middle",
          fontSize: 8,
          font: FONT_FAMILY,
        },

        margin: { left: MAXGIN_Y, right: MAXGIN_Y },
      });
    });

    doc.save(`test`);
  };
};

export default SupplierRcvReportPdf;
