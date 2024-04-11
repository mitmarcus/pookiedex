import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PokeCard from '../../components/PokeCard';
import './Home.css';
import usePokedex from '../../stores/usePokedex';
import PokeLoading from '../../components/PokeLoading';
import { useLocation, Link } from 'react-router-dom';
import Close from '../../assets/close.png';
import { useNavigate } from 'react-router-dom';
import Pokedex from '../../assets/pookiedex.png';
import axios from 'axios';

const pokemonsOnPage = 24;
const MAX_POKEMON_ID = 898;

export default function Home() {
  const { setPokedex } = usePokedex();
  const [filteredPokedex, setFilteredPokedex] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // State to track current page
  const search = useLocation().search;
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const navigate = useNavigate();

  // Fetching filtered Pokemon data based on type
  const fetchFilteredPokemonData = useCallback(async () => {
    const resp = await axios.get(
      `https://pokeapi.co/api/v2/type/${params.get('type')}`
    );
    const pokemonData = resp.data.pokemon.map((p) => p.pokemon);
    const pokemonIds = pokemonData.map((p) => p.url.split('/')[6]);
    const filteredPokemonIds = pokemonIds.filter((id) => id <= MAX_POKEMON_ID);
    const promiseArr = filteredPokemonIds.map((id) =>
      axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
    );
    const pokemon = await Promise.all(promiseArr);
    return pokemon.map((p) => p.data);
  }, [params]);

  // Fetching Pokemon data for current page
  const fetchPokemonData = useCallback(async () => {
    const promiseArr = [];
    const startId = (currentPage - 1) * pokemonsOnPage + 1;
    const endId = Math.min(startId + pokemonsOnPage - 1, MAX_POKEMON_ID);
    for (let i = startId; i <= endId; i++) {
      promiseArr.push(axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`));
    }
    const resolvedData = await Promise.all(promiseArr);
    return resolvedData.map((data) => data.data);
  }, [currentPage]);

  // Effect to fetch Pokemon data based on query params or current page
  useEffect(() => {
    setLoading(true);
    if (!params.get('type')) {
      fetchPokemonData().then((resp) => {
        setPokedex(resp);
        setFilteredPokedex(resp);
        setLoading(false);
      });
    } else {
      fetchFilteredPokemonData().then((resp) => {
        setPokedex(resp);
        setFilteredPokedex(resp);
        setLoading(false);
      });
    }
  }, [currentPage, params, fetchFilteredPokemonData, fetchPokemonData, setPokedex]);

  // Function to handle next page
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // Function to handle previous page
  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <>
      {loading ? (
        <PokeLoading />
      ) : (
        <div className="Home">
          <Link to="/pookiedex">
            <img src={Pokedex} alt="Pookiedex" className="Pookiedex-Logo" />
          </Link>

          <Link to="/about" className="about-link">
            About
          </Link>

          {params.get('type') && (
            <p
              style={{ justifySelf: 'left' }}
              className={`Home-type ${params.get('type')}`}
            >
              {params.get('type')}
              <img
                className="close-icon"
                src={Close}
                alt="reset"
                onClick={() => {
                  navigate('/');
                }}
              />
            </p>
          )}

          <div className="PokeDex">
            {filteredPokedex.map((pokemon) => (
              <PokeCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>

          <div className="pagination-buttons">
            <button
              disabled={currentPage === 1}
              onClick={handlePreviousPage}
            >
              Previous
            </button>
            <button
              disabled={currentPage * pokemonsOnPage >= MAX_POKEMON_ID}
              onClick={handleNextPage}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}
