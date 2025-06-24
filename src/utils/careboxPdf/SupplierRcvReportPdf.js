import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  logo,
  logoType,
  logoXPosition,
  logoYPosition,
  logoHeight,
  logoWidth,
  maxginY,
  careboxAddress,
} from "../configs/portraitPdfConfigs";

let data = {
  data: {
    results: [
      {
        supplier_id: 1,
        supplier_name: "ACI",
        purchases: [
          {
            purchase_id: "POP1203250001",
            purchase_order_placed_id: 110,
            purchase_reference: "",
            purchase_date: "2025-03-12",
            purchase_time: "04:18:05.011221",
            posted_by: "HasanAdmin",
            additional_commission: 0,
            quantity: 5,
            bonus_quantity: 0,
            total_quantity: 5,
            products: [
              {
                product_name: "Final Test-100",
                product_id: 11229,
                generic_name: "Test Generic",
                product_barcode: "23f219b7c68e4",
                product_unit: "100",
                product_category: "Flavouring",
                product_sub_category: "Achar",
                product_location: "food",
                dosage_form_name: null,
                dosage_strength: null,
                variations: null,
                batch_number: "nioho4",
                batch_name: "nioho4",
                sku_number: "SKU1203250003",
                product_cpu: 12,
                received_quantity: 5,
                purchase_vat: 2,
                value_at_cost: 60,
                net_purchase_value: 62,
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
                    batch_number: "21545",
                    batch_name: "21545",
                    sku_number: "SKU1203250002",
                    product_cpu: 10,
                    received_quantity: 10,
                    purchase_vat: 0,
                    value_at_cost: 100,
                    net_purchase_value: 100,
                  },
                  {
                    variation_name: "NAPA-Box",
                    variation_id: "PVI0203250001",
                    is_default_variation: false,
                    qty_in_pcs: 10,
                    batch_number: "21545",
                    batch_name: "21545",
                    sku_number: "SKU1203250001",
                    product_cpu: 200,
                    received_quantity: 50,
                    purchase_vat: 0,
                    value_at_cost: 10000,
                    net_purchase_value: 10000,
                  },
                ],
                value_at_cost: 0,
                net_purchase_value: 0,
              },
            ],
            total_value_at_cost: 10100,
            total_received_quantity: 60,
            total_product_cpu: 210,
            total_net_purchase_value: 10100,
            total_purchase_vat: 0,
          },
        ],
      },
    ],
  },
  status: 200,
  statusText: "",
  headers: {
    "content-length": "1867",
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
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzUwODQyNjYzLCJpYXQiOjE3NTA3NTYyNjMsImp0aSI6IjVlOTRkYmIwYTA1YjQxOWJhNTFhZjE5OTBhMzNhMzI4IiwidXNlcl9pZCI6NDY1Mn0.cfXwl6oh96jOEuPAfAoSYolcnzyzEgE6cd-r_RqBfaY",
    },
    method: "get",
    url: "https://cbapi.meherab.xyz/api/v2/report/purchase-order/supplier-wise-purchase-report/?purchase_id=POP1203250001",
  },
  request: {},
};

const SupplierRcvReportPdf = (data = data, reportTitle, pdfTitle) => {
  const font = "times";
  let lastYPosition = 0;
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Create and embed logo image
  const img = new Image();
  img.src = logo;

  img.onload = () => {
    // Care-Box Logo
    doc.addImage(
      img,
      logoType,
      logoXPosition,
      logoYPosition,
      logoWidth,
      logoHeight
    );

    // Care-Box Title
    doc.setFont(font, "bold");
    doc.setFontSize(20);

    const title = "Care-Box";
    const titleWidth = doc.getTextDimensions(title).w;
    const titleXPosition = (pageWidth - titleWidth) / 2;

    let lineHeight = 18;
    doc.text(title, titleXPosition, maxginY + lineHeight);

    lastYPosition += maxginY + lineHeight;

    // Care-Box Address // Address
    doc.setFontSize(10);
    doc.setFont(font, "normal");
    const careboxAddressWidth = doc.getTextDimensions(careboxAddress).w;

    const addresPosition = (pageWidth - careboxAddressWidth) / 2;

    doc.text(careboxAddress, addresPosition, lastYPosition + 10);

    doc.save(`test`);
  };
};

export default SupplierRcvReportPdf;
