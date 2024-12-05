import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

const URL = "https://movieapp-ed53d-default-rtdb.firebaseio.com/films.json";

function App() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dummyMovies, setDummyMovies] = useState([]);
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(URL);
      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const data = await response.json();
      const foramtedObject = [];
      for (let key in data) {
        foramtedObject.push({
          id: key,
          title: data[key].title,
          releaseDate: data[key].releaseDate,
          openingText: data[key].openingText,
        });
      }

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newData = {
      title: e.target.title.value,
      openingText: e.target.openingText.value,
      releaseDate: e.target.releaseDate.value,
    };

    try {
      setError(null);
      const response = await fetch(URL, {
        method: "POST",
        body: JSON.stringify(newData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      alert("data added succefully");
      fetchData();
    } catch (err) {
      setError(err.message);
      console.log(err);
    }
    e.target.reset();
  };

  const handleDelete = async (id) => {
    try {
      setError(null);
      const response = await fetch(
        `https://movieapp-ed53d-default-rtdb.firebaseio.com/films/${id}.json`,
        {
          method: "DELETE",
        }
      );
      fetchData();
    } catch (error) {
      setError(error.message);
      console.log(error);
    }
  };

  let content;
  if (!isLoading && !error && dummyMovies.length === 0) {
    content = <p>No Data Found</p>;
  }

  if (!isLoading && !error && dummyMovies.length > 0) {
    content = <MoviesList movies={dummyMovies} deleteMovie={handleDelete} />;
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
          <input name="title" id="title" required />
          <label>Opening Text</label>
          <textarea name="openingText" required></textarea>
          <label>Release Date</label>
          <input name="releaseDate" required />
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
