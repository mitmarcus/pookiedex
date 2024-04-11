import React, { useState } from 'react';
import './PokeCard.css';
import { Link } from 'react-router-dom';

// Utility function for mapping values
function mapRange(value, in_min, in_max, out_min, out_max) {
  return ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}

const pokemonGifUrl = (name, id) => {
  if (id <= 649) {
    return `https://img.pokemondb.net/sprites/black-white/anim/normal/${name}.gif`;
  }
};

const pokemonSpriteUrl = (name) =>
  `https://img.pokemondb.net/sprites/bank/normal/${name}.png`;
// `https://img.pokemondb.net/sprites/black-white/normal/${name}.png`;

export default function PokeCard(props) {
  const { name, types, id } = props.pokemon;
  const [topOffset, setTopOffset] = useState(0);

  const onImgLoad = ({ target: img }) => {
    const { height } = img;
    const offset = mapRange(height, 0, 65, 0, 32);
    setTopOffset(offset);
  };

  return (
    <Link to={`/pokemon/${id}`}>
      <div className="PokeCard">
        <img
          onLoad={onImgLoad}
          className="PokeCard-image"
          src={pokemonGifUrl(name, id) || pokemonSpriteUrl(name, id)}
          alt={name}
          style={{ top: `-${topOffset}px`, imageRendering: 'pixelated' }}
        />
        {/* Display the number */}
        <p className="PokeCard-number">N&deg;{id}</p>
        {/* Display the name */}
        <p className="PokeCard-name">{name}</p>
        {/* Display the type */}
        <div className="PokeCard-types">
          {types.map((type) => (
            <Link to={`/pookiedex/?type=${type.type.name}`} key={type.type.name}>
              <p
                className={`PokeCard-type ${type.type.name}`}
                key={type.type.name}
              >
                {type.type.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </Link>
  );
}
