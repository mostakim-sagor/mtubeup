"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MStorage } from "@/lib/storage";

export default function Finished() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("recent");

  useEffect(() => {
    setItems(MStorage.getFinished());
  }, []);

  function remove(id) {
    MStorage.removeFinished(id);
    setItems(MStorage.getFinished());
  }

  const visible = useMemo(() => {
    let list = [...items];
    if (filter !== "all") list = list.filter((i) => i.format === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((i) => i.title.toLowerCase().includes(q));
    }
    list.sort((a, b) => {
      if (sort === "recent") return b.completedAt - a.completedAt;
      if (sort === "oldest") return a.completedAt - b.completedAt;
      if (sort === "name") return a.title.localeCompare(b.title);
      return 0;
    });
    return list;
  }, [items, query, filter, sort]);

  return (
    <div className="container">
      <div className="section-head">
        <h2>Finished</h2>
        <p className="muted">Downloads sent to this browser&apos;s default download location.</p>
      </div>

      <div className="toolbar">
        <div className="input-row" style={{ flex: 1, minWidth: 180 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 17, height: 17, color: "var(--ink-500)", flexShrink: 0 }}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input type="search" placeholder="Search finished downloads…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <select className="select-field" style={{ width: "auto" }} value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="recent">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>
      <div className="filter-pills" style={{ marginBottom: 18 }}>
        {["all", "video", "audio"].map((f) => (
          <button key={f} className={`filter-pill${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg></div>
          <h3>No finished downloads yet</h3>
          <p className="muted">Completed downloads will show up here.</p>
          <Link href="/~" className="btn btn-primary" style={{ marginTop: 14 }}>Paste a URL</Link>
        </div>
      ) : (
        <div className="finished-grid">
          {visible.map((d) => (
            <div className="card" key={d.id}>
              <div className="video-card">
                <div className="video-thumb">
                  {d.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={d.thumbnail} alt={d.title} />
                  ) : null}
                </div>
                <div className="video-meta" style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.title}</h3>
                  <div className="meta-line">
                    <span className="tag">{d.format === "audio" ? "Audio" : "Video"}</span>
                    <span>{d.quality} {d.sizeLabel ? `· ${d.sizeLabel}` : ""}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, padding: "0 16px 16px" }}>
                <button className="icon-btn btn-sm" aria-label="Remove" style={{ width: 38, height: 38 }} onClick={() => remove(d.id)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m5 0V4a2 2 0 012-2h0a2 2 0 012 2v2" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
