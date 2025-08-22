import React, { useState, useEffect } from "react";
// import Recorder from './Recorder';
import Player from "./Player";
import Transcript from "./Transcript";
import { useWebSocket } from "../hooks/useWebSocket";
import axios from "axios";
import SpeechRecognition, {
   useSpeechRecognition,
} from "react-speech-recognition";
import TextToAudio from "./TextToAudio"; // Import the TextToAudio component
import Chatbot from "./Chatbot"; // Import the Chatbot component
import "../css/VoiceApp.css"; // Import your CSS styles
import DoctorReport from "./DoctorReport"; // Import the DoctorReport component
import SummaryReport from "./SummaryReport"; // Import the SummaryReport component

const WS_URL = "wss://ai-patient-simulator.onrender.com/ws";
const cardsPerSlide = 6;

const VoiceApp = () => {
   const { message, sendMessage } = useWebSocket(WS_URL);

   const [transcripted, setTranscripted] = useState("");
   const [diseases, setDiseases] = useState([]);
   const [diseaseChunks, setDiseaseChunks] = useState([]);
   const [selectedDisease, setSelectedDisease] = useState(1);
   const [selectedDiseaseName, setSelectedDiseaseName] = useState("Depression");
   const [patients, setPatients] = useState([]);
   const [selectedPatient, setSelectedPatient] = useState("");
   const [selectedPatientId, setSelectedPatientId] = useState("");
   const [resultTranscript, setResultTranscript] = useState("");
   const [stuReportDetails, setStuReportDetails] = useState("");
   const [stuSummaryReport, setStuSummaryReport] = useState("");
   const [voiceGender, setVoiceGender] = useState("Female");
   const [generateReportBtn, setGenerateReportBtn] = useState(false);
   const [overallResponse, setOverallResponse] = useState([]);

   const [isGeneratingReport, setIsGeneratingReport] = useState(false);
   const [isReportGenerated, setIsReportGenerated] = useState(false);
   const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
   const [isSummaryGenerated, setIsSummaryGenerated] = useState(false);

   const baseUrl = "https://ai-patient-simulator.onrender.com/";
   // const baseUrl = "http://192.168.1.31:8000/";

   const {
      transcript,
      listening,
      resetTranscript,
      browserSupportsSpeechRecognition,
   } = useSpeechRecognition();

   // React Hook: On WebSocket message update
   useEffect(() => {
      if (message && message.type === "transcription") {
         setTranscripted(message.text);
      }
   }, [message]);

   // React Hook: Fetch disease list on component mount
   useEffect(() => {
      const fetchDiseases = async () => {
         try {
            const response = await axios.get(`${baseUrl}diseases_list`);
            setDiseases(response.data.list);
            const dataList = chunkArray(response.data.list, cardsPerSlide);
            setDiseaseChunks(dataList);
            console.log("Diseases List:", dataList);
         } catch (error) {
            console.error("Error fetching diseases list:", error);
         }
      };
      fetchDiseases();
   }, []);

   // Helper function to chunk array into slides of `cardsPerSlide` size
   const chunkArray = (arr, size) => {
      const chunks = [];
      for (let i = 0; i < arr.length; i += size) {
         chunks.push(arr.slice(i, i + size));
      }
      return chunks;
   };

   // React Hook: Fetch patients on disease change
   useEffect(() => {
      const fetchPatients = async () => {
         if (!selectedDisease) {
            setPatients([]);
            setSelectedPatient("");
            return;
         }

         try {
            const response = await axios.post(`${baseUrl}patients_by_disease`, {
               disease_id: parseInt(selectedDisease),
            });
            setPatients(response.data.patients || []);
         } catch (error) {
            console.error("Error fetching patients:", error);
            setPatients([]);
         }
      };
      fetchPatients();
   }, [selectedDisease]);

   // ✅ React Hook: Send transcripted message when listening stops
   useEffect(() => {
      const handleTranscriptedData = async (data) => {
         // Find the disease object from ID
         setOverallResponse((prevResponses) => [
            ...prevResponses,
            { doctor: data },
         ]);
         const selectedDiseaseObj = diseases.find(
            (d) => d.id === parseInt(selectedDisease)
         );
         console.log("Selected Disease Object:", selectedDiseaseObj);
         const diseaseName = selectedDiseaseObj ? selectedDiseaseObj.name : "";

         const selectedPatientObj = patients.find(
            (p) => p.id === parseInt(selectedPatient)
         );
         const patientName = selectedPatientObj ? selectedPatientObj.name : "";

         const payload = {
            message: data,
            condition: diseaseName,
            patient_name: patientName,
         };

         console.log("Payload:", payload);
         const headers = { "Content-Type": "application/json" };

         try {
            const response = await axios.post(`${baseUrl}chat`, payload, {
               headers,
            });
            // console.log("Status Code:", response.status);
            // console.log("Response:", response.data.response);
            if (response.status !== 200) {
               console.error("Error in response:", response.data);
               return;
            } else {
               setResultTranscript(response.data.response);
               setOverallResponse((prevResponses) => [
                  ...prevResponses,
                  { patient: response.data.response },
                  // { patient: response.data.response, doctor: data }
               ]);
               console.log("Overall Response:", overallResponse);
               if (response.data.response.includes("Thank you.")) {
                  setGenerateReportBtn(true);
               } else {
                  setGenerateReportBtn(false);
               }
            }
         } catch (error) {
            console.error("Error during API call:", error);
         }
      };

      if (!listening) {
         handleTranscriptedData(transcript);
      }
   }, [listening]);

   const startListening = () => {
      console.log("Start recording");
      SpeechRecognition.startListening({
         continuous: false,
         language: "en-IN",
         interimResults: true,
      });
   };

   const stopListening = () => {
      console.log("Stop recording");
      SpeechRecognition.stopListening();
   };

   const handleSendAudio = (base64Audio) => {
      sendMessage({
         type: "audio_blob",
         data: base64Audio,
         voice: voiceGender,
      });
   };

   const getDiseasesList = () => {
      return diseases.map((disease) => (
         <option key={disease.id} value={disease.id}>
            {disease.name}
         </option>
      ));
   };

   const getPatientsList = () => {
      return patients.map((patient) => (
         <option key={patient.id} value={patient.id}>
            {patient.name} (Age: {patient.age})
         </option>
      ));
   };

   if (!browserSupportsSpeechRecognition) {
      return <span>Browser doesn't support speech recognition.</span>;
   }

   const selectedDiseasesFun = (e) => {
      console.log("e value", e.target.value);
   };

   const generateReport = async () => {
      setIsGeneratingReport(true); // Show loader
      setIsReportGenerated(false); // Reset state

      const data = transcript || transcripted;
      console.log("generate report");
      const selectedDiseaseObj = diseases.find(
         (d) => d.id === parseInt(selectedDisease)
      );
      console.log("Selected Disease Object:", selectedDiseaseObj);
      const diseaseName = selectedDiseaseObj ? selectedDiseaseObj.name : "";

      const selectedPatientObj = patients.find(
         (p) => p.id === parseInt(selectedPatient)
      );
      const patientName = selectedPatientObj ? selectedPatientObj.name : "";
      const patientAge = selectedPatientObj ? selectedPatientObj.age : "";
      const patientGender = selectedPatientObj ? selectedPatientObj.gender : "";

      const payload = {
         patient: {
            name: patientName,
            age: patientAge,
            gender: patientGender,
            condition: diseaseName,
         },
         conversation_json: overallResponse,
      };

      console.log("Payload:", payload);
      const headers = { "Content-Type": "application/json" };

      try {
         const response = await axios.post(
            `${baseUrl}generate_student_report`,
            payload,
            { headers }
         );
         if (response.status !== 200) {
            console.error("Error in response:", response.data);
            return;
         } else {
            setStuReportDetails(response.data.response);
            console.log("response.data.response", response.data.response);
         }
      } catch (error) {
         console.error("Error during API call:", error);
      } finally {
         setIsGeneratingReport(false); // Hide loader
      }
   };

   const generateSummary = async () => {
      const data = transcript || transcripted;
      setIsGeneratingSummary(true); // Show loader
      setIsSummaryGenerated(false); // Reset state
      console.log("generate report");
      const selectedDiseaseObj = diseases.find(
         (d) => d.id === parseInt(selectedDisease)
      );
      console.log("Selected Disease Object:", selectedDiseaseObj);
      const diseaseName = selectedDiseaseObj ? selectedDiseaseObj.name : "";

      const selectedPatientObj = patients.find(
         (p) => p.id === parseInt(selectedPatient)
      );
      const patientName = selectedPatientObj ? selectedPatientObj.name : "";
      const patientAge = selectedPatientObj ? selectedPatientObj.age : "";
      const patientGender = selectedPatientObj ? selectedPatientObj.gender : "";

      const payload = {
         patient: {
            name: patientName,
            age: patientAge,
            gender: patientGender,
            condition: diseaseName,
         },
         conversation_json: overallResponse,
      };

      console.log("Payload:", payload);
      const headers = { "Content-Type": "application/json" };

      try {
         const response = await axios.post(
            `${baseUrl}generate_summary`,
            payload,
            { headers }
         );
         if (response.status !== 200) {
            console.error("Error in response:", response.data);
            return;
         } else {
            setStuSummaryReport(response.data.response);
            console.log("response.data.response", response.data.response);
         }
      } catch (error) {
         console.error("Error during API call:", error);
      } finally {
         setIsGeneratingSummary(false); // Hide loader
      }
   };

   const handleDiseaseClick = (disease) => {
      setSelectedDisease(disease.id);
      setSelectedDiseaseName(disease.name);
   };
   const handlePatientCardClick = (patient) => {
      setSelectedPatient(patient.id);
      setSelectedPatientId(patient.id);
      console.log("Selected Patient:", patient);
   };

   return (
      <div
         className="container-fluid"
         style={{ height: "100vh", overflow: "scroll" }}
      >
         {/* Title */}
         <div className="row">
            <div className="col-md-12 text-center">
               <h1 className="mt-3 mb-3">AI Voice Assistant</h1>
            </div>
         </div>

         {/* Side-by-side layout for left (Carousel + Patient + Mic) and right (Chat + Report) */}
         <div className="row">
            {/* LEFT COLUMN */}
            <div className="col-lg-7 col-md-12">
               {/* Disease Carousel */}
               <div className="text-center mb-4 ">
                  <div
                     id="carouselExample"
                     className="carousel slide carousel-fixed-height"
                     data-bs-ride="false"
                  >
                     <div className="carousel-inner h-100">
                        {diseaseChunks.map((chunk, chunkIndex) => (
                           <div
                              className={`carousel-item ${
                                 chunkIndex === 0 ? "active" : ""
                              }`}
                              key={chunkIndex}
                           >
                              <div className="container">
                                 <div className="row mb-4">
                                    {chunk.map((disease, index) => (
                                       <div
                                          className="col-md-4 mb-3"
                                          key={disease.id}
                                       >
                                          <div
                                             className={`card p-3 h-60 ${
                                                selectedDisease === disease.id
                                                   ? "active-card"
                                                   : ""
                                             }`}
                                             style={{ cursor: "pointer" }}
                                             onClick={() =>
                                                handleDiseaseClick(disease)
                                             }
                                          >
                                             <div className="card-body card-body-custom">
                                                <div className="row align-items-center">
                                                   <div className="col-md-9 text-start">
                                                      <p className="card-title card-title-truncate">
                                                         {disease.name}
                                                      </p>
                                                   </div>
                                                   <div className="col-md-3 text-center">
                                                      <img
                                                         src={`/images/PatientImages/${
                                                            ((chunkIndex *
                                                               cardsPerSlide +
                                                               index) %
                                                               8) +
                                                            1
                                                         }.png`}
                                                         alt={disease.name}
                                                         className="rounded-circle"
                                                         style={{
                                                            height: "30px",
                                                            width: "30px",
                                                            objectFit: "cover",
                                                         }}
                                                      />
                                                   </div>
                                                </div>
                                             </div>
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>

                     {/* Carousel Indicators */}
                     <div className="d-flex justify-content-center">
                        <div className="carousel-indicators mt-3">
                           {diseaseChunks.map((_, index) => (
                              <button
                                 key={index}
                                 type="button"
                                 data-bs-target="#carouselExample"
                                 data-bs-slide-to={index}
                                 className={index === 0 ? "active" : ""}
                                 aria-current={index === 0 ? "true" : undefined}
                                 aria-label={`Slide ${index + 1}`}
                                 style={{
                                    width: "10px",
                                    height: "10px",
                                    borderRadius: "50%",
                                    margin: "0 4px",
                                    backgroundColor: "#007bff",
                                    border: "none",
                                 }}
                              ></button>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>

               {/* Patient Accordion */}
               {patients.length > 0 && (
                  <div className="mb-4">
                     {patients.map((patient, index) => (
                        <div
                           className="accordion mb-3"
                           id={`accordionPatient${index}`}
                           key={patient.id}
                        >
                           <div
                              className={`accordion-item ${
                                 selectedPatientId === patient.id
                                    ? "selected-card"
                                    : ""
                              }`}
                           >
                              <h2
                                 className="accordion-header"
                                 id={`heading${index}`}
                              >
                                 <button
                                    className="accordion-button collapsed d-flex justify-content-between"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#collapse${index}`}
                                    aria-expanded="false"
                                    aria-controls={`collapse${index}`}
                                    onClick={() =>
                                       handlePatientCardClick(patient)
                                    }
                                 >
                                    <div className="w-100 d-flex justify-content-between align-items-center">
                                       <span>
                                          <strong>{patient.name}</strong>
                                       </span>
                                       <span className="ms-auto">
                                          <i className="bi bi-chevron-down"></i>
                                       </span>
                                    </div>
                                 </button>
                              </h2>
                              <div
                                 id={`collapse${index}`}
                                 className="accordion-collapse collapse"
                                 aria-labelledby={`heading${index}`}
                                 data-bs-parent={`#accordionPatient${index}`}
                              >
                                 <div className="accordion-body">
                                    <p>
                                       <strong>Age:</strong> {patient.age}
                                    </p>
                                    <p>
                                       <strong>Disease Name:</strong>{" "}
                                       {patient.disease_name}
                                    </p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
               {(transcript || transcripted) && (
                  <div className="row mb-2">
                     <div className="col-6 pe-1">
                        <button
                           className="btn btn-primary w-100"
                           onClick={generateReport}
                           disabled={isGeneratingReport || isReportGenerated}
                        >
                           {isGeneratingReport
                              ? "Generating..."
                              : isReportGenerated
                              ? "Generated"
                              : "Generate Report"}
                        </button>
                     </div>
                     <div className="col-6 ps-1">
                        <button
                           className="btn btn-success w-100"
                           onClick={generateSummary}
                           disabled={isGeneratingSummary || isSummaryGenerated}
                        >
                           {isGeneratingSummary
                              ? "Generating..."
                              : isSummaryGenerated
                              ? "Generated"
                              : "Generate Summary"}
                        </button>
                     </div>
                  </div>
               )}
            </div>

            {/* RIGHT COLUMN */}
            <div className="col-lg-5 col-md-12 right-col">
               <div className="right-content-container">
                  {/* Chatbot */}
                  <div className="mb-4 chatbot">
                     <h2 className="bot_heading"> Medical Assistant</h2>
                     <Chatbot chatHistory={overallResponse} />
                  </div>
               </div>
               {/* Microphone Controls */}
               <div className="mb-4">
                  {!listening && (
                     <button
                        className="btn btn-success mb-2 w-100"
                        onClick={startListening}
                        disabled={listening}
                     >
                        Start
                     </button>
                  )}
                  {listening && (
                     <button
                        className="btn btn-danger mb-2 w-100"
                        onClick={stopListening}
                     >
                        Stop
                     </button>
                  )}
               </div>

               {/* Audio Output */}
               <div className="mb-4">
                  <TextToAudio text={resultTranscript} />
               </div>
            </div>
         </div>
         {/* Report And Summary */}
         <div className="row" style={{ height: "400px", marginTop: "85px" }}>
            {/* Left Column - Doctor Report */}
            <div className="col-md-6 h-20 " style={{ overflowY: "auto" }}>
               <div className="mb-4">
                  <DoctorReport reportText={stuReportDetails} />
               </div>
            </div>

            {/* Right Column - Summary Report */}
            <div className="col-md-6" style={{ overflowY: "auto" }}>
               <div className="mb-4">
                  <SummaryReport reportText={stuSummaryReport} />
               </div>
            </div>
         </div>

         {/* Transcript and Audio Player (Full Width) */}
         <div style={{ padding: 20 }}>
            <Transcript text={resultTranscript} />
            <Player text={resultTranscript} voiceGender={voiceGender} />
         </div>
      </div>
   );
};

export default VoiceApp;
