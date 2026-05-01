import { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

export default function Admin() {
  const [type, setType] = useState("movie");
  const [title, setTitle] = useState("");
  const [cover, setCover] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoType, setVideoType] = useState("youtube");

  const [season, setSeason] = useState("");
  const [episode, setEpisode] = useState("");

  const salvar = async () => {
    if (type === "movie") {
      await addDoc(collection(db, "movies"), {
        title,
        cover,
        year,
        description,
        videoUrl,
        videoType
      });
    } else {
      await addDoc(collection(db, "episodes"), {
        title,
        cover,
        year,
        description,
        videoUrl,
        videoType,
        season,
        episode
      });
    }

    alert("Salvo!");
  };

  return (
    <div style={{ background: "#111", color: "#fff", minHeight: "100vh", padding: 20 }}>
      <h1>PAINEL ADM</h1>

      <select onChange={e => setType(e.target.value)}>
        <option value="movie">Filme</option>
        <option value="episode">Episódio</option>
      </select>

      <input placeholder="Título" onChange={e => setTitle(e.target.value)} />
      <input placeholder="Capa URL" onChange={e => setCover(e.target.value)} />
      <input placeholder="Ano" onChange={e => setYear(e.target.value)} />
      <textarea placeholder="Sinopse" onChange={e => setDescription(e.target.value)} />

      {type === "episode" && (
        <>
          <input placeholder="Temporada" onChange={e => setSeason(e.target.value)} />
          <input placeholder="Episódio" onChange={e => setEpisode(e.target.value)} />
        </>
      )}

      <input placeholder="Link do vídeo" onChange={e => setVideoUrl(e.target.value)} />

      <select onChange={e => setVideoType(e.target.value)}>
        <option value="youtube">YouTube</option>
        <option value="drive">Drive</option>
        <option value="mp4">MP4</option>
      </select>

      <button onClick={salvar}>Salvar</button>
    </div>
  );
    }
