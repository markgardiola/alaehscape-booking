import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import WaveDivider from "@/components/WaveDivider";
import laiyaImg from "/images/san-juan-batangas.jpg";
import calataganImg from "/images/Stilts-Calatagan-Batangas.jpg";
import mabiniImg from "/images/anilao.jpg";
import lianImg from "/images/lian-batangas.jpg";
import loboImg from "/images/loboImg.jpg";
import nasugbuImg from "/images/nasugbuImg.jpg";

const defaultDestinations = [
  {
    name: "San Vicente, Sto. Tomas City",
    path: "/destinations/san-juan-laiya",
    caption:
      "Famous for its white sand beaches and clear waters, perfect for summer getaways.",
    image: laiyaImg,
  },
  {
    name: "Calatagan, Batangas",
    path: "/destinations/calatagan",
    caption: "Home to serene beaches, sandbars, and the popular Stilts resort.",
    image: calataganImg,
  },
  {
    name: "Mabini, Batangas",
    path: "/destinations/mabini",
    caption:
      "A diver's paradise, known for Anilao's vibrant marine life and reefs.",
    image: mabiniImg,
  },
  {
    name: "Lian, Batangas",
    path: "/destinations/lian",
    caption: "Relaxing beach spot with peaceful vibes and sunset views.",
    image: lianImg,
  },
  {
    name: "Lobo, Batangas",
    path: "/destinations/lobo",
    caption: "Chill vibes and coastal views — Lobo, Batangas.",
    image: loboImg,
  },
  {
    name: "Nasugbu, Batangas",
    path: "/destinations/nasugbu",
    caption: "Sun, sea, and serenity — Nasugbu, Batangas.",
    image: nasugbuImg,
  },
];

const Destinations = ({ searchTerm }) => {
  const [filteredDestinations, setFilteredDestinations] =
    useState(defaultDestinations);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const filtered = searchTerm
      ? defaultDestinations.filter((dest) =>
          dest.name.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : defaultDestinations;
    setFilteredDestinations(filtered);
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredDestinations.length / itemsPerPage);
  const paginated = filteredDestinations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const [featured, ...rest] = paginated;

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-lagoon-dark">
          {searchTerm ? "Search results" : "Where to next"}
        </p>
        <h2 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">
          {searchTerm
            ? `"${searchTerm}"`
            : "Top beach destinations in Batangas"}
        </h2>
      </div>

      {paginated.length > 0 ? (
        <>
          {/* Featured destination - wide editorial card */}
          <Link
            to={featured.path}
            className="group mb-8 grid overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm transition-shadow hover:shadow-md sm:grid-cols-2"
          >
            <div className="h-56 overflow-hidden sm:h-full">
              <img
                src={featured.image}
                alt={featured.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col justify-center p-8">
              <h3 className="font-display text-3xl font-semibold text-ink">
                {featured.name}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-ink/70">
                {featured.caption}
              </p>
              <span className="mt-5 inline-flex w-fit items-center gap-1.5 text-base font-medium text-lagoon-dark">
                Explore area
                <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>

          {/* Rest - compact grid */}
          {rest.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-3">
              {rest.map((dest) => (
                <Link
                  key={dest.path}
                  to={dest.path}
                  className="group overflow-hidden rounded-xl border border-ink/10 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="h-36 overflow-hidden">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-lg font-semibold text-ink">
                      {dest.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-ink/60">
                      {dest.caption}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-ink/60">
          No destinations found for "{searchTerm}".
        </p>
      )}

      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-full p-2 text-ink/60 transition-colors hover:bg-sand disabled:pointer-events-none disabled:opacity-30"
            aria-label="Previous page"
          >
            <ChevronLeft className="size-4" />
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={cn(
                "size-8 rounded-full text-sm transition-colors",
                currentPage === i + 1
                  ? "bg-lagoon text-sand-light"
                  : "text-ink/60 hover:bg-sand",
              )}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="rounded-full p-2 text-ink/60 transition-colors hover:bg-sand disabled:pointer-events-none disabled:opacity-30"
            aria-label="Next page"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}

      <WaveDivider className="mx-auto mt-16 h-6 w-full max-w-3xl opacity-20" />
    </section>
  );
};

export default Destinations;
