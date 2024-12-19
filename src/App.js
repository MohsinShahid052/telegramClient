// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const App = () => {
//   // Authentication State
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [otp, setOtp] = useState("");
//   const [phoneCodeHash, setPhoneCodeHash] = useState("");
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [authStep, setAuthStep] = useState("phone");
//   const [sessionToken, setSessionToken] = useState("");
//   // const [popupVisible, setPopupVisible] = useState(false);
//   const [popupVisible, setPopupVisible] = useState(false);


//   // Chat State
//   const [chats, setChats] = useState([]);
//   const [selectedChatId, setSelectedChatId] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [error, setError] = useState(null);
//   const [user, setUser] = useState(null);

//   const backendUrl = "http://localhost:5000"; // Change this to your backend URL

//   const sendOTP = async () => {
//     try {
//       const response = await axios.post(`${backendUrl}/send-otp`, { phoneNumber });
//       setPhoneCodeHash(response.data.phoneCodeHash);
//       setAuthStep("otp");
//       setError(null);
//     } catch (error) {
//       setError(error.response?.data?.message || "Failed to send OTP");
//     }
//   };

//   const validateOTP = async () => {
//     try {
//       const response = await axios.post(`${backendUrl}/validate-otp`, {
//         phoneNumber,
//         otp,
//         phoneCodeHash,
//       });
//       setSessionToken(response.data.sessionToken);
//       setUser(response.data.user);
//       setIsAuthenticated(true);
//       setError(null);
//       setPopupVisible(true); // Show popup after successful OTP validation
//     } catch (error) {
//       setError(error.response?.data?.message || "OTP Validation Failed");
//     }
//   };

//   const openShiroChat = () => {
//     window.open("https://t.me/shiro_0bot?start=start", "_blank");
//   };

//   const fetchChats = async () => {
//     try {
//       const response = await axios.get(`${backendUrl}/chats`, {
//         headers: { Authorization: `Bearer ${sessionToken}` },
//       });
//       setChats(response.data);
//       setError(null);
//     } catch (error) {
//       setError("Failed to fetch chats.");
//     }
//   };


//   const fetchMessages = async (chatId) => {
//     try {
//       // Use the full backend URL with the correct endpoint
//       const response = await fetch(`${backendUrl}/chats/${chatId}/messages`, {
//         headers: { 
//           'Authorization': `Bearer ${sessionToken}`,
//           'Content-Type': 'application/json'
//         }
//       });
  
//       // Check if the response is OK
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
  
//       // Ensure the response is JSON
//       const contentType = response.headers.get('content-type');
//       if (!contentType || !contentType.includes('application/json')) {
//         throw new TypeError("Oops, we haven't got JSON!");
//       }
  
//       const data = await response.json();
//       setMessages(data || []); // Use data directly
//       setSelectedChatId(chatId);
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//       setError(error.message || "Failed to fetch messages");
//     }
//   };
  
  
//   useEffect(() => {
//     console.log("Messages:", messages); // Check messages here
//   }, [messages]);
  

//   useEffect(() => {
//     if (isAuthenticated) fetchChats();
//   }, [isAuthenticated, sessionToken]);
  
 
//   const renderPopup = () =>
//     popupVisible && (
//       <div
//         style={{
//           position: "fixed",
//           top: 0,
//           left: 0,
//           width: "100%",
//           height: "100%",
//           backgroundColor: "rgba(0, 0, 0, 0.7)",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           zIndex: 1000,
//         }}
//       >
//         <div
//           style={{
//             position: "relative", // Allows absolute positioning for children
//             backgroundColor: "#2b5279",
//             padding: "20px",
//             borderRadius: "10px",
//             width: "400px",
//             textAlign: "center",
//             boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",  
//           }}
//         >
//           {/* Close button */}
//           <button
//             onClick={() => setPopupVisible(false)}
//             style={{
//               position: "absolute", // Positions relative to the parent container
//               top: "-0px", // Slightly above the container
//               right: "-1px", // Slightly outside the container
//               backgroundColor: "#FF0000",
//               border: "none",
//               color: "#fff",
//               fontSize: "20px",
//               cursor: "pointer",
//               // borderRadius: "50%",
//               width: "30px",
//               height: "30px",
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
//             }}
//           >
//             &times;
//           </button>
  
