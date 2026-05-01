import { useRouter } from "next/router";

export default function Watch() {
  const router = useRouter();
  const { video, type } = router.query;

  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "#fff" }}>
      <h1>Assistir</h1>

      {type === "mp4" && (
        <video controls width="100%">
          <source src={video} type="video/mp4" />
        </video>
      )}

      {type === "youtube" && (
        <iframe
          width="100%"
          height="500"
          src={`https://www.youtube.com/embed/${video}`}
          allowFullScreen
        />
      )}

      {type === "drive" && (
        <iframe
          src={video}
          width="100%"
          height="500"
          allow="autoplay"
        />
      )}
    </div>
  );
        }
