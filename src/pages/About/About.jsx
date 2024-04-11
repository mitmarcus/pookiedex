import React from "react";
import { Link } from "react-router-dom";
import Pokedex from "../../assets/pookiedex.png";
import "./About.css"; // Import the CSS file for styling

export default function About() {
  return (
    <div className="about-container"> {/* Container for the About section */}
      <div className="nav">
        <nav className="app__navbar text-pop-up-top">
          <Link to="/">
            <img src={Pokedex} alt="Pookiedex" className="Pookiedex-Logo" />
          </Link>
        </nav>
      </div>
      <div className="about-content"> {/* Content of the About section */}
        <h1>About the PookieDex</h1>
        <br />
        <p>
          This PookieDex was created as Assignment 2 for the WEB2 Course. Poookiedex was developed as a university project to serve as an interactive encyclopedia of Pokémon (pookies).
        </p>
        <p>
          It allows users to explore and learn about various Pokémon species, their characteristics, abilities, and other relevant information.
        </p>
        <br />
        <p>
          The pokemons' data is retrieved from the <a href="https://pokeapi.co/">https://pokeapi.co/</a>
        </p>
        <br />
        <p>
          Here are the requirements for the assignment: <a href="https://github.com/KasperKnop/WEB2/blob/main/08%20Assignment%202/README.md">https://github.com/KasperKnop/WEB2/blob/main/08%20Assignment%202/README.md</a>
        </p>
        <br />
        <br />
        <p>Thank you for using the PookieDex!</p>
      </div>
    </div>
  );
}
