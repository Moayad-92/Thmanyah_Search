import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Layout from "@components/Layout";
import { SearchResult } from "@/types/search-result";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Home() {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (term.trim()) {
        handleSearch();
      } else {
        setResults([]);
        setError("");
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [term]);

  const handleSearch = async () => {
    if (!term.trim()) return;
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const res = await axios.get(`/api/search?term=${term}`);
      if (res.status !== 200) {
        throw new Error("فشل في جلب البيانات");
      }
      if (!res.data || !Array.isArray(res.data)) {
        throw new Error("البيانات غير صالحة");
      }
      const data = res.data;
      if (!data.length) setError("لا توجد نتائج مطابقة");
      setResults(data);
    } catch (err: any) {
      setError(err.message || "حدث خطأ غير متوقع");
    } finally {
      setTimeout(() => setLoading(false), 2000);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <Layout>
      <div className="text-white min-h-screen w-full">
        <div className="px-4 md:px-10 my-3">
          <input
            type="text"
            placeholder="Search through over 70 million podcasts and episodes..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="p-1 rounded-lg w-full bg-transparent ring-1 ring-gray-500 placeholder-gray-500 focus:outline-none focus:placeholder-transparent focus:ring-2 focus:ring-purple-500 text-sm text-center"
          />
        </div>

        {error && <div className="text-red-400 text-center my-24">{error}</div>}

        {loading && (
          <div className="flex justify-center items-center h-screen">
            <div className="relative w-16 h-16">
              <span className="absolute inset-0 rounded-full border-2 border-purple-500 opacity-80 animate-ping" />
              <span className="absolute inset-0 rounded-full border-2 border-purple-500 " />
            </div>
          </div>
        )}

        {!loading && !error && results.length == 0 && (
          <div className="text-center p-24 opacity-70 ">
            Type in a search term to start.
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            <div className="border-b border-gray-500 mt-16 mb-4 px-4 flex flex-row items-center justify-between">
              <h2 className="text-base mb-4">Top podcasts for {term}</h2>
              <div className="my-2">
                <button
                  onClick={() => scroll("left")}
                  className="text-gray-400 p-1 rounded-full hover:bg-black/20 transition"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => scroll("right")}
                  className="text-gray-400 p-1 rounded-full hover:bg-black/20 transition"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div
              ref={scrollRef}
              className="overflow-x-auto px-4 md:px-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-purple-500"
            >
              <div className="flex gap-4 sm:gap-6 pb-4">
                {results.map((item) => (
                  <div
                    key={item.collectionId + "-pod"}
                    className="flex-shrink-0 w-44"
                  >
                    <img
                      src={
                        item.artworkUrl600 ||
                        item.artworkUrl100 ||
                        ""
                      }
                      alt={item.collectionName}
                      className="w-44 h-44 object-cover"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <h3 className="text-xs font-semibold text-white truncate">
                        {item.collectionName}
                      </h3>
                      <button className="text-gray-300 hover:text-white text-lg">
                        ⋮
                      </button>
                    </div>
                    <p className="text-xs text-pink-400 truncate">
                      {item.artistName}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <div className="border-b border-gray-500 mt-16 mb-4 px-4">
                <h2 className="text-base mb-4">Top episodes for {term}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 px-4">
                {results.map((item) => (
                  <div
                    key={item.trackId + "-ep"}
                    className="flex items-center gap-4 p-3 rounded-xl bg-[#1e1f2f] hover:bg-[#2a2b3d] transition"
                  >
                    <img
                      src={
                        item.artworkUrl600 ||
                        item.artworkUrl100 ||
                        ""
                      }
                      alt={item.trackName || item.collectionName || "Podcast"}
                      className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h3 className="text-xs font-semibold text-white truncate">
                        {item.trackName || item.collectionName}
                      </h3>
                      <p className="text-xs mt-1 text-purple-400 truncate">
                        {item.artistName}
                      </p>
                    </div>
                    <div className="text-gray-400">
                      <button className="hover:text-white">
                        <span className="text-lg">⋮</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
