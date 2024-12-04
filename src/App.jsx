import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dummyMovies, setDummyMovies] = useState([]);
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://swapi.dev/api/films/");
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const data = await response.json();

      const foramtedObject = data.results.map((data) => {
        return {
          id: data["episode_id"],
          title: data.title,
          releaseDate: data["release_date"],
          openingText: data["opening_crawl"],
        };
      });
      setDummyMovies(foramtedObject);
    } catch (err) {
      setError(err.message);
      console.log(err.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newData = {
      id: new Date(),
      title: e.target.title.value,
      openingText: e.target.openingText.value,
      releaseDate: e.target.releaseDate.value,
    };
    console.log(newData);
  };

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
        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input name="title" id="title" />
          <label>Opening Text</label>
          <textarea name="openingText"></textarea>
          <label>Release Date</label>
          <input name="releaseDate" />
          <button>Add Movies</button>
        </form>
      </section>
      <section>
        <button onClick={fetchData}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
