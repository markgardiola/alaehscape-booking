import React, { useState } from "react";
import Hero from "@/components/Hero";
import Search from "./Search";
import Destinations from "./Destinations";
import Footer from "@/components/Footer";

function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="bg-sand-light">
      <Hero />
      <Search onSearch={setSearchTerm} />
      <Destinations searchTerm={searchTerm} />
      <Footer />
    </div>
  );
}

export default Home;