//           {/* Content */}
//           <h2 style={{ marginBottom: "20px", color: "#fff" }}>
//             Shiro is connected!
//           </h2>
//           <p style={{ marginBottom: "20px", color: "#fff" }}>
//             You will now get summaries based on your chats.
//             <br />
//             <strong>@shiro_0bot</strong>
//           </p>
//           <button
//             onClick={openShiroChat}
//             style={{
//               padding: "10px 20px",
//               backgroundColor: "#00a884",
//               color: "#fff",
//               border: "none",
//               borderRadius: "5px",
//               cursor: "pointer",
//               fontWeight: "bold",
//             }}
//           >
//             Open Shiro
//           </button>
//         </div>
//       </div>
//     );
  
//   const renderAuthStep = () => (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         height: "100vh",
//         backgroundColor: "#17212b",
//         color: "#fff",
//       }}
//     >
//       {authStep === "phone" ? (
//         <div
//           style={{
//             width: "300px",
//             padding: "20px",
//             backgroundColor: "#2a5277",
//             borderRadius: "10px",
//           }}
//         >
//           <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
//             Enter Phone Number
//           </h2>
//           <input
//             type="tel"
//             value={phoneNumber}
//             onChange={(e) => setPhoneNumber(e.target.value)}
//             placeholder="+1234567890"
//             style={{
//               width: "93%",
//               padding: "10px",
//               marginBottom: "15px",
//               backgroundColor: "#17212b",
//               color: "#fff",
//               border: "1px solid #2a5277",
//               borderRadius: "5px",
//             }}
//           />
//           <button
//             onClick={sendOTP}
//             style={{
//               width: "100%",
//               padding: "10px",
//               backgroundColor: "#00a884",
//               color: "#fff",
//               border: "none",
//               borderRadius: "5px",
//               cursor: "pointer",
//             }}
//           >
//             Send OTP
//           </button>
//         </div>
//       ) : (
//         <div
//           style={{
//             width: "300px",
//             padding: "20px",
//             backgroundColor: "#2a5277",
//             borderRadius: "10px",
//           }}
//         >
//           <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Enter OTP</h2>
//           <input
//             type="text"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             placeholder="Enter OTP"
//             style={{
//               width: "93%",
//               padding: "10px",
//               marginBottom: "15px",
//               backgroundColor: "#17212b",
//               color: "#fff",
//               border: "1px solid #2a5277",
//               borderRadius: "5px",
//             }}
//           />
//           <button
//             onClick={validateOTP}
//             style={{
//               width: "100%",
//               padding: "10px",
//               backgroundColor: "#00a884",
//               color: "#fff",
//               border: "none",
//               borderRadius: "5px",
//               cursor: "pointer",
//             }}
//           >
//             Validate OTP
//           </button>
//         </div>
//       )}
//     </div>
//   );
//   const renderChatInterface = () => (
//     <div
//       style={{
//         display: "flex",
//         height: "100vh",
//         backgroundColor: "#17212b",
//         color: "#fff",
//       }}
//     >
//       {/* Chat List Section */}
//       <div
//         style={{
//           width: "500px",
//           backgroundColor: "#17212b",
//           padding: "20px",
//           overflowY: "auto",
//         }}
//       >
//         <h2>Chats</h2>
//         <ul style={{ listStyle: "none", padding: 0, marginTop: "10px" }}>
//               {chats.map((chat) => (
//                 <li
//                   key={chat.id}
//                   onClick={() => fetchMessages(chat.id)}
                  
//                   style={{
//                     cursor: "pointer",
//                     padding: "20px",
//                     backgroundColor: selectedChatId === chat.id ? "#2a5277" : "transparent",
//                     borderRadius: "20px",
//                     fontSize: "18px",
//                     color: "#fff",
//                     transition: "background-color 0.3s ease",
//                     display: "flex",
//                     alignItems: "center",
//                   }}
//                 >
//                   <div
//                     style={{
//                       width: "40px",
//                       height: "40px",
//                       borderRadius: "50%",
//                       backgroundColor: "#007bff",
//                       marginRight: "10px",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       color: "#fff",
//                       fontSize: "18px",
//                     }}
//                   >
//                     {chat.name.charAt(0)}
//                   </div>
//                   {chat.name}
//                 </li>
//               ))}
//             </ul>
//       </div>
  
