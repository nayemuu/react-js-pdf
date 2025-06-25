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

      let headerRows = [];

      // Table body data
      const tableRows = [];

      supplier?.purchases?.length &&
        supplier.purchases.map((purchase, index) => {
          // console.log("purchase = ", purchase);

          let headerRowsTemp = [
            [
              {
                content: `Supplier Name : ${supplier.supplier_name}`,
                colSpan: 9,
                styles: { valign: "middle", halign: "center" },
              },
            ],

            [
              {
                content: `Purchase ID : ${
                  purchase?.purchase_reference
                    ? purchase.purchase_reference
                    : ""
                }`,
                colSpan: 5,
                styles: { valign: "middle", halign: "center" },
              },

              `Reference: ${
                purchase?.purchase_reference ? purchase.purchase_reference : ""
              }`,

              `Purchase Date: ${
                purchase?.purchase_date ? purchase.purchase_date : ""
              }`,

              `Purchase Time: ${
                purchase?.purchase_time
                  ? purchase?.purchase_time?.slice(0, 8)
                  : ""
              }`,

              `Posted By ${purchase?.posted_by ? purchase.posted_by : ""}`,
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

          headerRows = headerRowsTemp;

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

//new data
let newData = {
  data: {
    results: [
      {
        supplier_id: 1,
        supplier_name: "ACI",
        purchases: [
          {
            purchase_id: "POP2306250001",
            purchase_order_placed_id: 202,
            purchase_reference: "PO2306250001",
            purchase_date: "2025-06-23",
            purchase_time: "2025-06-23T03:35:17.187974Z",
            posted_by: "HasanAdmin",
            products: [
              {
                product_name: "CADBURY DAIRY MILK  SILK BUBBLY CHOCOLATE-50 GM",
                product_id: 11143,
                generic_name: "CHOCOLATE",
                product_barcode: "7622201757991",
                product_unit: "50 GM",
                product_category: null,
                product_sub_category: null,
                product_location: "food",
                dosage_form_name: null,
                dosage_strength: null,
                variations: null,
                batch_number: "CB2306252504",
                batch_name: "CB2306252504",
                sku_number: "SKU2306250004",
                product_cpu: 50,
                received_quantity: 2,
                bonus_quantity: 0,
                total_quantity: 2,
                purchase_vat: 0,
                additional_commission: 0,
                value_at_cost: 100,
                net_purchase_value: 100,
              },
              {
                product_name: "NAPA-250MG",
                product_id: 1222,
                generic_name: "Paracetamol 500 mg",
                product_barcode: null,
                product_unit: "250MG",
                product_category: "OTC Medicine",
                product_sub_category: "Fever",
                product_location: "medicare",
                dosage_form_name: null,
                dosage_strength: null,
                variations: [
                  {
                    variation_name: "NAPA-Pcs",
                    variation_id: "PVI2602250002",
                    is_default_variation: true,
                    qty_in_pcs: 15,
                    batch_number: "CB23062501",
                    batch_name: "CB23062501",
                    sku_number: "SKU2306250001",
                    product_cpu: 15.25,
                    received_quantity: 2,
                    bonus_quantity: 0,
                    total_quantity: 2,
                    purchase_vat: 0,
                    additional_commission: 0,
                    total_quantity_in_pcs: 30,
                    received_quantity_in_pcs: 30,
                    bonus_quantity_in_pcs: 0,
                    value_at_cost: 30.5,
                    net_purchase_value: 30.5,
                  },
                  {
                    variation_name: "Napa Strip",
                    variation_id: "PVI0801250001",
                    is_default_variation: false,
                    qty_in_pcs: 5,
                    batch_number: "CB2306252502",
                    batch_name: "CB2306252502",
                    sku_number: "SKU2306250002",
                    product_cpu: 15.25,
                    received_quantity: 3,
                    bonus_quantity: 0,
                    total_quantity: 3,
                    purchase_vat: 0,
                    additional_commission: 0,
                    total_quantity_in_pcs: 15,
                    received_quantity_in_pcs: 15,
                    bonus_quantity_in_pcs: 0,
                    value_at_cost: 45.75,
                    net_purchase_value: 45.75,
                  },
                  {
                    variation_name: "NAPA-Box",
                    variation_id: "PVI0203250001",
                    is_default_variation: false,
                    qty_in_pcs: 10,
                    batch_number: "CB2306252503",
                    batch_name: "CB2306252503",
                    sku_number: "SKU2306250003",
                    product_cpu: 15.25,
                    received_quantity: 4,
                    bonus_quantity: 0,
                    total_quantity: 4,
                    purchase_vat: 0,
                    additional_commission: 0,
                    total_quantity_in_pcs: 40,
                    received_quantity_in_pcs: 40,
                    bonus_quantity_in_pcs: 0,
                    value_at_cost: 61,
                    net_purchase_value: 61,
                  },
                ],
                value_at_cost: 0,
                net_purchase_value: 0,
              },
            ],
            purchase_product_cpu: 95.75,
            purchase_received_quantity_in_pcs: 87,
            purchase_bonus_quantity_in_pcs: 0,
            purchase_total_quantity_in_pcs: 87,
            purchase_vat: 0,
            purchase_value_at_cost: 237.25,
            purchase_net_purchase_value: 237.25,
          },
          {
            purchase_id: "POP2206250001",
            purchase_order_placed_id: 201,
            purchase_reference: "PO2206250002",
            purchase_date: "2025-06-22",
            purchase_time: "2025-06-22T05:46:48.065984Z",
            posted_by: "HasanAdmin",
            products: [
              {
                product_name: "CADBURY DAIRY MILK  SILK BUBBLY CHOCOLATE-50 GM",
                product_id: 11143,
                generic_name: "CHOCOLATE",
                product_barcode: "7622201757991",
                product_unit: "50 GM",
                product_category: null,
                product_sub_category: null,
                product_location: "food",
                dosage_form_name: null,
                dosage_strength: null,
                variations: null,
                batch_number: "CB22062501",
                batch_name: "CB22062501",
                sku_number: "SKU2206250001",
                product_cpu: 50,
                received_quantity: 1,
                bonus_quantity: 0,
                total_quantity: 1,
                purchase_vat: 0,
                additional_commission: 0,
                value_at_cost: 50,
                net_purchase_value: 50,
              },
              {
                product_name: "NAPA-250MG",
                product_id: 1222,
                generic_name: "Paracetamol 500 mg",
                product_barcode: null,
                product_unit: "250MG",
                product_category: "OTC Medicine",
                product_sub_category: "Fever",
                product_location: "medicare",
                dosage_form_name: null,
                dosage_strength: null,
                variations: [
                  {
                    variation_name: "NAPA-Pcs",
                    variation_id: "PVI2602250002",
                    is_default_variation: true,
                    qty_in_pcs: 15,
                    batch_number: "CB2206252502",
                    batch_name: "CB2206252502",
                    sku_number: "SKU2206250002",
                    product_cpu: 15.25,
                    received_quantity: 2,
                    bonus_quantity: 0,
                    total_quantity: 2,
                    purchase_vat: 0,
                    additional_commission: 0,
                    total_quantity_in_pcs: 30,
                    received_quantity_in_pcs: 30,
                    bonus_quantity_in_pcs: 0,
                    value_at_cost: 30.5,
                    net_purchase_value: 30.5,
                  },
                  {
                    variation_name: "Napa Strip",
                    variation_id: "PVI0801250001",
                    is_default_variation: false,
                    qty_in_pcs: 5,
                    batch_number: "CB2206252503",
                    batch_name: "CB2206252503",
                    sku_number: "SKU2206250003",
                    product_cpu: 15.25,
                    received_quantity: 3,
                    bonus_quantity: 0,
                    total_quantity: 3,
                    purchase_vat: 0,
                    additional_commission: 0,
                    total_quantity_in_pcs: 15,
                    received_quantity_in_pcs: 15,
                    bonus_quantity_in_pcs: 0,
                    value_at_cost: 45.75,
                    net_purchase_value: 45.75,
                  },
                ],
                value_at_cost: 0,
                net_purchase_value: 0,
              },
            ],
            purchase_product_cpu: 80.5,
            purchase_received_quantity_in_pcs: 46,
            purchase_bonus_quantity_in_pcs: 0,
            purchase_total_quantity_in_pcs: 46,
            purchase_vat: 0,
            purchase_value_at_cost: 126.25,
            purchase_net_purchase_value: 126.25,
          },
          {
            purchase_id: "POP1906250010",
            purchase_order_placed_id: 200,
            purchase_reference: "PO1906250014",
            purchase_date: "2025-06-19",
            purchase_time: "2025-06-19T09:41:29.693178Z",
            posted_by: "HasanAdmin",
            products: [
              {
                product_name:
                  "Bhojon Roshik Package-Please Follow Description For Package Details.",
                product_id: 11226,
                generic_name: "Test Generic",
                product_barcode: "117ebe6d4fdd4",
                product_unit: "Please Follow Description For Package Details.",
                product_category: "Bazar Sodai",
                product_sub_category: "Rice",
                product_location: "food",
                dosage_form_name: null,
                dosage_strength: null,
                variations: [
                  {
                    variation_name: "Bhojon Roshik Package-Box-Red",
                    variation_id: "PVI0603250004",
                    is_default_variation: true,
                    qty_in_pcs: 0,
                    batch_number: "test2",
                    batch_name: "test2",
                    sku_number: "SKU1906250027",
                    product_cpu: 250,
                    received_quantity: 2,
                    bonus_quantity: 0,
                    total_quantity: 2,
                    purchase_vat: 0,
                    additional_commission: 0,
                    total_quantity_in_pcs: 2,
                    received_quantity_in_pcs: 2,
                    bonus_quantity_in_pcs: 0,
                    value_at_cost: 500,
                    net_purchase_value: 500,
                  },
                  {
                    variation_name: "Bhojon Roshik Package-Box-White",
                    variation_id: "PVI0603250003",
                    is_default_variation: false,
                    qty_in_pcs: 0,
                    batch_number: "test2",
                    batch_name: "test2",
                    sku_number: "SKU1906250028",
                    product_cpu: 250,
                    received_quantity: 1,
                    bonus_quantity: 0,
                    total_quantity: 1,
                    purchase_vat: 0,
                    additional_commission: 0,
                    total_quantity_in_pcs: 1,
                    received_quantity_in_pcs: 1,
                    bonus_quantity_in_pcs: 0,
                    value_at_cost: 250,
                    net_purchase_value: 250,
                  },
                ],
                value_at_cost: 0,
                net_purchase_value: 0,
              },
              {
                product_name: "Alatrol-10 mg",
                product_id: 11304,
                generic_name: "Cetirizine Hydrochloride [Oral] 10 mg",
                product_barcode: "145e4680601e4",
                product_unit: "10 mg",
                product_category: "Prescribe Medicine",
                product_sub_category: "Tablet",
                product_location: "medicare",
                dosage_form_name: "Tablet",
                dosage_strength: "10 mg",
                variations: [
                  {
                    variation_name: "1 Pc",
                    variation_id: "PVI1205250149",
                    is_default_variation: true,
                    qty_in_pcs: 0,
                    batch_number: "test2",
                    batch_name: "test2",
                    sku_number: "SKU1906250025",
                    product_cpu: 10,
                    received_quantity: 1,
                    bonus_quantity: 0,
                    total_quantity: 1,
                    purchase_vat: 0,
                    additional_commission: 0,
                    total_quantity_in_pcs: 1,
                    received_quantity_in_pcs: 1,
                    bonus_quantity_in_pcs: 0,
                    value_at_cost: 10,
                    net_purchase_value: 10,
                  },
                  {
                    variation_name: "1 Strip = 10 Pcs",
                    variation_id: "PVI1205250150",
                    is_default_variation: false,
                    qty_in_pcs: 0,
                    batch_number: "test2",
                    batch_name: "test2",
                    sku_number: "SKU1906250026",
                    product_cpu: 14,
                    received_quantity: 5,
                    bonus_quantity: 0,
                    total_quantity: 5,
                    purchase_vat: 0,
                    additional_commission: 0,
                    total_quantity_in_pcs: 5,
                    received_quantity_in_pcs: 5,
                    bonus_quantity_in_pcs: 0,
                    value_at_cost: 70,
                    net_purchase_value: 70,
                  },
                ],
                value_at_cost: 0,
                net_purchase_value: 0,
              },
              {
                product_name: "NAPA-250MG",
                product_id: 1222,
                generic_name: "Paracetamol 500 mg",
                product_barcode: null,
                product_unit: "250MG",
                product_category: "OTC Medicine",
                product_sub_category: "Fever",
                product_location: "medicare",
                dosage_form_name: null,
                dosage_strength: null,
                variations: [
                  {
                    variation_name: "NAPA-Pcs",
                    variation_id: "PVI2602250002",
                    is_default_variation: true,
                    qty_in_pcs: 15,
                    batch_number: "test",
                    batch_name: "test",
                    sku_number: "SKU1906250021",
                    product_cpu: 15.25,
                    received_quantity: 30,
                    bonus_quantity: 0,
                    total_quantity: 30,
                    purchase_vat: 0,
                    additional_commission: 0,
                    total_quantity_in_pcs: 450,
                    received_quantity_in_pcs: 450,
                    bonus_quantity_in_pcs: 0,
                    value_at_cost: 457.5,
                    net_purchase_value: 457.5,
                  },
                  {
                    variation_name: "Napa-M",
                    variation_id: "PVI2101250001",
                    is_default_variation: false,
                    qty_in_pcs: 0,
                    batch_number: "test2",
                    batch_name: "test2",
                    sku_number: "SKU1906250024",
                    product_cpu: 15.25,
                    received_quantity: 10,
                    bonus_quantity: 0,
                    total_quantity: 10,
                    purchase_vat: 0,
                    additional_commission: 0,
                    total_quantity_in_pcs: 10,
                    received_quantity_in_pcs: 10,
                    bonus_quantity_in_pcs: 0,
                    value_at_cost: 152.5,
                    net_purchase_value: 152.5,
                  },
                  {
                    variation_name: "Napa Strip",
                    variation_id: "PVI0801250001",
                    is_default_variation: false,
                    qty_in_pcs: 5,
                    batch_number: "test2",
                    batch_name: "test2",
                    sku_number: "SKU1906250022",
                    product_cpu: 15.25,
                    received_quantity: 40,
                    bonus_quantity: 0,
                    total_quantity: 40,
                    purchase_vat: 0,
                    additional_commission: 0,
                    total_quantity_in_pcs: 200,
                    received_quantity_in_pcs: 200,
                    bonus_quantity_in_pcs: 0,
                    value_at_cost: 610,
                    net_purchase_value: 610,
                  },
                  {
                    variation_name: "NAPA-Box",
                    variation_id: "PVI0203250001",
                    is_default_variation: false,
                    qty_in_pcs: 10,
                    batch_number: "test2",
                    batch_name: "test2",
                    sku_number: "SKU1906250023",
                    product_cpu: 15.25,
                    received_quantity: 50,
                    bonus_quantity: 0,
                    total_quantity: 50,
                    purchase_vat: 0,
                    additional_commission: 0,
                    total_quantity_in_pcs: 500,
                    received_quantity_in_pcs: 500,
                    bonus_quantity_in_pcs: 0,
                    value_at_cost: 762.5,
                    net_purchase_value: 762.5,
                  },
                ],
                value_at_cost: 0,
                net_purchase_value: 0,
              },
            ],
            purchase_product_cpu: 585,
            purchase_received_quantity_in_pcs: 1169,
            purchase_bonus_quantity_in_pcs: 0,
            purchase_total_quantity_in_pcs: 1169,
            purchase_vat: 0,
            purchase_value_at_cost: 2812.5,
            purchase_net_purchase_value: 2812.5,
          },
          {
            purchase_id: "POP1906250009",
            purchase_order_placed_id: 199,
            purchase_reference: "Purchased for Warehouse",
            purchase_date: "2025-06-19",
            purchase_time: "2025-06-19T08:35:19.777240Z",
            posted_by: "SazzadAdmin",
            products: [
              {
                product_name: "BROFEX-100 ML",
                product_id: 11233,
                generic_name: null,
                product_barcode: "99e7fec5e9a44",
                product_unit: "100 ML",
                product_category: "OTC Medicine",
                product_sub_category: "Fever",
                product_location: "medicare",
                dosage_form_name: null,
                dosage_strength: null,
                variations: [
                  {
                    variation_name: "BROFEX-Tube",
                    variation_id: "PVI2605250001",
                    is_default_variation: false,
                    qty_in_pcs: 0,
                    batch_number: "B1FTP",
                    batch_name: "B1FTP",
                    sku_number: "SKU2605250016",
                    product_cpu: 3.4,
                    received_quantity: 20,
                    bonus_quantity: 5,
                    total_quantity: 25,
                    purchase_vat: 0,
                    additional_commission: 0,
                    total_quantity_in_pcs: 25,
                    received_quantity_in_pcs: 20,
                    bonus_quantity_in_pcs: 5,
                    value_at_cost: 84.9,
                    net_purchase_value: 84.9,
                  },
                ],
                value_at_cost: 0,
                net_purchase_value: 0,
              },
            ],
            purchase_product_cpu: 3.4,
            purchase_received_quantity_in_pcs: 20,
            purchase_bonus_quantity_in_pcs: 5,
            purchase_total_quantity_in_pcs: 25,
            purchase_vat: 0,
            purchase_value_at_cost: 84.9,
            purchase_net_purchase_value: 84.9,
          },
          {
            purchase_id: "POP1906250002",
            purchase_order_placed_id: 192,
            purchase_reference: "Purchased for Warehouse",
            purchase_date: "2025-06-19",
            purchase_time: "2025-06-19T07:14:50.847429Z",
            posted_by: "SazzadAdmin",
            products: [
              {
                product_name: "BROFEX-100 ML",
                product_id: 11233,
                generic_name: null,
                product_barcode: "99e7fec5e9a44",
                product_unit: "100 ML",
                product_category: "OTC Medicine",
                product_sub_category: "Fever",
                product_location: "medicare",
                dosage_form_name: null,
                dosage_strength: null,
                variations: [
                  {
                    variation_name: "BROFEX-Tube",
                    variation_id: "PVI2605250001",
                    is_default_variation: false,
                    qty_in_pcs: 0,
                    batch_number: "B1FTP",
                    batch_name: "B1FTP",
                    sku_number: "SKU2605250016",
                    product_cpu: 5.66,
                    received_quantity: 5,
                    bonus_quantity: 0,
                    total_quantity: 5,
                    purchase_vat: 0,
                    additional_commission: 0,
                    total_quantity_in_pcs: 5,
                    received_quantity_in_pcs: 5,
                    bonus_quantity_in_pcs: 0,
                    value_at_cost: 28.3,
                    net_purchase_value: 28.3,
                  },
                ],
                value_at_cost: 0,
                net_purchase_value: 0,
              },
            ],
            purchase_product_cpu: 5.66,
            purchase_received_quantity_in_pcs: 5,
            purchase_bonus_quantity_in_pcs: 0,
            purchase_total_quantity_in_pcs: 5,
            purchase_vat: 0,
            purchase_value_at_cost: 28.3,
            purchase_net_purchase_value: 28.3,
          },
          {
            purchase_id: "POP1906250003",
            purchase_order_placed_id: 193,
            purchase_reference: "Purchased for Warehouse",
            purchase_date: "2025-06-19",
            purchase_time: "2025-06-19T07:26:31.648977Z",
            posted_by: "SazzadAdmin",
            products: [
              {
                product_name: "BROFEX-100 ML",
                product_id: 11233,
                generic_name: null,
                product_barcode: "99e7fec5e9a44",
                product_unit: "100 ML",
                product_category: "OTC Medicine",
                product_sub_category: "Fever",
                product_location: "medicare",
                dosage_form_name: null,
                dosage_strength: null,
                variations: [
                  {
                    variation_name: "BROFEX-Tube",
                    variation_id: "PVI2605250001",
                    is_default_variation: false,
                    qty_in_pcs: 0,
                    batch_number: "B1FTP",
                    batch_name: "B1FTP",
                    sku_number: "SKU2605250016",
                    product_cpu: 0,
                    received_quantity: 5,
                    bonus_quantity: 5,
                    total_quantity: 10,
                    purchase_vat: 0,
                    additional_commission: 0,
                    total_quantity_in_pcs: 10,
                    received_quantity_in_pcs: 5,
                    bonus_quantity_in_pcs: 5,
                    value_at_cost: 0,
                    net_purchase_value: 0,
                  },
                ],
                value_at_cost: 0,
                net_purchase_value: 0,
              },
            ],
            purchase_product_cpu: 0,
            purchase_received_quantity_in_pcs: 5,
            purchase_bonus_quantity_in_pcs: 5,
            purchase_total_quantity_in_pcs: 10,
            purchase_vat: 0,
            purchase_value_at_cost: 0,
            purchase_net_purchase_value: 0,
          },
          {
            purchase_id: "POP1906250004",
            purchase_order_placed_id: 194,
            purchase_reference: "Purchased for Warehouse",
            purchase_date: "2025-06-19",
            purchase_time: "2025-06-19T07:27:03.669453Z",
            posted_by: "SazzadAdmin",
            products: [
              {
                product_name: "BROFEX-100 ML",
                product_id: 11233,
                generic_name: null,
                product_barcode: "99e7fec5e9a44",
                product_unit: "100 ML",
                product_category: "OTC Medicine",
                product_sub_category: "Fever",
                product_location: "medicare",
                dosage_form_name: null,
                dosage_strength: null,
                variations: [
                  {
                    variation_name: "BROFEX-Tube",
                    variation_id: "PVI2605250001",
                    is_default_variation: false,
                    qty_in_pcs: 0,
                    batch_number: "B1FTP",
                    batch_name: "B1FTP",
                    sku_number: "SKU2605250016",
                    product_cpu: 0,
                    received_quantity: 5,
                    bonus_quantity: 5,
                    total_quantity: 10,
                    purchase_vat: 0,
                    additional_commission: 0,
                    total_quantity_in_pcs: 10,
                    received_quantity_in_pcs: 5,
                    bonus_quantity_in_pcs: 5,
                    value_at_cost: 0,
                    net_purchase_value: 0,
                  },
                ],
                value_at_cost: 0,
                net_purchase_value: 0,
              },
            ],
            purchase_product_cpu: 0,
            purchase_received_quantity_in_pcs: 5,
            purchase_bonus_quantity_in_pcs: 5,
            purchase_total_quantity_in_pcs: 10,
            purchase_vat: 0,
            purchase_value_at_cost: 0,
            purchase_net_purchase_value: 0,
          },
          {
            purchase_id: "POP1906250005",
            purchase_order_placed_id: 195,
            purchase_reference: "Purchased for Warehouse",
            purchase_date: "2025-06-19",
            purchase_time: "2025-06-19T07:29:38.594650Z",
            posted_by: "SazzadAdmin",
            products: [
              {
                product_name: "BROFEX-100 ML",
                product_id: 11233,
                generic_name: null,
                product_barcode: "99e7fec5e9a44",
                product_unit: "100 ML",
                product_category: "OTC Medicine",
                product_sub_category: "Fever",
                product_location: "medicare",
                dosage_form_name: null,
                dosage_strength: null,
                variations: [
                  {
                    variation_name: "BROFEX-Tube",
                    variation_id: "PVI2605250001",
                    is_default_variation: false,
                    qty_in_pcs: 0,
                    batch_number: "B1FTP",
                    batch_name: "B1FTP",
                    sku_number: "SKU2605250016",
                    product_cpu: 0,
                    received_quantity: 5,
                    bonus_quantity: 5,
                    total_quantity: 10,
                    purchase_vat: 0,
                    additional_commission: 0,
                    total_quantity_in_pcs: 10,
                    received_quantity_in_pcs: 5,
                    bonus_quantity_in_pcs: 5,
                    value_at_cost: 0,
                    net_purchase_value: 0,
                  },
                ],
                value_at_cost: 0,
                net_purchase_value: 0,
              },
            ],
            purchase_product_cpu: 0,
            purchase_received_quantity_in_pcs: 5,
            purchase_bonus_quantity_in_pcs: 5,
            purchase_total_quantity_in_pcs: 10,
            purchase_vat: 0,
            purchase_value_at_cost: 0,
            purchase_net_purchase_value: 0,
          },
          {
            purchase_id: "POP1906250006",
            purchase_order_placed_id: 196,
            purchase_reference: "Purchased for Warehouse",
            purchase_date: "2025-06-19",
            purchase_time: "2025-06-19T07:30:09.839414Z",
            posted_by: "SazzadAdmin",
            products: [
              {
                product_name: "BROFEX-100 ML",
                product_id: 11233,
                generic_name: null,
                product_barcode: "99e7fec5e9a44",
                product_unit: "100 ML",
                product_category: "OTC Medicine",
                product_sub_category: "Fever",
                product_location: "medicare",
                dosage_form_name: null,
                dosage_strength: null,
                variations: [
                  {
                    variation_name: "BROFEX-Tube",
                    variation_id: "PVI2605250001",
                    is_default_variation: false,
                    qty_in_pcs: 0,
                    batch_number: "B1FTP",
                    batch_name: "B1FTP",
                    sku_number: "SKU2605250016",
                    product_cpu: 5.38,
                    received_quantity: 200,
                    bonus_quantity: 5,
                    total_quantity: 205,
                    purchase_vat: 0,
                    additional_commission: 0,
                    total_quantity_in_pcs: 205,
                    received_quantity_in_pcs: 200,
                    bonus_quantity_in_pcs: 5,
                    value_at_cost: 1103.7,
                    net_purchase_value: 1103.7,
                  },
                ],
                value_at_cost: 0,
                net_purchase_value: 0,
              },
            ],
            purchase_product_cpu: 5.38,
            purchase_received_quantity_in_pcs: 200,
            purchase_bonus_quantity_in_pcs: 5,
            purchase_total_quantity_in_pcs: 205,
            purchase_vat: 0,
            purchase_value_at_cost: 1103.7,
            purchase_net_purchase_value: 1103.7,
          },
          {
            purchase_id: "POP1906250007",
            purchase_order_placed_id: 197,
            purchase_reference: "Purchased for Warehouse",
            purchase_date: "2025-06-19",
            purchase_time: "2025-06-19T07:31:53.251567Z",
            posted_by: "SazzadAdmin",
            products: [
              {
                product_name: "BROFEX-100 ML",
                product_id: 11233,
                generic_name: null,
                product_barcode: "99e7fec5e9a44",
                product_unit: "100 ML",
                product_category: "OTC Medicine",
                product_sub_category: "Fever",
                product_location: "medicare",
                dosage_form_name: null,
                dosage_strength: null,
                variations: [
                  {
                    variation_name: "BROFEX-Tube",
                    variation_id: "PVI2605250001",
                    is_default_variation: false,
                    qty_in_pcs: 0,
                    batch_number: "B1FTP",
                    batch_name: "B1FTP",
                    sku_number: "SKU2605250016",
                    product_cpu: 5.38,
                    received_quantity: 200,
                    bonus_quantity: 5,
                    total_quantity: 205,
                    purchase_vat: 0,
                    additional_commission: 0,
                    total_quantity_in_pcs: 205,
                    received_quantity_in_pcs: 200,
                    bonus_quantity_in_pcs: 5,
                    value_at_cost: 1103.7,
                    net_purchase_value: 1103.7,
                  },
                ],
                value_at_cost: 0,
                net_purchase_value: 0,
              },
            ],
            purchase_product_cpu: 5.38,
            purchase_received_quantity_in_pcs: 200,
            purchase_bonus_quantity_in_pcs: 5,
            purchase_total_quantity_in_pcs: 205,
            purchase_vat: 0,
            purchase_value_at_cost: 1103.7,
            purchase_net_purchase_value: 1103.7,
          },
          {
            purchase_id: "POP1906250008",
            purchase_order_placed_id: 198,
            purchase_reference: "Purchased for Warehouse",
            purchase_date: "2025-06-19",
            purchase_time: "2025-06-19T07:47:07.039187Z",
            posted_by: "SazzadAdmin",
            products: [
              {
                product_name: "BROFEX-100 ML",
                product_id: 11233,
                generic_name: null,
                product_barcode: "99e7fec5e9a44",
                product_unit: "100 ML",
                product_category: "OTC Medicine",
                product_sub_category: "Fever",
                product_location: "medicare",
                dosage_form_name: null,
                dosage_strength: null,
                variations: [
                  {
                    variation_name: "BROFEX-Tube",
                    variation_id: "PVI2605250001",
                    is_default_variation: false,
                    qty_in_pcs: 0,
                    batch_number: "B1FTP",
                    batch_name: "B1FTP",
                    sku_number: "SKU2605250016",
                    product_cpu: 3.4,
                    received_quantity: 20,
                    bonus_quantity: 5,
                    total_quantity: 25,
                    purchase_vat: 0,
                    additional_commission: 0,
                    total_quantity_in_pcs: 25,
                    received_quantity_in_pcs: 20,
                    bonus_quantity_in_pcs: 5,
                    value_at_cost: 84.9,
                    net_purchase_value: 84.9,
                  },
                ],
                value_at_cost: 0,
                net_purchase_value: 0,
              },
            ],
            purchase_product_cpu: 3.4,
            purchase_received_quantity_in_pcs: 20,
            purchase_bonus_quantity_in_pcs: 5,
            purchase_total_quantity_in_pcs: 25,
            purchase_vat: 0,
            purchase_value_at_cost: 84.9,
            purchase_net_purchase_value: 84.9,
          },
        ],
        supplier_product_cpu: 784.47,
        supplier_received_quantity_in_pcs: 1762,
        supplier_bonus_quantity_in_pcs: 35,
        supplier_total_quantity_in_pcs: 1797,
        supplier_value_at_cost: 5581.5,
        supplier_purchase_vat: 0,
        supplier_net_purchase_value: 5581.5,
      },
      {
        supplier_id: 4,
        supplier_name: "A B GROUP",
        purchases: [
          {
            purchase_id: "POP1906250001",
            purchase_order_placed_id: 191,
            purchase_reference: "QA Testing Purpose",
            purchase_date: "2025-06-19",
            purchase_time: "2025-06-19T06:52:25.449896Z",
            posted_by: "Shanto Kumar Saha",
            products: [
              {
                product_name: "Bashundhara Facial Tissue-30 Pcs",
                product_id: 11492,
                generic_name: null,
                product_barcode: "c97e9fadbad24",
                product_unit: "30 Pcs",
                product_category: "Toiletries",
                product_sub_category: "Tissue",
                product_location: "bodycare",
                dosage_form_name: null,
                dosage_strength: null,
                variations: [
                  {
                    variation_name: "Bashundhara Facial Tissue-Blue",
                    variation_id: "PVI0206250011",
                    is_default_variation: false,
                    qty_in_pcs: 5,
                    batch_number: "CB19062501",
                    batch_name: "CB19062501",
                    sku_number: "SKU1906250001",
                    product_cpu: 0,
                    received_quantity: 100,
                    bonus_quantity: 100,
                    total_quantity: 200,
                    purchase_vat: 0,
                    additional_commission: 0,
                    total_quantity_in_pcs: 1000,
                    received_quantity_in_pcs: 500,
                    bonus_quantity_in_pcs: 500,
                    value_at_cost: 0,
                    net_purchase_value: 0,
                  },
                  {
                    variation_name: "test",
                    variation_id: "PVI0206250013",
                    is_default_variation: true,
                    qty_in_pcs: 20,
                    batch_number: "CB1906252502",
                    batch_name: "CB1906252502",
                    sku_number: "SKU1906250002",
                    product_cpu: 40,
                    received_quantity: 1000,
                    bonus_quantity: 0,
                    total_quantity: 1000,
                    purchase_vat: 0,
                    additional_commission: 0,
                    total_quantity_in_pcs: 20000,
                    received_quantity_in_pcs: 20000,
                    bonus_quantity_in_pcs: 0,
                    value_at_cost: 40000,
                    net_purchase_value: 40000,
                  },
                  {
                    variation_name: "M",
                    variation_id: "PVI2705250009",
                    is_default_variation: false,
                    qty_in_pcs: 0,
                    batch_number: "CB1906252504",
                    batch_name: "CB1906252504",
                    sku_number: "SKU1906250004",
                    product_cpu: 19.6,
                    received_quantity: 1000,
                    bonus_quantity: 10,
                    total_quantity: 1010,
                    purchase_vat: 0,
                    additional_commission: 0,
                    total_quantity_in_pcs: 1010,
                    received_quantity_in_pcs: 1000,
                    bonus_quantity_in_pcs: 10,
                    value_at_cost: 19800,
                    net_purchase_value: 19800,
                  },
                  {
                    variation_name: "Bashundhara Facial Tissue-Bottle",
                    variation_id: "PVI2705250008",
                    is_default_variation: false,
                    qty_in_pcs: 0,
                    batch_number: "CB1906252508",
                    batch_name: "CB1906252508",
                    sku_number: "SKU1906250008",
                    product_cpu: 30,
                    received_quantity: 1000,
                    bonus_quantity: 0,
                    total_quantity: 1000,
                    purchase_vat: 0,
                    additional_commission: 0,
                    total_quantity_in_pcs: 1000,
                    received_quantity_in_pcs: 1000,
                    bonus_quantity_in_pcs: 0,
                    value_at_cost: 30000,
                    net_purchase_value: 30000,
                  },
                  {
                    variation_name: "Bashundhara Facial Tissue-Strip",
                    variation_id: "PVI2705250004",
                    is_default_variation: false,
                    qty_in_pcs: 0,
                    batch_number: "CB1906252503",
                    batch_name: "CB1906252503",
                    sku_number: "SKU1906250003",
                    product_cpu: 120,
                    received_quantity: 1000,
                    bonus_quantity: 0,
                    total_quantity: 1000,
                    purchase_vat: 0,
                    additional_commission: 0,
                    total_quantity_in_pcs: 1000,
                    received_quantity_in_pcs: 1000,
                    bonus_quantity_in_pcs: 0,
                    value_at_cost: 120000,
                    net_purchase_value: 120000,
                  },
                  {
                    variation_name: "Final",
                    variation_id: "PVI0206250014",
                    is_default_variation: false,
                    qty_in_pcs: 10,
                    batch_number: "CB1906252507",
                    batch_name: "CB1906252507",
                    sku_number: "SKU1906250007",
                    product_cpu: 50,
                    received_quantity: 1000,
                    bonus_quantity: 0,
                    total_quantity: 1000,
                    purchase_vat: 0,
                    additional_commission: 0,
                    total_quantity_in_pcs: 10000,
                    received_quantity_in_pcs: 10000,
                    bonus_quantity_in_pcs: 0,
                    value_at_cost: 50000,
                    net_purchase_value: 50000,
                  },
                  {
                    variation_name: "L Size",
                    variation_id: "PVI2705250003",
                    is_default_variation: false,
                    qty_in_pcs: 20,
                    batch_number: "CB1906252506",
                    batch_name: "CB1906252506",
                    sku_number: "SKU1906250006",
                    product_cpu: 40,
                    received_quantity: 1000,
                    bonus_quantity: 0,
                    total_quantity: 1000,
                    purchase_vat: 0,
                    additional_commission: 0,
                    total_quantity_in_pcs: 20000,
                    received_quantity_in_pcs: 20000,
                    bonus_quantity_in_pcs: 0,
                    value_at_cost: 40000,
                    net_purchase_value: 40000,
                  },
                  {
                    variation_name: "Blue Test",
                    variation_id: "PVI0206250012",
                    is_default_variation: false,
                    qty_in_pcs: 100,
                    batch_number: "CB1906252505",
                    batch_name: "CB1906252505",
                    sku_number: "SKU1906250005",
                    product_cpu: 220,
                    received_quantity: 100,
                    bonus_quantity: 0,
                    total_quantity: 100,
                    purchase_vat: 0,
                    additional_commission: 0,
                    total_quantity_in_pcs: 10000,
                    received_quantity_in_pcs: 10000,
                    bonus_quantity_in_pcs: 0,
                    value_at_cost: 22000,
                    net_purchase_value: 22000,
                  },
                ],
                value_at_cost: 0,
                net_purchase_value: 0,
              },
              {
                product_name: "COCOLA EGG & CHICKEN NOODLES-150 GM",
                product_id: 11313,
                generic_name: null,
                product_barcode: "8941155013632",
                product_unit: "150 GM",
                product_category: "Bazar Sodai",
                product_sub_category: "Noodles",
                product_location: "food",
                dosage_form_name: null,
                dosage_strength: null,
                variations: [
                  {
                    variation_name: "1 Pcs",
                    variation_id: "PVI1805250002",
                    is_default_variation: true,
                    qty_in_pcs: 0,
                    batch_number: "CB1906252511",
                    batch_name: "CB1906252511",
                    sku_number: "SKU1906250011",
                    product_cpu: 30,
                    received_quantity: 1000,
                    bonus_quantity: 0,
                    total_quantity: 1000,
                    purchase_vat: 0,
                    additional_commission: 0,
                    total_quantity_in_pcs: 1000,
                    received_quantity_in_pcs: 1000,
                    bonus_quantity_in_pcs: 0,
                    value_at_cost: 30000,
                    net_purchase_value: 30000,
                  },
                ],
                value_at_cost: 0,
                net_purchase_value: 0,
              },
              {
                product_name: "COCOLA EGG NOODLES-120 GM",
                product_id: 11312,
                generic_name: null,
                product_barcode: "8941155013502",
                product_unit: "120 GM",
                product_category: "Bazar Sodai",
                product_sub_category: "Noodles",
                product_location: "medicare",
                dosage_form_name: null,
                dosage_strength: null,
                variations: [
                  {
                    variation_name: "1 Pcs",
                    variation_id: "PVI1805250001",
                    is_default_variation: true,
                    qty_in_pcs: 0,
                    batch_number: "CB1906252512",
                    batch_name: "CB1906252512",
                    sku_number: "SKU1906250012",
                    product_cpu: 77,
                    received_quantity: 1000,
                    bonus_quantity: 0,
                    total_quantity: 1000,
                    purchase_vat: 0,
                    additional_commission: 0,
                    total_quantity_in_pcs: 1000,
                    received_quantity_in_pcs: 1000,
                    bonus_quantity_in_pcs: 0,
                    value_at_cost: 77000,
                    net_purchase_value: 77000,
                  },
                ],
                value_at_cost: 0,
                net_purchase_value: 0,
              },
              {
                product_name: "COCOLA FROOTI LOOPS-70 GM",
                product_id: 11320,
                generic_name: null,
                product_barcode: "8941155003664",
                product_unit: "70 GM",
                product_category: "Food",
                product_sub_category: "Chocolate",
                product_location: "food",
                dosage_form_name: null,
                dosage_strength: null,
                variations: [
                  {
                    variation_name: "1 Pcs",
                    variation_id: "PVI1805250009",
                    is_default_variation: true,
                    qty_in_pcs: 0,
                    batch_number: "CB1906252513",
                    batch_name: "CB1906252513",
                    sku_number: "SKU1906250013",
                    product_cpu: 30,
                    received_quantity: 1000,
                    bonus_quantity: 0,
                    total_quantity: 1000,
                    purchase_vat: 0,
                    additional_commission: 0,
                    total_quantity_in_pcs: 1000,
                    received_quantity_in_pcs: 1000,
                    bonus_quantity_in_pcs: 0,
                    value_at_cost: 30000,
                    net_purchase_value: 30000,
                  },
                ],
                value_at_cost: 0,
                net_purchase_value: 0,
              },
              {
                product_name: "COCOLA JUNIOR CUP CHICKEN CURRY NOODLES-40 GM",
                product_id: 11316,
                generic_name: null,
                product_barcode: "8941155001097",
                product_unit: "40 GM",
                product_category: "Bazar Sodai",
                product_sub_category: "Noodles",
                product_location: "food",
                dosage_form_name: null,
                dosage_strength: null,
                variations: [
                  {
                    variation_name: "1 Pcs",
                    variation_id: "PVI1805250005",
                    is_default_variation: true,
                    qty_in_pcs: 0,
                    batch_number: "CB1906252514",
                    batch_name: "CB1906252514",
                    sku_number: "SKU1906250014",
                    product_cpu: 68,
                    received_quantity: 1000,
                    bonus_quantity: 0,
                    total_quantity: 1000,
                    purchase_vat: 0,
                    additional_commission: 0,
                    total_quantity_in_pcs: 1000,
                    received_quantity_in_pcs: 1000,
                    bonus_quantity_in_pcs: 0,
                    value_at_cost: 68000,
                    net_purchase_value: 68000,
                  },
                ],
                value_at_cost: 0,
                net_purchase_value: 0,
              },
              {
                product_name: "COCOLA MR. CHICKEN NOODLES-180 GM",
                product_id: 11318,
                generic_name: null,
                product_barcode: "8941155013687",
                product_unit: "180 GM",
                product_category: "Bazar Sodai",
                product_sub_category: "Noodles",
                product_location: "food",
                dosage_form_name: null,
                dosage_strength: null,
                variations: [
                  {
                    variation_name: "1 Pcs",
                    variation_id: "PVI1805250007",
                    is_default_variation: true,
                    qty_in_pcs: 0,
                    batch_number: "CB1906252515",
                    batch_name: "CB1906252515",
                    sku_number: "SKU1906250015",
                    product_cpu: 68,
                    received_quantity: 1000,
                    bonus_quantity: 0,
                    total_quantity: 1000,
                    purchase_vat: 0,
                    additional_commission: 0,
                    total_quantity_in_pcs: 1000,
                    received_quantity_in_pcs: 1000,
                    bonus_quantity_in_pcs: 0,
                    value_at_cost: 68000,
                    net_purchase_value: 68000,
                  },
                ],
                value_at_cost: 0,
                net_purchase_value: 0,
              },
              {
                product_name: "COCOLA NOODLES-300 GM",
                product_id: 11314,
                generic_name: null,
                product_barcode: "8941155003442",
                product_unit: "300 GM",
                product_category: "Bazar Sodai",
                product_sub_category: "Noodles",
                product_location: "food",
                dosage_form_name: null,
                dosage_strength: null,
                variations: [
                  {
                    variation_name: "1 Pcs",
                    variation_id: "PVI1805250003",
                    is_default_variation: true,
                    qty_in_pcs: 0,
                    batch_number: "CB1906252516",
                    batch_name: "CB1906252516",
                    sku_number: "SKU1906250016",
                    product_cpu: 68,
                    received_quantity: 1000,
                    bonus_quantity: 0,
                    total_quantity: 1000,
                    purchase_vat: 0,
                    additional_commission: 0,
                    total_quantity_in_pcs: 1000,
                    received_quantity_in_pcs: 1000,
                    bonus_quantity_in_pcs: 0,
                    value_at_cost: 68000,
                    net_purchase_value: 68000,
                  },
                ],
                value_at_cost: 0,
                net_purchase_value: 0,
              },
              {
                product_name: "COCOLA SUPER EGG AND CHICKEN NOODLES-500 GM",
                product_id: 11317,
                generic_name: null,
                product_barcode: "8941155013731",
                product_unit: "500 GM",
                product_category: "Bazar Sodai",
                product_sub_category: "Noodles",
                product_location: "food",
                dosage_form_name: null,
                dosage_strength: null,
                variations: [
                  {
                    variation_name: "1 Pcs",
                    variation_id: "PVI1805250006",
                    is_default_variation: true,
                    qty_in_pcs: 0,
                    batch_number: "CB1906252517",
                    batch_name: "CB1906252517",
                    sku_number: "SKU1906250017",
                    product_cpu: 44,
                    received_quantity: 1000,
                    bonus_quantity: 0,
                    total_quantity: 1000,
                    purchase_vat: 0,
                    additional_commission: 0,
                    total_quantity_in_pcs: 1000,
                    received_quantity_in_pcs: 1000,
                    bonus_quantity_in_pcs: 0,
                    value_at_cost: 44000,
                    net_purchase_value: 44000,
                  },
                ],
                value_at_cost: 0,
                net_purchase_value: 0,
              },
              {
                product_name: "COCOLA WAFER ROLL-280 GM",
                product_id: 11321,
                generic_name: null,
                product_barcode: "8941155008188",
                product_unit: "280 GM",
                product_category: "Food",
                product_sub_category: "Wafer",
                product_location: "food",
                dosage_form_name: null,
                dosage_strength: null,
                variations: [
                  {
                    variation_name: "1 Pcs",
                    variation_id: "PVI1805250010",
                    is_default_variation: true,
                    qty_in_pcs: 0,
                    batch_number: "CB1906252518",
                    batch_name: "CB1906252518",
                    sku_number: "SKU1906250018",
                    product_cpu: 44,
                    received_quantity: 1000,
                    bonus_quantity: 0,
                    total_quantity: 1000,
                    purchase_vat: 0,
                    additional_commission: 0,
                    total_quantity_in_pcs: 1000,
                    received_quantity_in_pcs: 1000,
                    bonus_quantity_in_pcs: 0,
                    value_at_cost: 44000,
                    net_purchase_value: 44000,
                  },
                ],
                value_at_cost: 0,
                net_purchase_value: 0,
              },
              {
                product_name: "Demo-None",
                product_id: 11503,
                generic_name: null,
                product_barcode: "9b26b270d2424",
                product_unit: null,
                product_category: "OTC Medicine",
                product_sub_category: "Acidity",
                product_location: "bodycare",
                dosage_form_name: null,
                dosage_strength: null,
                variations: [
                  {
                    variation_name: "Blue",
                    variation_id: "PVI0406250018",
                    is_default_variation: true,
                    qty_in_pcs: 0,
                    batch_number: "CB1906252519",
                    batch_name: "CB1906252519",
                    sku_number: "SKU1906250019",
                    product_cpu: 700,
                    received_quantity: 1000,
                    bonus_quantity: 0,
                    total_quantity: 1000,
                    purchase_vat: 0,
                    additional_commission: 0,
                    total_quantity_in_pcs: 1000,
                    received_quantity_in_pcs: 1000,
                    bonus_quantity_in_pcs: 0,
                    value_at_cost: 700000,
                    net_purchase_value: 700000,
                  },
                  {
                    variation_name: "Test Vr",
                    variation_id: "PVI0406250019",
                    is_default_variation: false,
                    qty_in_pcs: 10,
                    batch_number: "CB1906252520",
                    batch_name: "CB1906252520",
                    sku_number: "SKU1906250020",
                    product_cpu: 80,
                    received_quantity: 1000,
                    bonus_quantity: 0,
                    total_quantity: 1000,
                    purchase_vat: 0,
                    additional_commission: 0,
                    total_quantity_in_pcs: 10000,
                    received_quantity_in_pcs: 10000,
                    bonus_quantity_in_pcs: 0,
                    value_at_cost: 80000,
                    net_purchase_value: 80000,
                  },
                ],
                value_at_cost: 0,
                net_purchase_value: 0,
              },
              {
                product_name: "COCOLA BIG BAZAR NOODLES-600 GM-14 PCS",
                product_id: 11319,
                generic_name: null,
                product_barcode: "8941155013571",
                product_unit: "600 GM-14 PCS",
                product_category: "Bazar Sodai",
                product_sub_category: "Noodles",
                product_location: "food",
                dosage_form_name: null,
                dosage_strength: null,
                variations: [
                  {
                    variation_name: "1 Pcs",
                    variation_id: "PVI1805250008",
                    is_default_variation: true,
                    qty_in_pcs: 0,
                    batch_number: "CB1906252509",
                    batch_name: "CB1906252509",
                    sku_number: "SKU1906250009",
                    product_cpu: 77,
                    received_quantity: 1000,
                    bonus_quantity: 0,
                    total_quantity: 1000,
                    purchase_vat: 0,
                    additional_commission: 0,
                    total_quantity_in_pcs: 1000,
                    received_quantity_in_pcs: 1000,
                    bonus_quantity_in_pcs: 0,
                    value_at_cost: 77000,
                    net_purchase_value: 77000,
                  },
                ],
                value_at_cost: 0,
                net_purchase_value: 0,
              },
              {
                product_name: "COCOLA BOWL BEEF BHUNA NOODLES-70 GM",
                product_id: 11315,
                generic_name: null,
                product_barcode: "8941155032701",
                product_unit: "70 GM",
                product_category: "Bazar Sodai",
                product_sub_category: "Noodles",
                product_location: "food",
                dosage_form_name: null,
                dosage_strength: null,
                variations: [
                  {
                    variation_name: "1 Pcs",
                    variation_id: "PVI1805250004",
                    is_default_variation: true,
                    qty_in_pcs: 0,
                    batch_number: "CB1906252510",
                    batch_name: "CB1906252510",
                    sku_number: "SKU1906250010",
                    product_cpu: 30,
                    received_quantity: 1000,
                    bonus_quantity: 0,
                    total_quantity: 1000,
                    purchase_vat: 0,
                    additional_commission: 0,
                    total_quantity_in_pcs: 1000,
                    received_quantity_in_pcs: 1000,
                    bonus_quantity_in_pcs: 0,
                    value_at_cost: 30000,
                    net_purchase_value: 30000,
                  },
                ],
                value_at_cost: 0,
                net_purchase_value: 0,
              },
            ],
            purchase_product_cpu: 1835.6,
            purchase_received_quantity_in_pcs: 84500,
            purchase_bonus_quantity_in_pcs: 510,
            purchase_total_quantity_in_pcs: 85010,
            purchase_vat: 0,
            purchase_value_at_cost: 1637800,
            purchase_net_purchase_value: 1637800,
          },
        ],
        supplier_product_cpu: 1835.6,
        supplier_received_quantity_in_pcs: 84500,
        supplier_bonus_quantity_in_pcs: 510,
        supplier_total_quantity_in_pcs: 85010,
        supplier_value_at_cost: 1637800,
        supplier_purchase_vat: 0,
        supplier_net_purchase_value: 1637800,
      },
    ],
  },
  status: 200,
  statusText: "",
  headers: {
    "content-length": "34329",
    "content-type": "application/json",
  },
  config: {
    transitional: {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false,
    },
    adapter: ["xhr", "http"],
    transformRequest: [null],
    transformResponse: [null],
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    env: {},
    headers: {
      Accept: "application/json, text/plain, */*",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzUwOTEwMTg4LCJpYXQiOjE3NTA4MjM3ODgsImp0aSI6IjY4OThhMDYyNzExMjQxYjc5MWMxNTk3NGU4Yjc0MWY3IiwidXNlcl9pZCI6NDY1Mn0.JAAXSB9xY8rqN2A5emlgtZev_Y95-mKVPsGOhPRaXys",
    },
    method: "get",
    url: "https://cbapi.meherab.xyz/api/v2/report/purchase-order/supplier-wise-purchase-report/?from_date=2025-06-18&to_date=2025-06-25",
  },
  request: {},
};
