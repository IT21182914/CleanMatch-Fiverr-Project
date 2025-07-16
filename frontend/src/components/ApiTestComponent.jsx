import { useState } from "react";
import { authAPI } from "../lib/api";

const ApiTestComponent = () => {
  const [testResult, setTestResult] = useState("");
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setTestResult("");
    
    try {
      // Test basic API health check
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/../health`);
      
      if (response.ok) {
        const data = await response.json();
        setTestResult(`✅ Backend connection successful! Status: ${data.status}`);
      } else {
        setTestResult(`❌ Backend responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error("Connection test failed:", error);
      setTestResult(`❌ Connection failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setTestResult("");
    
    try {
      // Test with proper dummy credentials format
      await authAPI.login({ 
        email: "test@example.com", 
        password: "TestPassword123!" 
      });
      // If we get here, login succeeded (unexpected with dummy credentials)
      setTestResult("⚠️ Login succeeded with test credentials - check auth logic");
    } catch (error) {
      console.log("Test login error:", error);
      // Even if login fails, we should get a proper error response indicating the endpoint works
      if (error.statusCode === 400) {
        setTestResult("✅ Login endpoint working (validation error as expected)");
      } else if (error.statusCode === 401) {
        setTestResult("✅ Login endpoint working (authentication error as expected)");
      } else if (error.type === "NETWORK_ERROR") {
        setTestResult(`❌ Network error: ${error.message}`);
      } else {
        setTestResult(`✅ Login endpoint accessible (got ${error.statusCode}): ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      border: '1px solid #ccc', 
      padding: '10px',
      borderRadius: '5px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h4>API Connection Test</h4>
      <div style={{ marginBottom: '10px' }}>
        <strong>API URL:</strong> {import.meta.env.VITE_API_URL || "http://localhost:5000/api"}
      </div>
      <button 
        onClick={testConnection} 
        disabled={loading}
        style={{ 
          marginRight: '5px', 
          padding: '5px 10px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '3px'
        }}
      >
        Test Health
      </button>
      <button 
        onClick={testLogin} 
        disabled={loading}
        style={{ 
          padding: '5px 10px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '3px'
        }}
      >
        Test Login
      </button>
      {testResult && (
        <div style={{ 
          marginTop: '10px', 
          padding: '5px', 
          backgroundColor: testResult.includes('✅') ? '#d4edda' : '#f8d7da',
          borderRadius: '3px',
          fontSize: '12px'
        }}>
          {testResult}
        </div>
      )}
    </div>
  );
};

export default ApiTestComponent;
