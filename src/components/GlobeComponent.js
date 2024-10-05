import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';

const GlobeComponent = () => {
  const globeEl = useRef();
  const moonRef = useRef();
  const [satellites, setSatellites] = useState([]);

  useEffect(() => {
    if (globeEl.current) {
      const globe = globeEl.current;
      globe.pointOfView({ altitude: 2.5 });

      const controls = globe.controls();
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.rotateSpeed = 1;
      controls.autoRotate = false;
      controls.minDistance = 101;
      controls.maxDistance = 300;

      globe.renderer().domElement.addEventListener('mousedown', () => {
        controls.autoRotate = false;
      });
      globe.renderer().domElement.addEventListener('mouseup', () => {
        controls.autoRotate = true;
      });

      // Adjust globe lighting
      const ambientLight = new THREE.AmbientLight(0x404040, 1);
      globe.scene().add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(1, 1, 1);
      globe.scene().add(directionalLight);

      createSatellites();
      
      // Only create the moon if it doesn't exist
      if (!moonRef.current) {
        createMoon(globe);
      }

      // Start the animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        updateMoonPosition();
        globe.renderer().render(globe.scene(), globe.camera());
      };
      animate();
    }
  }, []);

  const createSatellites = () => {
    const numSatellites = 100;
    const newSatellites = Array(numSatellites).fill().map(() => ({
      id: Math.random(),
      lat: (Math.random() - 0.5) * 180,
      lng: (Math.random() - 0.5) * 360,
      alt: 0.5 + Math.random() * 0.5,
      speed: 0.01 + Math.random() * 0.03,
      size: 0.75 + Math.random() * 0.75 // Increased base size to 0.75 and max to 1.5
    }));
    setSatellites(newSatellites);
    console.log('Satellites created:', newSatellites);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSatellites(prevSatellites => 
        prevSatellites.map(sat => ({
          ...sat,
          lng: (sat.lng + sat.speed) % 360
        }))
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const createSatelliteObject = (d) => {
    const satelliteGroup = new THREE.Group();
    const scale = d.size * 1.5; // Multiply by 1.5 to make them slightly bigger

    // Main body
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.2 * scale, 0.1 * scale, 0.1 * scale),
      new THREE.MeshPhongMaterial({ color: 0xcccccc })
    );
    satelliteGroup.add(body);

    // Solar panels
    const panel1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.3 * scale, 0.01 * scale, 0.1 * scale),
      new THREE.MeshPhongMaterial({ color: 0x2222ff })
    );
    panel1.position.x = 0.25 * scale;
    satelliteGroup.add(panel1);

    const panel2 = panel1.clone();
    panel2.position.x = -0.25 * scale;
    satelliteGroup.add(panel2);

    // Antenna
    const antenna = new THREE.Mesh(
      new THREE.CylinderGeometry(0.01 * scale, 0.01 * scale, 0.1 * scale),
      new THREE.MeshPhongMaterial({ color: 0xcccccc })
    );
    antenna.rotation.z = Math.PI / 2;
    antenna.position.y = 0.05 * scale;
    satelliteGroup.add(antenna);

    return satelliteGroup;
  };

  const createMoon = (globe) => {
    if (moonRef.current) return; // Prevent creating multiple moons

    // Get the actual globe radius
    const globeRadius = globe.getGlobeRadius();
    const moonRadius = globeRadius / 4; // Moon radius is exactly 1/4 of the globe's

    const moonGeometry = new THREE.SphereGeometry(moonRadius, 32, 32);
    const moonTexture = new THREE.TextureLoader().load(
      'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg'
    );
    
    // Adjust the material properties to make the moon darker
    const moonMaterial = new THREE.MeshPhongMaterial({
      map: moonTexture,
      color: 0x888888, // Darker base color
      emissive: 0x000000, // No self-illumination
      specular: 0x000000, // No specular highlights
      shininess: 0,
      bumpMap: moonTexture,
      bumpScale: 0.002,
    });

    const moon = new THREE.Mesh(moonGeometry, moonMaterial);

    // Initial position (will be updated in updateMoonPosition)
    moon.position.set(globeRadius * 6, 0, 0);
    
    globe.scene().add(moon);
    moonRef.current = moon;
    console.log('Moon created and added to scene, globe radius:', globeRadius, 'moon radius:', moonRadius);
  };

  const updateMoonPosition = () => {
    if (moonRef.current && globeEl.current) {
      const globeRadius = globeEl.current.getGlobeRadius();
      const time = Date.now() * 0.001; // Current time in seconds
      const radius = globeRadius * 6; // Orbit radius
      const speed = 0.03; // Orbit speed

      // Calculate new position
      const x = Math.cos(time * speed) * radius;
      const z = Math.sin(time * speed) * radius;

      moonRef.current.position.set(x, 0, z);

      // Make the moon face the Earth
      moonRef.current.lookAt(0, 0, 0);

      // Rotate the moon around its y-axis to show the same face to Earth
      moonRef.current.rotateY(Math.PI);
    }
  };

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundColor="rgba(0,0,0,0)"
        width={window.innerWidth}
        height={window.innerHeight}
        enablePointerInteraction={true}
        customLayerData={satellites}
        customThreeObject={createSatelliteObject}
        customThreeObjectUpdate={(obj, d) => {
          if (globeEl.current) {
            const { x, y, z } = globeEl.current.getCoords(d.lat, d.lng, d.alt);
            obj.position.set(x, y, z);
            obj.lookAt(0, 0, 0);
            obj.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
          }
        }}
      />
    </div>
  );
};

export default GlobeComponent;
