import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDocs(collection(db, "movies"));
      setMovies(snap.docs.map(doc => doc.data()));
    };
    fetch();
  }, []);

  return (
    <div style={{ background: "#000", color: "#fff", padding: 20 }}>
      <h1>STREAMFLIX</h1>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {movies.map((m, i) => (
          <a key={i} href={`/watch?video=${m.videoUrl}&type=${m.videoType}`}>
            <img src={m.cover} width="150" />
            <p>{m.title}</p>
          </a>
        ))}
      </div>
    </div>
  );
          }
