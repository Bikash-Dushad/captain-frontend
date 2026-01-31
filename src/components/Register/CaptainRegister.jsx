import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./CaptainRegister.css";
import { postData } from "../../api/apiService";
import { AuthContext } from "../../contexts/AuthContext";

const CaptainRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    avatar: "",
    license: {
      number: "",
      expiryDate: "",
      frontImage: "https://example.com/license/front.jpg",
      backImage: "https://example.com/license/back.jpg",
    },
    bankDetails: {
      accountHolderName: "",
      accountNumber: "",
      ifscCode: "SBIN0001234",
      bankName: "State Bank of India",
      branch: "Connaught Place",
      upiId: "rajesh.kumar@okhdfcbank",
    },
    documents: {
      aadharCard: {
        number: "",
        frontImage: "https://example.com/aadhar/front.jpg",
        backImage: "https://example.com/aadhar/back.jpg",
      },
      panCard: { number: "", image: "https://example.com/pan/pan.jpg" },
      medicalCertificate: {
        expiryDate: "",
        document: "https://example.com/medical/certificate.pdf",
      },
    },
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeSection, setActiveSection] = useState("basic");
  const { isRegistered, setCaptain } = useContext(AuthContext);

  useEffect(() => {
    if (isRegistered) {
      navigate("/", { replace: true });
    }
  }, [isRegistered, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested fields
    if (name.includes(".")) {
      const keys = name.split(".");
      if (keys.length === 2) {
        setFormData((prev) => ({
          ...prev,
          [keys[0]]: {
            ...prev[keys[0]],
            [keys[1]]: value,
          },
        }));
      } else if (keys.length === 3) {
        setFormData((prev) => ({
          ...prev,
          [keys[0]]: {
            ...prev[keys[0]],
            [keys[1]]: {
              ...prev[keys[0]][keys[1]],
              [keys[2]]: value,
            },
          },
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (field.includes(".")) {
          const keys = field.split(".");
          if (keys.length === 2) {
            setFormData((prev) => ({
              ...prev,
              [keys[0]]: {
                ...prev[keys[0]],
                [keys[1]]: reader.result,
              },
            }));
          } else if (keys.length === 3) {
            setFormData((prev) => ({
              ...prev,
              [keys[0]]: {
                ...prev[keys[0]],
                [keys[1]]: {
                  ...prev[keys[0]][keys[1]],
                  [keys[2]]: reader.result,
                },
              },
            }));
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic info validation
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.gender) newErrors.gender = "Gender is required";

    // License validation
    if (!formData.license.number)
      newErrors.licenseNumber = "License number is required";
    if (!formData.license.expiryDate)
      newErrors.licenseExpiry = "License expiry date is required";
    // if (!formData.license.frontImage)
    //   newErrors.licenseFront = "License front image is required";

    // Bank details validation
    if (!formData.bankDetails.accountHolderName)
      newErrors.accountHolder = "Account holder name is required";
    if (!formData.bankDetails.accountNumber)
      newErrors.accountNumber = "Account number is required";
    if (!formData.bankDetails.ifscCode)
      newErrors.ifscCode = "IFSC code is required";

    // Documents validation
    if (!formData.documents.aadharCard.number)
      newErrors.aadharNumber = "Aadhar number is required";
    if (!formData.documents.panCard.number)
      newErrors.panNumber = "PAN number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fill all required fields correctly");
      return;
    }

    setLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await postData("captain/api/captain/captainRegister", {
        ...formData,
      });

      if (response?.responseCode === 200) {
        setCaptain(response.data);
      } else {
        console.log(response);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderBasicInfo = () => (
    <div className="form-section active">
      <h2 className="section-title">Basic Information</h2>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? "input-error" : ""}
            placeholder="Enter your full name"
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "input-error" : ""}
            placeholder="Enter your email"
          />
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="gender">Gender *</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={errors.gender ? "input-error" : ""}
          >
            <option value="">""</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="others">Others</option>
          </select>
          {errors.gender && (
            <span className="error-message">{errors.gender}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="avatar">Profile Picture (Optional)</label>
          <div className="file-upload">
            <input
              type="file"
              id="avatar"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "avatar")}
            />
            <label htmlFor="avatar" className="file-label">
              {formData.avatar ? "Change Picture" : "Upload Picture"}
            </label>
          </div>
          {formData.avatar && (
            <div className="preview">
              <img
                src={formData.avatar}
                alt="Preview"
                className="preview-image"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderLicenseInfo = () => (
    <div className="form-section">
      <h2 className="section-title">License Details</h2>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="license.number">License Number *</label>
          <input
            type="text"
            id="license.number"
            name="license.number"
            value={formData.license.number}
            onChange={handleChange}
            className={errors.licenseNumber ? "input-error" : ""}
            placeholder="Enter license number"
          />
          {errors.licenseNumber && (
            <span className="error-message">{errors.licenseNumber}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="license.expiryDate">License Expiry Date *</label>
          <input
            type="date"
            id="license.expiryDate"
            name="license.expiryDate"
            value={formData.license.expiryDate}
            onChange={handleChange}
            className={errors.licenseExpiry ? "input-error" : ""}
          />
          {errors.licenseExpiry && (
            <span className="error-message">{errors.licenseExpiry}</span>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>License Front Image *</label>
          <div className="file-upload">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "license.frontImage")}
            />
            <label className="file-label">
              {formData.license.frontImage
                ? "Change Image"
                : "Upload Front Image"}
            </label>
          </div>
          {errors.licenseFront && (
            <span className="error-message">{errors.licenseFront}</span>
          )}
          {formData.license.frontImage && (
            <div className="preview">
              <img
                src={formData.license.frontImage}
                alt="License Front"
                className="preview-image"
              />
            </div>
          )}
        </div>

        <div className="form-group">
          <label>License Back Image (Optional)</label>
          <div className="file-upload">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "license.backImage")}
            />
            <label className="file-label">
              {formData.license.backImage
                ? "Change Image"
                : "Upload Back Image"}
            </label>
          </div>
          {formData.license.backImage && (
            <div className="preview">
              <img
                src={formData.license.backImage}
                alt="License Back"
                className="preview-image"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderBankInfo = () => (
    <div className="form-section">
      <h2 className="section-title">Bank Details</h2>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="bankDetails.accountHolderName">
            Account Holder Name *
          </label>
          <input
            type="text"
            id="bankDetails.accountHolderName"
            name="bankDetails.accountHolderName"
            value={formData.bankDetails.accountHolderName}
            onChange={handleChange}
            className={errors.accountHolder ? "input-error" : ""}
            placeholder="As per bank records"
          />
          {errors.accountHolder && (
            <span className="error-message">{errors.accountHolder}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="bankDetails.accountNumber">Account Number *</label>
          <input
            type="text"
            id="bankDetails.accountNumber"
            name="bankDetails.accountNumber"
            value={formData.bankDetails.accountNumber}
            onChange={handleChange}
            className={errors.accountNumber ? "input-error" : ""}
            placeholder="Enter account number"
          />
          {errors.accountNumber && (
            <span className="error-message">{errors.accountNumber}</span>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="bankDetails.ifscCode">IFSC Code *</label>
          <input
            type="text"
            id="bankDetails.ifscCode"
            name="bankDetails.ifscCode"
            value={formData.bankDetails.ifscCode}
            onChange={handleChange}
            className={errors.ifscCode ? "input-error" : ""}
            placeholder="Enter IFSC code"
          />
          {errors.ifscCode && (
            <span className="error-message">{errors.ifscCode}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="bankDetails.bankName">Bank Name (Optional)</label>
          <input
            type="text"
            id="bankDetails.bankName"
            name="bankDetails.bankName"
            value={formData.bankDetails.bankName}
            onChange={handleChange}
            placeholder="Enter bank name"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="bankDetails.branch">Branch (Optional)</label>
          <input
            type="text"
            id="bankDetails.branch"
            name="bankDetails.branch"
            value={formData.bankDetails.branch}
            onChange={handleChange}
            placeholder="Enter branch name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="bankDetails.upiId">UPI ID (Optional)</label>
          <input
            type="text"
            id="bankDetails.upiId"
            name="bankDetails.upiId"
            value={formData.bankDetails.upiId}
            onChange={handleChange}
            placeholder="Enter UPI ID"
          />
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="form-section">
      <h2 className="section-title">Required Documents</h2>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="documents.aadharCard.number">
            Aadhar Card Number *
          </label>
          <input
            type="text"
            id="documents.aadharCard.number"
            name="documents.aadharCard.number"
            value={formData.documents.aadharCard.number}
            onChange={handleChange}
            className={errors.aadharNumber ? "input-error" : ""}
            placeholder="Enter 12-digit Aadhar number"
          />
          {errors.aadharNumber && (
            <span className="error-message">{errors.aadharNumber}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="documents.panCard.number">PAN Card Number *</label>
          <input
            type="text"
            id="documents.panCard.number"
            name="documents.panCard.number"
            value={formData.documents.panCard.number}
            onChange={handleChange}
            className={errors.panNumber ? "input-error" : ""}
            placeholder="Enter PAN number"
          />
          {errors.panNumber && (
            <span className="error-message">{errors.panNumber}</span>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Aadhar Card Front Image (Optional)</label>
          <div className="file-upload">
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleFileChange(e, "documents.aadharCard.frontImage")
              }
            />
            <label className="file-label">
              {formData.documents.aadharCard.frontImage
                ? "Change Image"
                : "Upload Front Image"}
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Aadhar Card Back Image (Optional)</label>
          <div className="file-upload">
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleFileChange(e, "documents.aadharCard.backImage")
              }
            />
            <label className="file-label">
              {formData.documents.aadharCard.backImage
                ? "Change Image"
                : "Upload Back Image"}
            </label>
          </div>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>PAN Card Image (Optional)</label>
          <div className="file-upload">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "documents.panCard.image")}
            />
            <label className="file-label">
              {formData.documents.panCard.image
                ? "Change Image"
                : "Upload PAN Image"}
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="documents.medicalCertificate.expiryDate">
            Medical Certificate Expiry (Optional)
          </label>
          <input
            type="date"
            id="documents.medicalCertificate.expiryDate"
            name="documents.medicalCertificate.expiryDate"
            value={formData.documents.medicalCertificate.expiryDate}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Medical Certificate (Optional)</label>
        <div className="file-upload">
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleFileChange(e, "documents.medicalCertificate.document")
            }
          />
          <label className="file-label">
            {formData.documents.medicalCertificate.document
              ? "Change Document"
              : "Upload Certificate"}
          </label>
        </div>
      </div>
    </div>
  );

  const renderProgress = () => (
    <div className="progress-bar">
      <div
        className={`progress-step ${activeSection === "basic" ? "active" : ""}`}
        onClick={() => setActiveSection("basic")}
      >
        <div className="step-circle">1</div>
        <span className="step-label">Basic Info</span>
      </div>
      <div className="progress-line"></div>
      <div
        className={`progress-step ${activeSection === "license" ? "active" : ""}`}
        onClick={() => setActiveSection("license")}
      >
        <div className="step-circle">2</div>
        <span className="step-label">License</span>
      </div>
      <div className="progress-line"></div>
      <div
        className={`progress-step ${activeSection === "bank" ? "active" : ""}`}
        onClick={() => setActiveSection("bank")}
      >
        <div className="step-circle">3</div>
        <span className="step-label">Bank</span>
      </div>
      <div className="progress-line"></div>
      <div
        className={`progress-step ${activeSection === "documents" ? "active" : ""}`}
        onClick={() => setActiveSection("documents")}
      >
        <div className="step-circle">4</div>
        <span className="step-label">Documents</span>
      </div>
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case "basic":
        return renderBasicInfo();
      case "license":
        return renderLicenseInfo();
      case "bank":
        return renderBankInfo();
      case "documents":
        return renderDocuments();
      default:
        return renderBasicInfo();
    }
  };

  const handleNext = () => {
    const sections = ["basic", "license", "bank", "documents"];
    const currentIndex = sections.indexOf(activeSection);
    if (currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const sections = ["basic", "license", "bank", "documents"];
    const currentIndex = sections.indexOf(activeSection);
    if (currentIndex > 0) {
      setActiveSection(sections[currentIndex - 1]);
    }
  };

  return (
    <div className="captain-register-container">
      <div className="glass-form">
        <div className="form-header">
          <h1 className="form-title">Captain Registration</h1>
          <p className="form-subtitle">
            Join our fleet and start earning today
          </p>
        </div>

        {renderProgress()}

        <form onSubmit={handleSubmit} className="form-content">
          {renderActiveSection()}

          <div className="form-navigation">
            {activeSection !== "basic" && (
              <button
                type="button"
                className="btn-secondary"
                onClick={handleBack}
              >
                ← Back
              </button>
            )}

            {activeSection !== "documents" ? (
              <button
                type="button"
                className="btn-primary"
                onClick={handleNext}
              >
                Next →
              </button>
            ) : (
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Processing...
                  </>
                ) : (
                  "Submit Registration"
                )}
              </button>
            )}
          </div>
        </form>

        <div className="form-footer">
          <p className="footer-note">
            * Required fields. Your information is secure and encrypted.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CaptainRegister;
