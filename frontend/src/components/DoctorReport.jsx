import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { jsPDF } from "jspdf";
import "../css/Report.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowDown } from "@fortawesome/free-solid-svg-icons";

const DoctorReport = ({ reportText }) => {
   const [isOpen, setIsOpen] = useState(false);

   if (!reportText) return null;

   const handleDownloadPDF = () => {
      const doc = new jsPDF();
      const marginLeft = 10;
      const lineHeight = 10;
      const maxLineWidth = 180;

      const lines = doc.splitTextToSize(reportText, maxLineWidth);
      lines.forEach((line, index) => {
         doc.text(line, marginLeft, 20 + index * lineHeight);
      });

      doc.save("doctor_report.pdf");
   };

   return (
      <div className="doctor-report-container position-relative">
         <div className="d-flex justify-content-between align-items-center">
            <h2 className="text-center flex-grow-1">Doctor's Report</h2>

            <div className="d-flex gap-2">
               <button
                  className="btn btn-outline-primary"
                  onClick={() => setIsOpen(!isOpen)}
                  title={isOpen ? "Hide Report" : "Show Report"}
               >
                  {isOpen ? "Hide" : "Show"}
               </button>

               <button
                  className="btn btn-outline-success"
                  onClick={handleDownloadPDF}
                  title="Download PDF"
               >
                  <FontAwesomeIcon icon={faFileArrowDown} />
               </button>
            </div>
         </div>

         {isOpen && (
            <>
               <p>This report is generated based on the conversation.</p>

               <div className="student-report p-4 border rounded bg-light">
                  <ReactMarkdown>{reportText}</ReactMarkdown>
               </div>
            </>
         )}
      </div>
   );
};

export default DoctorReport;
