document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:3001/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }) 
    });

    const data = await response.json();

    if (data.success) {
      console.log("✅ Signup successful:", data);
      console.log("Redirecting to Homepage.html...");
      localStorage.setItem("user", JSON.stringify({ name, email }));
      window.location.href = "/Homepage.html";  
    } else {
  console.warn("⚠️ Signup failed:", data);
  alert("Signup failed: " + data.message);
}

  } catch (err) {
    console.error(err);
    alert("Error connecting to server.");
  }
});
