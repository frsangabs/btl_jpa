import { useEffect, useState } from "react";
import {
  searchSpotifyArtistImage,
  searchAlbumImage,
  searchTrackImage,
} from "../spotify";

export default function useSpotifyImage(type, name) {
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!name) return;

    const fetchImg = async () => {
      let img = null;

      if (type === "artist") img = await searchSpotifyArtistImage(name);
      if (type === "album") img = await searchAlbumImage(name);
      if (type === "track") img = await searchTrackImage(name);

      setImage(img);
    };

    fetchImg();
  }, [type, name]);

  return image;
}
