import React, { useState, useEffect } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dummyMovies, setDummyMovies] = useState([]);
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("https://swapi.dev/api/films/");
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const res = response.json();
      console.log(res);
      const foramtedObject = {
        id: res.data["episode_id"],
        title: res.data.title,
        releaseDate: res.data["release_date"],
        openingText: res.data["opening_crawl"],
      };
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  let content;
  if (!isLoading && !error && dummyMovies.length > 0) {
    content = <MoviesList movies={dummyMovies} />;
  }
  if (isLoading) {
    content = <p>Loading....</p>;
  }

  if (error) {
    content = <p>{error}</p>;
  }
  return (
    <React.Fragment>
      <section>
        <button onClick={fetchData}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
