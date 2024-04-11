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
  const { pokedex, setPokedex } = usePokedex();
  const [filteredPokedex, setFilteredPokedex] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // State to track current page
  const search = useLocation().search;
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const navigate = useNavigate();

  const fetchFilteredPokemonData = useCallback(async () => {
    const promiseArr = [];
    const resp = await axios.get(
      `https://pokeapi.co/api/v2/type/${params.get('type')}`
    );
    const pokemonData = resp.data.pokemon.map((p) => p.pokemon);
    const pokemonIds = pokemonData.map((p) => p.url.split('/')[6]);
    for (let i = 0; i < pokemonIds.length; i++) {
      if (pokemonIds[i] <= MAX_POKEMON_ID) {
        promiseArr.push(
          axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonIds[i]}`)
        );
      }
    }
    const pokemon = await Promise.all(promiseArr);
    return pokemon.map((p) => p.data);
  }, [params]);

  // Function to fetch Pokemon data for the current page
  const fetchPokemonData = useCallback(async (page) => {
    const startId = (page - 1) * pokemonsOnPage + 1;
    const endId = Math.min(startId + pokemonsOnPage - 1, MAX_POKEMON_ID);
    const promiseArr = [];
    for (let i = startId; i <= endId; i++) {
      promiseArr.push(axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`));
    }
    const resolvedData = await Promise.all(promiseArr);
    return resolvedData.map((data) => data.data);
  }, []);

  // Function to handle next page
  const handleNextPage = () => {
    setCurrentPage((prevPage) => {
      const nextPage = prevPage + 1;
      navigate(`?page=${nextPage}`);
      return nextPage;
    });
  };

  // Function to handle previous page
  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => {
      const previousPage = Math.max(prevPage - 1, 1);
      navigate(`?page=${previousPage}`);
      return previousPage;
    });
  };

  useEffect(() => {
    setLoading(true);
    const pageQueryParam = params.get('page');
    const pageNumber = pageQueryParam ? parseInt(pageQueryParam) : 1;
    setCurrentPage(pageNumber);

    fetchPokemonData(pageNumber).then((resp) => {
      setPokedex(resp);
      setFilteredPokedex(resp);
      setLoading(false);
    });
  }, [params, fetchPokemonData, setPokedex]);
  
  useEffect(() => {
    pokedex.length = 0;
    setLoading(true);
    if (!params.get('type')) {
      const fetchData = async () => {
        const resp = await fetchPokemonData();
        setPokedex(resp);
        setFilteredPokedex(resp);
        setLoading(false);
      };
      fetchData();
    } else if (params.get('type')) {
      const fetchData = async () => {
        const resp = await fetchFilteredPokemonData();
        setPokedex(resp);
        setFilteredPokedex(resp);
        setLoading(false);
      };
      fetchData();
    } else {
      setFilteredPokedex(pokedex);
      setLoading(false);
    }
  }, [params, fetchFilteredPokemonData]);

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
                  navigate('/pookiedex');
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
