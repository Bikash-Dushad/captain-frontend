import { useState, useEffect, useRef, useContext } from "react";
import "./Login.css";
import { postData } from "../../api/apiService";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("captain");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState("phone");
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setToken } = useContext(AuthContext);

  const otpRefs = useRef([]);

  useEffect(() => {
    let interval;
    if (step === "otp" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!phone.match(/^\d{10}$/)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);

    try {
      const response = await postData("auth/api/user/sendOTP", {
        phone,
        role,
      });

      if (response?.responseCode === 200) {
        setStep("otp");
      } else {
        setError(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("OTP API Error:", error);
      setError(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input changes
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  // Handle OTP paste
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      otpRefs.current[5].focus();
    }
  };

  // Handle OTP verification - Verify OTP API call
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const otpString = otp.join("");

    if (!otpString.match(/^\d{6}$/)) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      // Call verify OTP API
      const response = await postData(`/auth/api/user/verifyOTP`, {
        phone,
        role,
        otp: otpString,
      });
      if (response?.responseCode === 200) {
        localStorage.setItem("captainToken", response.data.token);
        setToken(response.data.token);
      } else {
        setError(response.data.message || "Invalid OTP");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setTimer(30);
    setOtp(["", "", "", "", "", ""]);
    setError("");
    otpRefs.current[0].focus();

    try {
      const response = await postData(`/auth/resend-otp`, {
        phone,
      });

      if (response?.responseCode === 200) {
      } else {
        setError(response.data.message || "Failed to resend OTP");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>{step === "phone" ? "Welcome!" : "Enter OTP"}</h1>
          <p>
            {step === "phone"
              ? "Enter your phone number to continue"
              : `Enter the 6-digit OTP sent to ${phone}`}
          </p>
        </div>

        {step === "phone" ? (
          <form onSubmit={handlePhoneSubmit}>
            <div className="input-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 10-digit phone number"
                maxLength="10"
                required
                autoFocus
              />
              {error && <div className="error-message">{error}</div>}
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading || !phone.match(/^\d{10}$/)}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit}>
            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (otpRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !digit && index > 0) {
                      otpRefs.current[index - 1].focus();
                    }
                  }}
                  onPaste={index === 0 ? handleOtpPaste : undefined}
                  className="otp-input"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="countdown">
              {timer > 0 ? (
                <p>
                  Resend OTP in <span className="timer">{timer}s</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="resend-btn"
                >
                  Resend OTP
                </button>
              )}
            </div>

            <div className="button-group">
              <button
                type="submit"
                className="submit-btn"
                disabled={loading || otp.some((d) => !d)}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("phone");
                  setOtp(["", "", "", "", "", ""]);
                  setTimer(30);
                  setError("");
                }}
                className="back-btn"
              >
                Change Number
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
