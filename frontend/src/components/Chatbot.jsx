import React from "react";
import "../css/Chatbot.css"; // Import the styles

const Chatbot = ({ chatHistory }) => {
   if (!chatHistory || chatHistory.length === 2) {
      return null; // Hide the chatbot if there's no chat history
   }
   // console.log("chatHistory.length",chatHistory.length)
   return (
      <>
         <div className="chat-container">
            {chatHistory.map((entry, index) => (
               <div key={index} className="chat-message-wrapper p-1">
                  {entry.doctor && (
                     <div className="chat-message right">
                        <div className="bubble patient-bubble">
                           {entry.doctor}
                        </div>
                     </div>
                  )}
                  {entry.patient && (
                     <div className="chat-message left">
                        <div className="bubble doctor-bubble">
                           {entry.patient}
                        </div>
                     </div>
                  )}
               </div>
            ))}
         </div>
      </>
   );
};

export default Chatbot;
