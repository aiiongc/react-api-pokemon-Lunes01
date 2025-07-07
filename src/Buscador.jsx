import React from 'react';
import './Buscador.css'; // Opcional si usas estilos propios

const Buscador = ({ busqueda, setBusqueda, onBuscar }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onBuscar();
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Buscar Pokémon por nombre"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button onClick={onBuscar}>Buscar</button>
    </div>
  );
};

export default Buscador;