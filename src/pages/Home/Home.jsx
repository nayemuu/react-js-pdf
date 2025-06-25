import {
  SupplierRcvReportData,
  SupplierRcvReporTitle,
} from "../../utils/careboxPdf/SupplierRcvReportPdf/SupplierRcvReportData";
import SupplierRcvReportPdf from "../../utils/careboxPdf/SupplierRcvReportPdf/SupplierRcvReportPdf";
import { generatePdfSample } from "../../utils/pdf/generatePdfSample9";

const Home = () => {
  return (
    <div>
      <div className="flex justify-center items-center mt-[100px]">
        <div className="bg-[#f2f3f8] p-8 rounded-md flex flex-col justify-center items-center">
          <button
            type="button"
            className="px-[37px] py-[12px] bg-gradient-to-b from-[#D13F96] to-[#833586] text-white rounded-[5px] text-lg font-bold leading-[21.48px] cursor-pointer"
            onClick={() =>
              SupplierRcvReportPdf(
                SupplierRcvReportData,
                SupplierRcvReporTitle,
                SupplierRcvReporTitle
              )
            }
          >
            Generate PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
