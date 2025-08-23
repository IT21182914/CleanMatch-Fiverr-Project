// Simple test to call the cleaners API directly
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AY2xlYW5tYXRjaC5jb20iLCJpYXQiOjE3MzQ4NzY2MjMsImV4cCI6MTczNDk2MzAyM30.B_lKk0N4eBDFjy0Nh-N_hq8L0fKMZOH9VBOgw2wrKPA"; // Replace with actual token

fetch("http://localhost:5000/api/admin/reviews/cleaners", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
})
  .then((response) => {
    console.log("Status:", response.status);
    console.log("Headers:", Object.fromEntries(response.headers.entries()));
    return response.json();
  })
  .then((data) => {
    console.log("Success:", data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
