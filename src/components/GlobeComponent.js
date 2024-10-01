import React from 'react';
import Globe from 'react-globe.gl';

const GlobeComponent = () => {
  return (
    <Globe
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
      bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
      backgroundColor="rgba(0,0,0,0)"
      width={window.innerWidth}
      height={window.innerHeight}
    />
  );
};

export default GlobeComponent;
