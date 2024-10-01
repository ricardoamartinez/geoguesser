import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function Globe() {
  const mountRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    // ... existing setup code ...

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.enableZoom = true;  // Ensure zoom is enabled
    controls.enablePan = true;   // Ensure panning is enabled

    let spinningSpeed = 0;

    const animate = () => {
      requestAnimationFrame(animate);
      
      if (isSpinning) {
        earth.rotation.y += spinningSpeed;
        spinningSpeed *= 0.99; // Gradually slow down
        if (Math.abs(spinningSpeed) < 0.001) {
          setIsSpinning(false);
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleMouseDown = () => {
      setIsSpinning(false);
    };

    const handleMouseUp = (event) => {
      if (event.button === 0) { // Left mouse button
        spinningSpeed = controls.getAzimuthalAngle() - controls.getAzimuthalAngle();
        setIsSpinning(true);
      }
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);

    // ... existing cleanup code ...
    return () => {
      // ... existing cleanup code ...
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      renderer.domElement.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isSpinning]);

  return (
    <div 
      ref={mountRef} 
      style={{ 
        width: '100%', 
        height: '100%', 
        position: 'absolute', 
        top: 0, 
        left: 0,
        zIndex: 20,
        pointerEvents: 'auto' // Add this line
      }} 
    />
  );
}

export default Globe;