import React, { useState, useEffect } from "react";
import { Search, X, LoaderCircle } from "lucide-react";
import Result from "./Result";

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

type SearchItem = Album | Artist;

interface RecentSearchItem {
  id: string;
  name: string;
  type: "album" | "artist";
  coverUrl: string;
  artist?: string;
  artistId?: string;
}

const mockRecentSearches: RecentSearchItem[] = [
  {
    id: "1",
    name: "Soberania",
    type: "album",
    artist: "GENDEMA",
    artistId: "gendema_id",
    coverUrl: "/albums/soberania.jpg",
  },
  {
    id: "2",
    name: "Cyanotope of Blue",
    type: "album",
    artist: "Salami Rose Joe Louis",
    artistId: "salami_rose_joe_louis_id",
    coverUrl: "/albums/cyanotope.png",
  },
  {
    id: "3",
    name: "Melodrama",
    type: "album",
    artist: "Lorde",
    artistId: "lorde",
    coverUrl: "/albums/melodrama.png",
  },
  {
    id: "4",
    name: "As Small As Ants",
    type: "album",
    artist: "This is the Glasshouse",
    artistId: "this_is_the_glasshouse_id",
    coverUrl: "/albums/ants.png",
  },
  {
    id: "5",
    name: "Coat I Would Buy",
    type: "album",
    artist: "Joeyy",
    artistId: "joeyy_id",
    coverUrl: "/albums/coat.png",
  },
];

const mockArtist: Artist = {
  id: "lorde",
  name: "Lorde",
  imageUrl: "/artists/lorde.jpeg",
  albums: [
    {
      id: "3",
      name: "Melodrama",
      coverUrl: "/albums/melodrama.png",
      releaseDate: "2017-06-16",
    },
    {
      id: "7",
      name: "Pure Heroine",
      coverUrl: "/albums/pure-heroine.jpg",
      releaseDate: "2013-09-27",
    },
    {
      id: "8",
      name: "Solar Power",
      coverUrl: "/albums/solar-power.png",
      releaseDate: "2021-08-20",
    },
  ],
};

const AlbumSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const [recentSearches, setRecentSearches] =
    useState<RecentSearchItem[]>(mockRecentSearches);
  const [selectedItem, setSelectedItem] = useState<SearchItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resultType, setResultType] = useState<"Albums" | "Artists">("Albums");

  useEffect(() => {
    if (searchTerm) {
      const filteredAlbums: Album[] = mockRecentSearches
        .filter(
          (item) =>
            item.type === "album" &&
            (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.artist?.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .map((item) => ({
          id: item.id,
          name: item.name,
          artist: item.artist!,
          artistId: item.artistId!,
          coverUrl: item.coverUrl,
          releaseDate: "",
        }));

      const filteredArtists: Artist[] = [mockArtist].filter((artist) =>
        artist.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setSearchResults([...filteredAlbums, ...filteredArtists].slice(0, 20));
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const removeFromRecent = (id: string) => {
    setRecentSearches((prev) => prev.filter((item) => item.id !== id));
  };

  const addToRecentSearches = (item: Album | Artist) => {
    const recentItem: RecentSearchItem = {
      id: item.id,
      name: item.name,
      type: "albums" in item ? "artist" : "album",
      coverUrl: "albums" in item ? item.imageUrl : item.coverUrl,
      artist: "albums" in item ? undefined : item.artist,
      artistId: "albums" in item ? item.id : item.artistId,
    };
    setRecentSearches((prev) => [
      recentItem,
      ...prev.filter((a) => a.id !== recentItem.id),
    ]);
  };

  const handleItemClick = (item: SearchItem) => {
    setIsLoading(true);
    setTimeout(() => {
      setSelectedItem(item);
      setIsLoading(false);
      addToRecentSearches(item);
      setSearchTerm("");
    }, 365);
  };

  const handleArtistClick = (
    artistId: string,
    fromAlbumPage: boolean = false
  ) => {
    const artist = mockArtist.id === artistId ? mockArtist : null;
    if (artist) {
      if (!fromAlbumPage) {
        addToRecentSearches(artist);
      }
      handleItemClick(artist);
    }
  };

  const renderRecentItem = (item: RecentSearchItem) => (
    <div
      key={item.id}
      className="flex items-center justify-between mb-2 cursor-pointer select-none hover:bg-gray-800 p-2 rounded-md transition-colors duration-200"
      onClick={() => {
        if (item.type === "album") {
          handleItemClick({
            id: item.id,
            name: item.name,
            artist: item.artist!,
            artistId: item.artistId!,
            coverUrl: item.coverUrl,
            releaseDate: "",
          } as Album);
        } else {
          handleArtistClick(item.id);
        }
      }}
    >
      <div className="flex items-center space-x-2">
        <img
          src={item.coverUrl}
          alt={item.name}
          className={`w-12 h-12 ${
            item.type === "artist" ? "rounded-full" : "rounded"
          }`}
        />
        <div>
          <div className="font-bold">{item.name}</div>
          {item.type === "album" && (
            <div
              className="text-sm text-gray-400 hover:underline cursor-pointer inline-block"
              onClick={(e) => {
                e.stopPropagation();
                handleArtistClick(item.artistId!);
              }}
            >
              {item.artist}
            </div>
          )}
          {item.type === "artist" && (
            <div className="text-sm text-gray-400">Artist</div>
          )}
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          removeFromRecent(item.id);
        }}
        className="text-gray-400 hover:text-white cursor-pointer"
      >
        <X size={16} />
      </button>
    </div>
  );

  const renderAlbum = (album: Album) => (
    <div
      key={album.id}
      className="flex items-center justify-between mb-2 cursor-pointer select-none hover:bg-gray-800 p-2 rounded-md transition-colors duration-200"
      onClick={() => handleItemClick(album)}
    >
      <div className="flex items-center space-x-2">
        <img
          src={album.coverUrl}
          alt={album.name}
          className="w-12 h-12 rounded"
        />
        <div>
          <div className="font-bold">{album.name}</div>
          <div
            className="text-sm text-gray-400 hover:underline cursor-pointer inline-block"
            onClick={(e) => {
              e.stopPropagation();
              handleArtistClick(album.artistId);
            }}
          >
            {album.artist}
          </div>
        </div>
      </div>
    </div>
  );

  const renderArtist = (artist: Artist) => (
    <div
      key={artist.id}
      className="flex items-center mb-2 cursor-pointer select-none hover:bg-gray-800 p-2 rounded-md transition-colors duration-200"
      onClick={() => handleItemClick(artist)}
    >
      <img
        src={artist.imageUrl}
        alt={artist.name}
        className="w-12 h-12 rounded-full mr-2"
      />
      <div className="font-bold">{artist.name}</div>
    </div>
  );

  const handleGetColours = (album: Album) => {
    console.log(`Getting colors for album: ${album.name}`);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <LoaderCircle className="animate-spin text-blue-500" size={38} />
        </div>
      );
    }

    if (selectedItem) {
      return (
        <Result
          item={selectedItem}
          onBack={() => setSelectedItem(null)}
          onGetColours={handleGetColours}
          onAlbumClick={(album) => handleItemClick(album)}
          onArtistClick={(artistId) => handleArtistClick(artistId, true)}
        />
      );
    }

    return (
      <>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Find an Album or Artist..."
            className="w-full bg-gray-800 rounded-full py-2 pl-10 pr-4 text-white placeholder-gray-400"
          />
        </div>
        <div className="mb-4">
          <ul className="flex space-x-4 text-xl justify-center">
            <li
              className={`text-white font-bold cursor-pointer mr-[70px] ${
                resultType === "Albums" ? "border-b-2 border-blue-500" : ""
              }`}
              onClick={() => setResultType("Albums")}
            >
              Albums
            </li>
            <li
              className={`text-white font-bold cursor-pointer ml-[70px] ${
                resultType === "Artists" ? "border-b-2 border-blue-500" : ""
              }`}
              onClick={() => setResultType("Artists")}
            >
              Artists
            </li>
          </ul>
        </div>

        {searchTerm ? (
          <div className="space-y-2 overflow-y-auto flex-grow">
            {searchResults
              .filter(
                (item) =>
                  (resultType === "Albums" && !("albums" in item)) ||
                  (resultType === "Artists" && "albums" in item)
              )
              .map((item) =>
                "albums" in item ? renderArtist(item) : renderAlbum(item)
              )}
          </div>
        ) : (
          <div className="overflow-y-auto flex-grow">
            <div className="max-h-[calc(100%-2rem)] overflow-y-auto">
              {recentSearches.map((item) => renderRecentItem(item))}
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="bg-gray-900 text-white h-[36rem] w-[21.6rem] p-[20px] pb-0 select-none flex flex-col overflow-hidden">
      {renderContent()}
    </div>
  );
};

export default AlbumSearch;
