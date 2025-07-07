import React, { useState, useEffect } from 'react';
import './PokemonFetcher.css';

const traduccionesTipos = {
  normal: "Normal",
  fire: "Fuego",
  water: "Agua",
  electric: "Eléctrico",
  grass: "Planta",
  ice: "Hielo",
  fighting: "Lucha",
  poison: "Veneno",
  ground: "Tierra",
  flying: "Volador",
  psychic: "Psíquico",
  bug: "Bicho",
  rock: "Roca",
  ghost: "Fantasma",
  dark: "Siniestro",
  dragon: "Dragón",
  steel: "Acero",
  fairy: "Hada"
};

const PokemonFetcher = ({ busqueda, setOnBuscar }) => {
  const [pokemones, setPokemones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [pokemonEncontrado, setPokemonEncontrado] = useState(null);

  // Función para buscar un Pokémon específico por nombre
  const buscarPokemon = async () => {
    if (!busqueda) return;

    try {
      setCargando(true);
      setError(null);
      setPokemonEncontrado(null);

      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${busqueda.toLowerCase()}`);
      if (!response.ok) {
        throw new Error(`No se encontró ningún Pokémon llamado "${busqueda}"`);
      }

      const data = await response.json();
      const pokemon = {
        id: data.id,
        nombre: data.name,
        imagen: data.sprites.front_default,
        tipos: data.types.map(t => t.type.name),
      };
      setPokemonEncontrado(pokemon);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  // Permitir que App.jsx acceda a esta función mediante setOnBuscar
  useEffect(() => {
    setOnBuscar(() => buscarPokemon);
  }, [busqueda]);

  // Al montar el componente, obtener 10 Pokémon aleatorios
  useEffect(() => {
    const fetchPokemones = async () => {
      try {
        setCargando(true);
        setError(null);
        const fetchedPokemones = [];
        const pokemonIds = new Set(); // Usar un Set para asegurar IDs únicos

        // Generar 10 IDs de Pokémon únicos aleatorios
        while (pokemonIds.size < 10) {
          const randomId = Math.floor(Math.random() * 898) + 1;
          pokemonIds.add(randomId);
        }

        const idsArray = Array.from(pokemonIds);

        const responses = await Promise.all(
          idsArray.map(id =>
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`).then(res => res.json())
          )
        );

        for (const data of responses) {
          fetchedPokemones.push({
            id: data.id,
            nombre: data.name,
            imagen: data.sprites.front_default,
            tipos: data.types.map(typeInfo => typeInfo.type.name),
          });
        }

        setPokemones(fetchedPokemones);
      } catch (err) {
        setError('Error al cargar Pokémon aleatorios');
      } finally {
        setCargando(false);
      }
    };

    fetchPokemones();
  }, []);

  if (cargando) {
    return <div className="pokemon-container">Cargando Pokémon...</div>;
  }

  if (error) {
    return <div className="pokemon-container error">Error: {error}</div>;
  }

  return (
    <div className="pokemon-container">
      {/* Si se encuentra un Pokémon por búsqueda, mostrarlo */}
      {pokemonEncontrado && (
        <div className="pokemon-card encontrado">
          <h3>{pokemonEncontrado.nombre.charAt(0).toUpperCase() + pokemonEncontrado.nombre.slice(1)}</h3>
          <img src={pokemonEncontrado.imagen} alt={pokemonEncontrado.nombre} />
          <p>
            Tipo: {pokemonEncontrado.tipos.map(type => traduccionesTipos[type] || type).join(', ')}
          </p>
        </div>
      )}

      {/* Mostrar los aleatorios solo si NO hay resultado de búsqueda */}
      {!pokemonEncontrado && (
        <>
          <h2>Explora tu Pokédex</h2>
          <div className="pokemon-list">
            {pokemones.map(pokemon => (
              <div key={pokemon.id} className="pokemon-card">
                <h3>{pokemon.nombre.charAt(0).toUpperCase() + pokemon.nombre.slice(1)}</h3>
                <img src={pokemon.imagen} alt={pokemon.nombre} />
                <p>
                  Tipo: {pokemon.tipos.map(type => traduccionesTipos[type] || type).join(', ')}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PokemonFetcher;