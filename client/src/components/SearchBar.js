import React, { useState, useEffect } from 'react';

const SearchBar = ({ socket, setSearchResults })  => {
  const [userQuery, setUserQuery] = useState("");

  const Search = (event) => {
    event.preventDefault();
    socket.emit('search', { query: userQuery });
  };

  const getData = (event) => {
    setUserQuery(event.target.value);
  };

  useEffect(() => {
    socket.on('searchResults', (response) => {
      console.log("search results:", response.songs);
      setSearchResults(response.songs);
    });

    return () => {
      socket.off('searchResults');
    };
  }, [socket, setSearchResults]);

  return (
    <> 
      <form className="d-flex" role="search" onSubmit={Search}>
        <input className="form-control me-2" type="search" placeholder="Search" onChange={getData} aria-label="Search" />
        <button className="btn btn-outline-success" type="submit">Search</button>
      </form>
    </>
  );
};

export default SearchBar