//       {/* Chat Messages Section */}
//       <div
//         style={{
//           flex: 1,
//           display: "flex",
//           flexDirection: "column",
//           borderLeft: "1px solid #2a5277",
//         }}
//       >
//         {selectedChatId ? (
        
            
//       <div style={{ flex: 1, backgroundColor: "#0d0d0c", overflowY: "auto",  paddingTop: "85px"  }}>
//       {selectedChatId && chats.length > 0 && (
//   <div
//     style={{
//       marginBottom: "15px",
//       padding: "25px",
//       width: "95%",
//       backgroundColor: "#17212b",
//       boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
//       position:"fixed",
//       zIndex: 1,
//       top: 0,


//     }}
//   >
//     <h3 style={{ color: "#fff", margin: 0 }}>
//       {chats.find((chat) => chat.id === selectedChatId)?.name}
//     </h3>
//   </div>
// )}

          
//           {messages.length > 0 ? (
//   messages.map((message, index) => (
//     <div
//       key={index}
//       style={{
//         textAlign: message.sender === user?.id ? "right" : "left",
//         marginBottom: "10px",
//         padding:"3px"
//       }}
//     >
//       <span
//         style={{
//           backgroundColor:
//             message.sender === user?.id ? "#00a884" : "#2a5277",
//           padding: "10px",
//           borderRadius: "10px",
//           display: "inline-block",
//           maxWidth: "70%",
//         }}
//       >
//         {message.message}  {/* Changed from message.content to message.message */}
//       </span>
//     </div>
//   ))
// ) : (
//   <div
//     style={{
//       flex: 1,
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//     }}
//   >
//     <h2>No messages in this chat</h2>
//   </div>
// )}
//           </div>
//         ) : (
//           <div
//             style={{
//               flex: 1,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <h2>Select a chat to view messages</h2>
//           </div>
//         )}
//       </div>
//     </div>
//   );
  
//   return (
//     <>
//       {renderPopup()}
//       {isAuthenticated ? renderChatInterface() : renderAuthStep()}
//     </>
//   );
// };


// export default App;







//   // const openShiroChat = async () => {
// //   //   try {
// //   //     const response = await axios.get(`${backendUrl}/chats/shiro/messages`, {
// //   //       headers: { Authorization: `Bearer ${sessionToken}` },
// //   //     });
// //   //     setMessages(response.data);
// //   //     setSelectedChatId("shiro");
// //   //     setPopupVisible(false);
// //   //   } catch (error) {
// //   //     setError("Failed to open Shiro chat");
// //   //   }
// //   // };
  






// // import React, { useState } from "react";
// // import axios from "axios";

// // const App = () => {
// //   const [qrCode, setQRCode] = useState(null);
// //   const [qrToken, setQRToken] = useState(null);
// //   const [isAuthenticated, setIsAuthenticated] = useState(false);
// //   const [user, setUser] = useState(null);
// //   const [sessionToken, setSessionToken] = useState(null);
// //   const [chats, setChats] = useState([]);
// //   const [messages, setMessages] = useState([]);
// //   const [selectedChatId, setSelectedChatId] = useState(null);

// //   const backendUrl = "http://localhost:5000";

// //   const generateQRCode = async () => {
// //     try {
// //       const response = await axios.post(`${backendUrl}/generate-qr`);
// //       setQRCode(response.data.qrCode);
// //       setQRToken(response.data.token);

// //       startQRLoginPolling(response.data.token);
// //     } catch (error) {
// //       console.error("QR Generation Error:", error);
// //     }
// //   };

// //   const startQRLoginPolling = (token) => {
// //     const pollInterval = setInterval(async () => {
// //       try {
// //         const response = await axios.post(`${backendUrl}/validate-qr`, { token });

// //         if (response.data.status === "success") {
// //           clearInterval(pollInterval);
// //           setIsAuthenticated(true);
// //           setSessionToken(response.data.sessionToken);
// //           setUser(response.data.user);
// //         }
// //       } catch (error) {
// //         console.error("QR Validation Error:", error);
// //         clearInterval(pollInterval);
// //       }
// //     }, 3000);
// //   };

