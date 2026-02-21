import { useState } from "react";
import axios from "axios";

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState([]);
  const [status, setStatus] = useState("Pending");
  const [loading, setLoading] = useState(false);

  function handleFormChange(e) {
    const { name, value } = e.target;

    //setFormData({ ...formData, [name]: value }); //This is correct too

    setFormData((prevFormData) => ({ ...prevFormData, [name]: value })); //This is used to handle multiple changes simultaneouly
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    let errors = [];

    for (let i in formData) {
      if (formData[i].trim() === "") {
        errors.push(`${i} is Empty`);
      }
    }

    if (errors.length > 0) {
      setError(errors);
      return;
    }

    setError([]);

    let email = formData.email;
    let password = formData.password;

    const emailregex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailregex.test(email)) {
      errors.push("Email is not valid");
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_!@#$%^&*()])[A-Za-z\d_!@#$%^&*()]{8,}$/;
    if (!passwordRegex.test(password)) {
      errors.push(
        "Password must contain 8+ characters, uppercase, lowercase, digit & special character",
      );
    }

    if (errors.length > 0) {
      setError(errors);
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/signup", formData);
      setLoading(false);
      setStatus("Successful");
      setError([]);
      setFormData({ Username: "", Email: "", Password: "" });
    } catch (error) {
      setLoading(false);
      setStatus("Pending");

      if (!error.response) {
        setError(["Network Error"]);
        return;
      }

      const statusCode = error.response.status;
      const message = error.response.data?.message || "Something went wrong";

      if ([400, 409, 500, 503, 422].includes(statusCode)) {
        setError([message]);
      } else {
        setError(["Unexpected Error Occurred"]);
      }
    }
  }

  return (
    <>
      <h1>Please provide the credentials</h1>
      {status === "Successful" && "User Signed in Successfully"}
      <form onSubmit={handleFormSubmit}>
        <div>
          <button type="button">Sign in with Google</button>
        </div>
        <div>
          <label>
            Username:{" "}
            <input
              type="text"
              name="username"
              value={formData.username}
              placeholder="Enter the name"
              onChange={handleFormChange}
            />
          </label>
          <label>
            Password:{" "}
            <input
              type="password"
              name="password"
              value={formData.password}
              placeholder="Enter the password"
              onChange={handleFormChange}
            />
          </label>
          <label>
            Email:{" "}
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Enter your email"
              onChange={handleFormChange}
            />
          </label>
        </div>
        <button
          type="button"
          disabled={
            formData.username === "" ||
            formData.email === "" ||
            formData.password === "" ||
            loading
          }
        >
          Continue
        </button>
        {error.length > 0 && (
          <ul>
            {error.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        )}
      </form>
    </>
  );
}

export default Signup;
