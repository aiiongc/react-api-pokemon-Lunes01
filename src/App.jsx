import React, { useState } from 'react';
import PokemonFetcher from './PokemonFetcher';
import Buscador from './Buscador';
import './App.css';

function App() {
  const [busqueda, setBusqueda] = useState('');
  const [onBuscar, setOnBuscar] = useState(() => () => {});

  return (
    <>
      <h1>¡Conoce a tus Pokemones!</h1>

      <Buscador
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        onBuscar={() => onBuscar()}
      />

      <PokemonFetcher
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        setOnBuscar={setOnBuscar}
      />
    </>
  );
}

export default App;