import React, { useState } from "react";
import { getStats } from "../lib/api";

export default function Stats() {
  const [code, setCode] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchStats(e) {
    e && e.preventDefault();
    setError("");
    setData(null);
    if (!code.trim()) return setError("Enter a shortcode (e.g. abc123)");

    setLoading(true);
    try {
      const res = await getStats(code.trim());
      setData(res);
    } catch (err) {
      setError(err.message || "Failed to fetch stats");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card">
      <h2>Get Stats</h2>
      <form onSubmit={fetchStats} className="form-inline">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="shortcode"
        />
        <button disabled={loading} type="submit">{loading ? "Loading..." : "Get Stats"}</button>
      </form>

      {error && <p className="err">{error}</p>}

      {data && (
        <div className="stats">
          <p>
            <strong>Original URL:</strong>{" "}
            <a href={data.url} target="_blank" rel="noreferrer">
              {data.url}
            </a>
          </p>
          <p><strong>Created:</strong> {new Date(data.createdAt).toLocaleString()}</p>
          <p><strong>Expiry:</strong> {new Date(data.expiry).toLocaleString()}</p>
          <p><strong>Total Clicks:</strong> {data.totalClicks}</p>
          <details>
            <summary>Click details</summary>
            <ul>
              {data.clicks.map((c, i) => (
                <li key={i}>
                  {new Date(c.time).toLocaleString()} — {c.referrer} — {c.ip}
                </li>
              ))}
            </ul>
          </details>
        </div>
      )}
    </section>
  );
}
