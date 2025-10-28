import { useEffect, useState } from "react";
import axios from "axios";


const HOMEAPI = axios.create({
  baseURL: import.meta.env.VITE_HOME_API_URL || "http://localhost:5000/",
});


export default function ApiTest() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const res = await HOMEAPI.get("/");
        setMessage(res.data);
      } catch (err) {
        setMessage("❌ Backend not reachable");
      }
    };
    fetchAPI();
  }, []);

  return (
    <div className="p-10">
      <h2 className="text-xl font-bold">Backend Connectivity Test</h2>
      <p className="mt-3">{message}</p>
    </div>
  );
}
