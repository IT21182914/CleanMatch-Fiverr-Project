const http = require("http");

// Test the cleaners API endpoint
function testAPI() {
  // First, let's test if we can get an admin token (using the test admin we just created)
  const loginData = JSON.stringify({
    email: "testadmin@cleanmatch.com", // Test admin we just created
    password: "admin123", // Known password
  });

  const loginOptions = {
    hostname: "127.0.0.1",
    port: 5000,
    path: "/api/auth/login",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(loginData),
    },
  };

  console.log("Testing admin login...");

  const loginReq = http.request(loginOptions, (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      console.log("Login response status:", res.statusCode);
      console.log("Login response:", data);

      if (res.statusCode === 200) {
        try {
          const loginResult = JSON.parse(data);
          if (loginResult.token) {
            testCleanersEndpoint(loginResult.token);
          } else {
            console.log("No token in login response");
          }
        } catch (e) {
          console.log("Error parsing login response:", e.message);
        }
      } else {
        console.log("Login failed");
      }
    });
  });

  loginReq.on("error", (err) => {
    console.log("Login request error:", err.message);
  });

  loginReq.write(loginData);
  loginReq.end();
}

function testCleanersEndpoint(token) {
  console.log("\nTesting cleaners endpoint...");

  const options = {
    hostname: "127.0.0.1",
    port: 5000,
    path: "/api/admin/reviews/cleaners",
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const req = http.request(options, (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      console.log("Cleaners endpoint status:", res.statusCode);
      console.log("Cleaners response:", data);

      if (res.statusCode === 500) {
        console.log(
          "\n🚨 Server error! This is likely the SSL connection issue."
        );
        console.log(
          "The cleaners are in the database, but the API can't connect due to SSL."
        );
      }
    });
  });

  req.on("error", (err) => {
    console.log("Cleaners request error:", err.message);
  });

  req.end();
}

testAPI();
