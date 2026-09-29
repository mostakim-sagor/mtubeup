"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MStorage } from "@/lib/storage";

export default function Downloads() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(MStorage.getActiveDownloads());
  }, []);

  function refresh() {
    setItems(MStorage.getActiveDownloads());
  }

  function markComplete(item) {
    const remaining = MStorage.getActiveDownloads().filter((d) => d.id !== item.id);
    MStorage.saveActiveDownloads(remaining);
    MStorage.addFinished({
      id: item.id,
      title: item.title,
      thumbnail: item.thumbnail,
      platform: item.platform,
      format: item.format,
      quality: item.quality,
      sizeLabel: item.sizeLabel,
      downloadUrl: item.downloadUrl,
      completedAt: Date.now()
    });
    refresh();
  }

  function remove(id) {
    MStorage.saveActiveDownloads(MStorage.getActiveDownloads().filter((d) => d.id !== id));
    refresh();
  }

  return (
    <div className="container">
      <div className="section-head">
        <h2>Downloads</h2>
        <p className="muted">Downloads are sent directly to your browser&apos;s default download location.</p>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg></div>
          <h3>No active downloads</h3>
          <p className="muted">Start one from the home page.</p>
          <Link href="/~" className="btn btn-primary" style={{ marginTop: 14 }}>Paste a URL</Link>
        </div>
      ) : (
        <div className="downloads-grid">
          {items.map((d) => (
            <div className="card" key={d.id}>
              <div className="video-card" style={{ paddingBottom: 8 }}>
                <div className="video-thumb">
                  {d.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={d.thumbnail} alt={d.title} />
                  ) : null}
                </div>
                <div className="video-meta" style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.title}</h3>
                  <div className="meta-line">{d.quality} · {d.format} {d.sizeLabel ? `· ${d.sizeLabel}` : ""}</div>
                </div>
              </div>
              <div style={{ padding: "0 16px 16px" }}>
                <span className="status-pill" style={{ marginBottom: 12 }}>
                  <span className="dot" />
                  Ready
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => markComplete(d)}>Mark Finished</button>
                  <button className="btn btn-danger btn-sm" style={{ flex: 1 }} onClick={() => remove(d.id)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
