import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import { ShaderMaterial } from 'three';

const GlobeComponent = () => {
  const globeEl = useRef();
  const moonRef = useRef();
  const [satellites, setSatellites] = useState([]);
  const sunLightRef = useRef();
  const globeMaterialRef = useRef();
  const CLOUD_ALTITUDE = 0.02; // Increased from 0.015
  const CLOUD_ROTATION_SPEED = 0.0003; // Reduced for slower rotation

  // Add this state to control cloud visibility
  const [showClouds, setShowClouds] = useState(false);

  // Replace useState with useRef for cloudsMesh
  const cloudsMeshRef = useRef(null);

  // Moved animateRef inside the GlobeComponent to ensure it's scoped correctly
  const animateRef = useRef(false);

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

      // Remove existing lights
      globe.scene().remove(...globe.scene().children.filter(child => child instanceof THREE.Light));

      // Add realistic lighting
      // Soft ambient light
      const ambientLight = new THREE.AmbientLight(0x404040, 0.2);
      globe.scene().add(ambientLight);

      // Main directional light (sun)
      const sunLight = new THREE.DirectionalLight(0xffffff, 12); // Increased intensity
      sunLight.position.set(1, 0.5, 1).normalize();
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = 4096; // Increased resolution
      sunLight.shadow.mapSize.height = 4096; // Increased resolution
      sunLight.shadow.camera.near = 1;
      sunLight.shadow.camera.far = 1500;
      sunLight.shadow.camera.left = -200;
      sunLight.shadow.camera.right = 200;
      sunLight.shadow.camera.top = 200;
      sunLight.shadow.camera.bottom = -200;
      sunLight.shadow.bias = -0.00001; // Further reduced to minimize shadow acne
      sunLight.shadow.radius = 0; // Sharpest shadows
      sunLight.shadow.blurSamples = 0; // Disable blur for sharpest possible shadows
      globe.scene().add(sunLight);
      sunLightRef.current = sunLight;

      // Enable shadows for the globe
      const globeMesh = globe.scene().children.find(child => child.type === 'Mesh');
      if (globeMesh) {
        globeMesh.castShadow = true;
        globeMesh.receiveShadow = true;
      }

      // Adjust the renderer settings
      globe.renderer().shadowMap.enabled = true;
      globe.renderer().shadowMap.type = THREE.BasicShadowMap; // Sharpest shadows, but may cause aliasing

      // Subtle blue atmospheric light
      const atmosphereLight = new THREE.HemisphereLight(0x7eb6ff, 0x000000, 0.3);
      globe.scene().add(atmosphereLight);

      // Remove or reduce the intensity of the fill light
      // const fillLight = new THREE.DirectionalLight(0xffffff, 0.1); // Reduced intensity
      // fillLight.position.set(-1, 0.5, -1);
      // globe.scene().add(fillLight);

      // Create custom shader material for the globe
      const globeMaterial = createGlobeMaterial();
      globeMaterialRef.current = globeMaterial;

      // Apply the custom material to the globe
      if (globeMesh) {
        globeMesh.material = globeMaterial;
      }

      createSatellites();
      
      // Only create the moon if it doesn't exist
      if (!moonRef.current) {
        createMoon(globe);
      }

      // Add clouds using useRef
      if (!cloudsMeshRef.current) {
        const globeRadius = globe.getGlobeRadius();
        const geometry = new THREE.SphereGeometry(globeRadius * (1 + CLOUD_ALTITUDE), 75, 75);
        const material = createCloudsMaterial();
        const clouds = new THREE.Mesh(geometry, material);
        clouds.renderOrder = 1;
        cloudsMeshRef.current = clouds;
        globe.scene().add(clouds);
        console.log('Clouds added to the scene', clouds);
        setShowClouds(true);
      }

      // Prevent multiple animate loops
      if (!animateRef.current) {
        animateRef.current = true;

        const animate = () => {
          requestAnimationFrame(animate);
          updateMoonPosition();
          updateSunPosition();
          
          if (globeMesh) {
            globeMesh.rotation.y += 0.001; // Added rotation for the globe
          }
          
          if (cloudsMeshRef.current) {
            if (!globe.scene().children.includes(cloudsMeshRef.current)) {
              console.log('Clouds not in scene, re-adding');
              globe.scene().add(cloudsMeshRef.current);
            }
            cloudsMeshRef.current.rotation.y += CLOUD_ROTATION_SPEED;
            console.log('Cloud rotation:', cloudsMeshRef.current.rotation.y);
          }
          
          globe.renderer().render(globe.scene(), globe.camera());
        };
        animate();
      }
    }
  }, []); // Changed dependency array from [cloudsMesh] to []

  const createSatellites = () => {
    const numSatellites = 100;
    const newSatellites = Array(numSatellites).fill().map(() => ({
      id: Math.random(),
      lat: (Math.random() - 0.5) * 180,
      lng: (Math.random() - 0.5) * 360,
      alt: 0.1 + Math.random() * 0.1, // Reduced altitude range
      speed: 0.01 + Math.random() * 0.02, // Slightly reduced speed variance
      size: 0.5 + Math.random() * 0.5 // Reduced size range
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
    const scale = d.size * 1.5;

    // Main body
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.2 * scale, 0.1 * scale, 0.1 * scale),
      new THREE.MeshPhongMaterial({ color: 0xcccccc })
    );
    body.castShadow = true;
    body.receiveShadow = true;
    satelliteGroup.add(body);

    // Solar panels
    const panel1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.3 * scale, 0.01 * scale, 0.1 * scale),
      new THREE.MeshPhongMaterial({ color: 0x2222ff })
    );
    panel1.castShadow = true;
    panel1.receiveShadow = true;
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
    antenna.castShadow = true;
    antenna.receiveShadow = true;
    antenna.rotation.z = Math.PI / 2;
    antenna.position.y = 0.05 * scale;
    satelliteGroup.add(antenna);

    // Increase the shadow casting distance for satellites
    satelliteGroup.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
        object.material.shadowSide = THREE.DoubleSide;
      }
    });

    return satelliteGroup;
  };

  const createMoon = (globe) => {
    if (moonRef.current) return;

    const globeRadius = globe.getGlobeRadius();
    const moonRadius = globeRadius / 4;

    const moonGeometry = new THREE.SphereGeometry(moonRadius, 32, 32);
    const moonTexture = new TextureLoader().load(
      'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg'
    );
    
    const moonMaterial = new THREE.MeshPhongMaterial({
      map: moonTexture,
      color: 0x111111,  // Darkened the base color
      emissive: 0x000000,  // Removed emissive color
      specular: 0x111111,  // Reduced specular highlight
      shininess: 2,  // Reduced shininess
      bumpMap: moonTexture,
      bumpScale: 0.001,  // Reduced bump scale
    });

    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.castShadow = true;
    moon.receiveShadow = true;

    moon.position.set(globeRadius * 6, 0, 0);
    
    globe.scene().add(moon);
    moonRef.current = moon;
  };

  const updateMoonPosition = () => {
    if (moonRef.current && globeEl.current && sunLightRef.current) {
      const globeRadius = globeEl.current.getGlobeRadius();
      const time = Date.now() * 0.001;
      const radius = globeRadius * 5;  // Reduced orbit radius for closer moon
      const speed = 0.03;

      const x = Math.cos(time * speed) * radius;
      const z = Math.sin(time * speed) * radius;

      moonRef.current.position.set(x, 0, z);
      moonRef.current.lookAt(0, 0, 0);
      moonRef.current.rotateY(Math.PI);

      // Removed the moon phase calculation and emissive color update
    }
  };

  const updateSunPosition = () => {
    if (sunLightRef.current && globeMaterialRef.current) {
      const time = Date.now() * 0.00005; // Increased speed for faster sun movement
      const radius = 400; // Increased radius for more dramatic shadows
      const x = Math.cos(time) * radius;
      const y = Math.sin(time * 0.5) * radius; // Added variation in Y-axis for tilt
      const z = Math.sin(time) * radius;

      sunLightRef.current.position.set(x, y, z);
      sunLightRef.current.lookAt(0, 0, 0);

      // Update shadow camera to follow sun
      sunLightRef.current.shadow.camera.updateProjectionMatrix();

      // Update the sun position in the globe shader
      globeMaterialRef.current.uniforms.sunPosition.value.set(x, y, z);
    }
  };

  const createGlobeMaterial = () => {
    const globeTexture = new THREE.TextureLoader().load('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg');
    const bumpTexture = new THREE.TextureLoader().load('//unpkg.com/three-globe/example/img/earth-topology.png');

    return new ShaderMaterial({
      uniforms: {
        globeTexture: { value: globeTexture },
        bumpTexture: { value: bumpTexture },
        sunPosition: { value: new THREE.Vector3(0, 0, 1) },
        bumpScale: { value: 0.15 }, // Increased bump scale
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D globeTexture;
        uniform sampler2D bumpTexture;
        uniform vec3 sunPosition;
        uniform float bumpScale;

        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          vec3 lightDir = normalize(sunPosition - vPosition);
          
          // Apply bump mapping
          vec3 bumpNormal = vNormal;
          vec2 dSTdx = dFdx(vUv);
          vec2 dSTdy = dFdy(vUv);
          float bumpValue = texture2D(bumpTexture, vUv).r;
          float dBx = texture2D(bumpTexture, vUv + dSTdx).r - bumpValue;
          float dBy = texture2D(bumpTexture, vUv + dSTdy).r - bumpValue;
          vec3 bumpVector = vec3(dBx, dBy, 0.0);
          bumpNormal = normalize(bumpNormal - bumpScale * bumpVector);

          float diff = max(dot(bumpNormal, lightDir), 0.0);
          
          // Increase contrast of diffuse lighting
          diff = smoothstep(0.2, 0.95, diff); // Adjusted for higher contrast
          
          vec3 diffuse = diff * vec3(1.0);

          vec3 texColor = texture2D(globeTexture, vUv).rgb;

          // Reduce ambient light for darker nights
          vec3 ambient = texColor * 0.03; // Reduced ambient for darker nights
          
          // Increase intensity of lit areas
          vec3 litColor = texColor * (diffuse * 2.0 + ambient); // Increased lighting intensity

          // Make night areas significantly darker and bluer
          float nightIntensity = 1.0 - diff;
          vec3 nightColor = vec3(0.01, 0.01, 0.05) * nightIntensity; // Darker night color

          // Add a more pronounced blue atmosphere effect
          vec3 atmosphere = vec3(0.15, 0.15, 0.4) * pow(1.0 - diff, 8.0); // Enhanced atmosphere

          // Blend day and night colors
          vec3 finalColor = mix(nightColor, litColor, diff) + atmosphere;

          // Enhance contrast further
          finalColor = pow(finalColor, vec3(1.3)); // Increased contrast

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });
  };

  // Add this function to create the clouds material
  const createCloudsMaterial = () => {
    const cloudTexture = new TextureLoader().load(
      'https://raw.githubusercontent.com/turban/webgl-earth/master/images/fair_clouds_4k.png',
      () => console.log('Cloud texture loaded successfully'),
      undefined,
      (error) => console.error('Error loading cloud texture:', error)
    );

    return new ShaderMaterial({
      uniforms: {
        cloudTexture: { value: cloudTexture },
        fresnelColor: { value: new THREE.Color(0xffffff) },
        fresnelPower: { value: 2 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewDir;
        
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewDir = normalize(-mvPosition.xyz);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D cloudTexture;
        uniform vec3 fresnelColor;
        uniform float fresnelPower;
        
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewDir;
        
        void main() {
          vec4 cloudColor = texture2D(cloudTexture, vUv);
          float fresnel = pow(1.0 - dot(vNormal, vViewDir), fresnelPower);
          vec3 finalColor = mix(cloudColor.rgb, fresnelColor, fresnel);
          gl_FragColor = vec4(finalColor, cloudColor.a * 0.8); // Increased from 0.7
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  };

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        cloudsImageUrl={null} // Set this to null to remove the default still clouds
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