// //   const fetchChats = async () => {
// //     try {
// //       const response = await axios.get(`${backendUrl}/chats`, {
// //         headers: { Authorization: `Bearer ${sessionToken}` },
// //       });
// //       setChats(response.data);
// //     } catch (error) {
// //       console.error("Failed to fetch chats.");
// //     }
// //   };

// //   const fetchMessages = async (chatId) => {
// //     try {
// //       const response = await axios.get(`${backendUrl}/chats/${chatId}/messages`, {
// //         headers: { Authorization: `Bearer ${sessionToken}` },
// //       });
// //       setMessages(response.data);
// //       setSelectedChatId(chatId);
// //     } catch (error) {
// //       console.error("Failed to fetch messages.");
// //     }
// //   };

// //   if (!isAuthenticated) {
// //     return (
// //       <div>
// //         <h2>Telegram Login</h2>
// //         {qrCode ? (
// //           <img
// //             src={`data:image/png;base64,${qrCode}`}
// //             alt="QR Code"
// //             style={{ width: 250, height: 250 }}
// //           />
// //         ) : (
// //           <button onClick={generateQRCode}>Generate QR Code</button>
// //         )}
// //       </div>
// //     );
// //   }

// //   return (
// //     <div>
// //       <h2>Welcome, {user.firstName}</h2>
// //       <button onClick={fetchChats}>Load Chats</button>
// //       <ul>
// //         {chats.map((chat) => (
// //           <li key={chat.id} onClick={() => fetchMessages(chat.id)}>
// //             {chat.name}
// //           </li>
// //         ))}
// //       </ul>
// //       <ul>
// //         {messages.map((msg) => (
// //           <li key={msg.id}>{msg.message}</li>
// //         ))}
// //       </ul>
// //     </div>
// //   );
// // };

// // export default App;


// import React, { useState, useEffect } from 'react';
// import { QRCodeCanvas } from 'qrcode.react';

// const TelegramLogin = () => {
//   const [qrCodeLink, setQrCodeLink] = useState(null);
//   const [sessionActive, setSessionActive] = useState(false);
//   const [chats, setChats] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Function to fetch chats from backend
//   const fetchChats = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('http://localhost:3001/fetch-chats');
//       const data = await response.json();
      
//       if (response.ok) {
//         setChats(data.chats);
//         setSessionActive(true);
//       } else {
//         setError(data.error || 'Failed to fetch chats');
//       }
//     } catch (error) {
//       setError('Error connecting to server');
//       console.error('Error fetching chats:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Generate QR code and handle login
//   const generateQRCode = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await fetch('http://localhost:3001/generate-qr');
//       const data = await response.json();
      
//       if (data.loginLink) {
//         setQrCodeLink(data.loginLink);
//         // Start polling for session status
//         startSessionCheck();
//       }
//     } catch (error) {
//       setError('Failed to generate QR code');
//       console.error('Error fetching QR code:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Poll for session status
//   const startSessionCheck = () => {
//     const checkInterval = setInterval(async () => {
//       try {
//         const response = await fetch('http://localhost:3001/check-session');
//         const data = await response.json();
        
//         if (data.isActive) {
//           clearInterval(checkInterval);
//           await fetchChats();
//         }
//       } catch (error) {
//         console.error('Error checking session:', error);
//       }
//     }, 3000); // Check every 3 seconds

//     // Cleanup interval after 2 minutes
//     setTimeout(() => {
//       clearInterval(checkInterval);
//     }, 120000);
//   };

//   return (
//     <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
//       <h1 className="text-2xl font-bold mb-6 text-center">Login with Telegram QR Code</h1>
      
//       {error && (
//         <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
//           {error}
//         </div>
//       )}

//       {!sessionActive && (
//         <button
//           onClick={generateQRCode}
//           disabled={loading}
//           className="w-full mb-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
//         >
//           {loading ? 'Generating...' : 'Generate QR'}
//         </button>
//       )}

//       {!sessionActive && qrCodeLink && (
//         <div className="text-center mb-6">
//           <p className="mb-4">Scan the QR code to login:</p>
//           <div className="inline-block p-4 bg-white rounded-lg shadow">
//             <QRCodeCanvas value={qrCodeLink} size={200} />
//           </div>
//         </div>
//       )}

