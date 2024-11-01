// src/CountryCatalog.js
import React, { useState, useEffect } from "react";
import Modal from "react-modal";

const CountryCatalog = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const countriesPerPage = 25;

  useEffect(() => {
    const fetchCountries = async () => {
      const response = await fetch("https://restcountries.com/v3.1/all");
      const data = await response.json();
      setCountries(data);
      setFilteredCountries(data);
    };
    fetchCountries();
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setFilteredCountries(
      countries.filter((country) =>
        country.name.official.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleSort = () => {
    const sortedCountries = [...filteredCountries].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.name.official.localeCompare(b.name.official);
      } else {
        return b.name.official.localeCompare(a.name.official);
      }
    });
    setFilteredCountries(sortedCountries);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const openModal = (country) => {
    setSelectedCountry(country);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedCountry(null);
  };

  const displayedCountries = filteredCountries.slice(
    (currentPage - 1) * countriesPerPage,
    currentPage * countriesPerPage
  );

  return (
    <div>
      <h1>Country Catalog</h1>
      <input
        type="text"
        placeholder="Search by country name"
        value={searchTerm}
        onChange={handleSearch}
      />
      <button onClick={handleSort}>
        Sort {sortOrder === "asc" ? "Descending" : "Ascending"}
      </button>
      <ul>
        {displayedCountries.map((country) => (
          <li key={country.cca3} onClick={() => openModal(country)}>
            <img
              src={country.flags.png}
              alt={`${country.name.official} flag`}
              width="30"
            />
            {country.name.official}
          </li>
        ))}
      </ul>
      <div>
        {Array.from(
          { length: Math.ceil(filteredCountries.length / countriesPerPage) },
          (_, index) => (
            <button key={index} onClick={() => handlePageChange(index + 1)}>
              {index + 1}
            </button>
          )
        )}
      </div>

      {selectedCountry && (
        <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
          <h2>{selectedCountry.name.official}</h2>
          <img
            src={selectedCountry.flags.png}
            alt={`${selectedCountry.name.official} flag`}
          />
          <p>2-letter code: {selectedCountry.cca2}</p>
          <p>3-letter code: {selectedCountry.cca3}</p>
          <p>Native Name: {JSON.stringify(selectedCountry.name.nativeName)}</p>
          <p>
            Alternative Names: {JSON.stringify(selectedCountry.altSpellings)}
          </p>
          <p>
            Calling Codes:{" "}
            {JSON.stringify(
              selectedCountry.idd?.root +
                (selectedCountry.idd?.suffixes?.join(", ") || "")
            )}
          </p>
          <button onClick={closeModal}>Close</button>
        </Modal>
      )}
    </div>
  );
};

export default CountryCatalog;
