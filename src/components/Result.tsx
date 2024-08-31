import React from "react";
import { ArrowLeft, Palette } from "lucide-react";

interface Album {
  id: string;
  name: string;
  artist: string;
  artistId: string;
  coverUrl: string;
  releaseDate: string;
}

interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  albums: Omit<Album, "artist" | "artistId">[];
}

type ResultItem = Album | Artist;

interface ResultProps {
  item: ResultItem;
  onBack: () => void;
  onGetColours?: (album: Album) => void;
  onAlbumClick?: (album: Album) => void;
  onArtistClick?: (artistId: string) => void;
}

const Result: React.FC<ResultProps> = ({
  item,
  onBack,
  onGetColours,
  onAlbumClick,
  onArtistClick,
}) => {
  const isArtist = "albums" in item;

  const handleAlbumClick = (album: Omit<Album, "artist" | "artistId">) => {
    if (onAlbumClick) {
      onAlbumClick({
        ...album,
        artist: (item as Artist).name,
        artistId: (item as Artist).id,
      });
    }
  };

  const handleArtistClick = (e: React.MouseEvent, artistId: string) => {
    e.stopPropagation();
    if (onArtistClick) {
      onArtistClick(artistId);
    }
  };

  const sortedAlbums = isArtist
    ? [...item.albums].sort(
        (a, b) =>
          new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
      )
    : [];

  return (
    <div className="bg-gray-900 text-white h-full flex flex-col select-none">
      <button onClick={onBack} className="text-white cursor-pointer">
        <ArrowLeft size={24} />
      </button>
      <div className="flex items-center px-4"></div>
      <div className="flex-grow overflow-auto px-4 pb-6">
        <img
          src={isArtist ? item.imageUrl : item.coverUrl}
          alt={item.name}
          className={
            isArtist
              ? "mt-4 w-[150px] h-[150px] rounded-full mx-auto mb-4"
              : "mt-4 w-[200px] h-[200px] rounded mx-auto mb-4"
          }
        />
        <h2 className="text-2xl font-bold text-center">{item.name}</h2>
        {!isArtist && (
          <>
            <p className="text-lg text-center text-gray-400 mt-2">
              <span
                className="hover:underline cursor-pointer inline-block"
                onClick={(e) => handleArtistClick(e, (item as Album).artistId)}
              >
                {item.artist}
              </span>
            </p>
            <div className="flex justify-center mt-6">
              <button
                onClick={() => onGetColours && onGetColours(item as Album)}
                className="w-full max-w-xs bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center cursor-pointer"
              >
                <Palette size={18} className="mr-2" />
                Get Colours
              </button>
            </div>
          </>
        )}
        {isArtist && (
          <div>
            <h3 className="text-xl border-b-2 border-blue-500 font-semibold mt-2 mb-2">
              Discography
            </h3>
            <div className="space-y-2">
              {sortedAlbums.map((album) => (
                <div
                  key={album.id}
                  className="text-lg flex items-center space-x-2 cursor-pointer hover:bg-gray-800 p-2 rounded transition-colors duration-200"
                  onClick={() => handleAlbumClick(album)}
                >
                  <img
                    src={album.coverUrl}
                    alt={album.name}
                    className="w-12 h-12 rounded"
                  />
                  <span>{album.name}</span>
                  <span className="text-sm text-gray-400">
                    {" "}
                    • {new Date(album.releaseDate).getFullYear()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Result;