//       {sessionActive && (
//         <div>
//           <h2 className="text-xl font-semibold mb-4">Your Chats</h2>
//           {loading ? (
//             <p className="text-center">Loading chats...</p>
//           ) : (
//             <div className="space-y-2">
//               {chats.map((chat) => (
//                 <div
//                   key={chat.id}
//                   className="p-3 bg-gray-50 rounded flex justify-between items-center"
//                 >
//                   <div>
//                     <p className="font-medium">{chat.name}</p>
//                     <p className="text-sm text-gray-500">{chat.type}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default TelegramLogin;




import React, { useState, useEffect } from "react";
import axios from "axios";
import { QRCodeCanvas } from 'qrcode.react';

const App = () => {
  // Authentication State
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [phoneCodeHash, setPhoneCodeHash] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authStep, setAuthStep] = useState("qr");
  const [sessionToken, setSessionToken] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [qrCodeLink, setQrCodeLink] = useState(null);

  // Chat State
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const backendUrl = "http://localhost:5000"; // Updated to use unified backend port

  const generateQRCode = async () => {
    try {
      console.log("Starting QR code generation...");
      const response = await axios.get(`${backendUrl}/generate-qr`);
      console.log("QR generation response:", response.data);
      
      if (response.data.loginLink) {
        console.log("Setting QR code link:", response.data.loginLink);
        setQrCodeLink(response.data.loginLink);
        setSessionToken(response.data.sessionToken);
        startCheckingSession(response.data.sessionToken);
      } else {
        console.error("No login link in response");
        setError('Invalid QR code response');
      }
    } catch (error) {
      console.error("QR generation error:", error);
      setError(error.response?.data?.error || 'Failed to generate QR code');
      setQrCodeLink(null); // Reset QR code if there's an error
    }
  };

  const startCheckingSession = (token) => {
    console.log("Starting session check with token:", token);
    
    if (!token) {
      console.error("No token provided for session checking");
      setError("Invalid session token");
      return;
    }
  
    const interval = setInterval(async () => {
      try {
        console.log("Checking session...");
        const response = await axios.get(`${backendUrl}/check-session`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log("Session check response:", response.data);
        
        if (response.data.isActive) {
          console.log("Session is active, authenticating...");
          setIsAuthenticated(true);
          setPopupVisible(true);
          clearInterval(interval);
          // fetchChats(token);
        }
      } catch (error) {
        console.error("Session check error:", error);
        setError(error.response?.data?.message || "Session check failed");
        
        // If we get a 401 or 403, stop checking
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.log("Session is invalid, stopping checks");
          clearInterval(interval);
          setQrCodeLink(null); // Reset QR code
        }
      }
    }, 3000);
  
    // Store interval ID to clear it later
    const timeoutId = setTimeout(() => {
      console.log("QR code session timeout");
      clearInterval(interval);
      setError("QR code expired. Please generate a new one.");
      setQrCodeLink(null);
    }, 120000);
  
    // Clean up function
    return () => {
      clearInterval(interval);
      clearTimeout(timeoutId);
    };
  };

  const sendOTP = async () => {
    try {
      const response = await axios.post(`${backendUrl}/send-otp`, { phoneNumber });
      setPhoneCodeHash(response.data.phoneCodeHash);
      setAuthStep("otp");
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send OTP");
    }
  };

  const validateOTP = async () => {
    try {
      const response = await axios.post(`${backendUrl}/validate-otp`, {
        phoneNumber,
        otp,
        phoneCodeHash,
      });
      setSessionToken(response.data.sessionToken);
      setUser(response.data.user);
      setIsAuthenticated(true);
      setError(null);
      setPopupVisible(true);
    } catch (error) {
      setError(error.response?.data?.message || "OTP Validation Failed");
    }
  };

  // const fetchChats = async (token = sessionToken) => {
  //   try {
  //     const response = await axios.get(`${backendUrl}/chats`, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     setChats(response.data);
  //     setError(null);
  //   } catch (error) {
  //     setError("Failed to fetch chats.");
  //   }
  // };

  // const fetchMessages = async (chatId) => {
  //   try {
  //     const response = await axios.get(`${backendUrl}/chats/${chatId}/messages`, {
  //       headers: { 
  //         'Authorization': `Bearer ${sessionToken}`,
  //         'Content-Type': 'application/json'
  //       }
  //     });
      
  //     setMessages(response.data || []);
  //     setSelectedChatId(chatId);
  //   } catch (error) {
  //     console.error("Error fetching messages:", error);
  //     setError(error.message || "Failed to fetch messages");
  //   }
  // };

  const openShiroChat = () => {
    window.open("https://t.me/shiro_0bot?start=start", "_blank");
  };


  // useEffect(() => {
  //   if (isAuthenticated) 
  //     fetchChats();
  // }, [isAuthenticated, sessionToken]);

  const renderPopup = () => (
    popupVisible && (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#17212c",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}>
        <div style={{
          position: "relative",
          backgroundColor: "#2b5279",
          padding: "20px",
          borderRadius: "10px",
          width: "400px",
          textAlign: "center",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
        }}>
          <button
            onClick={() => setPopupVisible(false)}
            style={{
              position: "absolute",
              top: "-0px",
              right: "-1px",
              backgroundColor: "#FF0000",
              border: "none",
              color: "#fff",
              fontSize: "20px",
              cursor: "pointer",
              width: "30px",
              height: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
            }}
          >&times;</button>
          <h2 style={{ marginBottom: "20px", color: "#fff" }}>
            Shiro is connected!
          </h2>
          <p style={{ marginBottom: "20px", color: "#fff" }}>
            You will now get summaries based on your chats.
            <br />
            <strong>@shiro_0bot</strong>
          </p>
          <button
            onClick={openShiroChat}
            style={{
              padding: "10px 20px",
              backgroundColor: "#00a884",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Open Shiro
          </button>
        </div>
      </div>
    )
  );

  const renderQRSection = () => (
    <div style={{ textAlign: "center" }}>
      <p style={{ marginBottom: "20px" }}>
        Go to Telegram: Settings, tap on Devices and scan.
      </p>
      {error && (
        <div style={{
          color: "#ff4444",
          marginBottom: "10px",
          padding: "10px",
          backgroundColor: "rgba(255, 0, 0, 0.1)",
          borderRadius: "5px"
        }}>
          {error}
        </div>
      )}
      {!qrCodeLink && (
        <button
          onClick={generateQRCode}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#00a884",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          Generate QR
        </button>
      )}
      {qrCodeLink && (
        <div>
          <QRCodeCanvas
            value={qrCodeLink}
            size={200}
            style={{ margin: "0 auto" }}
          />
          <button
            onClick={() => {
              setQrCodeLink(null);
              setError(null);
            }}
            style={{
              marginTop: "10px",
              padding: "5px 10px",
              backgroundColor: "#ff4444",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Reset QR Code
          </button>
        </div>
      )}
    </div>
  );

  const renderAuthStep = () => (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      backgroundColor: "#17212b",
      color: "#fff",
    }}>
      <div style={{
        width: "300px",
        padding: "20px",
        backgroundColor: "#2a5277",
        borderRadius: "10px",
      }}>
        <div style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}>
          <button
              onClick={() => {
                setAuthStep("qr");
                setError(null);
                setQrCodeLink(null);
              }}
            style={{
              padding: "10px 20px",
              backgroundColor: authStep === "qr" ? "#00a884" : "transparent",
              color: "#fff",
              border: "none",
              borderRadius: "5px 0 0 5px",
              cursor: "pointer",
            }}
          >
            QR Code
          </button>
          <button
             onClick={() => {
              setAuthStep("phone");
              setError(null);
            }}
            style={{
              padding: "10px 20px",
              backgroundColor: authStep === "phone" ? "#00a884" : "transparent",
              color: "#fff",
              border: "none",
              borderRadius: "0 5px 5px 0",
              cursor: "pointer",
            }}
          >
            Phone
          </button>
        </div>

        {authStep === "qr" ? renderQRSection()  : authStep === "phone" ? (
          <div>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
              Enter Phone Number
            </h2>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1234567890"
              style={{
                width: "93%",
                padding: "10px",
                marginBottom: "15px",
                backgroundColor: "#17212b",
                color: "#fff",
                border: "1px solid #2a5277",
                borderRadius: "5px",
              }}
            />
            <button
              onClick={sendOTP}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#00a884",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Send OTP
            </button>
          </div>
        ) : (
          <div>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Enter OTP</h2>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              style={{
                width: "93%",
                padding: "10px",
                marginBottom: "15px",
                backgroundColor: "#17212b",
                color: "#fff",
                border: "1px solid #2a5277",
                borderRadius: "5px",
              }}
            />
            <button
              onClick={validateOTP}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#00a884",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Validate OTP
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // const renderChatInterface = () => (
  //   <div style={{
  //     display: "flex",
  //     height: "100vh",
  //     backgroundColor: "#17212b",
  //     color: "#fff",
  //   }}>
  //     <div style={{
  //       width: "500px",
  //       backgroundColor: "#17212b",
  //       padding: "20px",
  //       overflowY: "auto",
  //     }}>
  //       <h2>Chats</h2>
  //       <ul style={{ listStyle: "none", padding: 0, marginTop: "10px" }}>
  //         {chats.map((chat) => (
  //           <li
  //             key={chat.id}
  //             onClick={() => fetchMessages(chat.id)}
  //             style={{
  //               cursor: "pointer",
  //               padding: "20px",
  //               backgroundColor: selectedChatId === chat.id ? "#2a5277" : "transparent",
  //               borderRadius: "20px",
  //               fontSize: "18px",
  //               color: "#fff",
  //               transition: "background-color 0.3s ease",
  //               display: "flex",
  //               alignItems: "center",
  //             }}
  //           >
  //             <div style={{
  //               width: "40px",
  //               height: "40px",
  //               borderRadius: "50%",
  //               backgroundColor: "#007bff",
  //               marginRight: "10px",
  //               display: "flex",
  //               alignItems: "center",
  //               justifyContent: "center",
  //               color: "#fff",
  //               fontSize: "18px",
  //             }}>
  //               {chat.name.charAt(0)}
  //             </div>
  //             {chat.name}
  //           </li>
  //         ))}
  //       </ul>
  //     </div>

  //     <div style={{
  //       flex: 1,
  //       display: "flex",
  //       flexDirection: "column",
  //       borderLeft: "1px solid #2a5277",
  //     }}>
  //       {selectedChatId ? (
  //         <div style={{ flex: 1, backgroundColor: "#0d0d0c", overflowY: "auto", paddingTop: "85px" }}>
  //           {selectedChatId && chats.length > 0 && (
  //             <div style={{
  //               marginBottom: "15px",
  //               padding: "25px",
  //               width: "95%",
  //               backgroundColor: "#17212b",
  //               boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  //               position: "fixed",
  //               zIndex: 1,
  //               top: 0,
  //             }}>
  //               <h3 style={{ color: "#fff", margin: 0 }}>
  //                 {chats.find((chat) => chat.id === selectedChatId)?.name}
  //               </h3>
  //             </div>
  //           )}
  //           {messages.length > 0 ? (
  //             messages.map((message, index) => (
  //               <div
  //                 key={index}
  //                 style={{
  //                   textAlign: message.sender === user?.id ? "right" : "left",
  //                   marginBottom: "10px",
  //                   padding: "3px"
  //                 }}
  //               >
  //                 <span style={{
  //                   backgroundColor: message.sender === user?.id ? "#00a884" : "#2a5277",
  //                   padding: "10px",
  //                   borderRadius: "10px",
  //                   display: "inline-block",
  //                   maxWidth: "70%",
  //                 }}>
  //                   {message.message}
  //                 </span>
  //               </div>
  //             ))
  //           ) : (
  //             <div style={{
  //               flex: 1,
  //               display: "flex",
  //               alignItems: "center",
  //               justifyContent: "center",
  //             }}>
  //               <h2>No messages in this chat</h2>
  //             </div>
  //           )}
  //         </div>
  //       ) : (
  //         <div style={{
  //           flex: 1,
  //           display: "flex",
  //           alignItems: "center",
  //           justifyContent: "center",
  //         }}>
  //           <h2>Select a chat to view messages</h2>
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );

  return (
    <>
      {renderPopup()}
      {/* {isAuthenticated ? renderChatInterface() : renderAuthStep()} */}
      {renderAuthStep()}
    </>
  );
};

export default App;