import React, { useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';

const GlobeComponent = () => {
  const globeEl = useRef();

  useEffect(() => {
    if (globeEl.current) {
      const globe = globeEl.current;
      
      // Wait for the globe to initialize
      globe.pointOfView({ altitude: 4 }, 0);
      
      setTimeout(() => {
        const controls = globe.controls();
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.rotateSpeed = 1;
        controls.autoRotate = false;
        controls.minDistance = 101;
        controls.maxDistance = 300;
        
        // Modify the update method of controls
        const originalUpdate = controls.update;
        controls.update = function() {
          originalUpdate.call(this);
          if (!this.autoRotate) {
            this.autoRotateSpeed = this.getAzimuthalAngle() * 0.9;
          }
        };

        // Add event listeners
        globe.renderer().domElement.addEventListener('mousedown', () => {
          controls.autoRotate = false;
        });
        globe.renderer().domElement.addEventListener('mouseup', () => {
          controls.autoRotate = true;
        });
      }, 100);
    }
  }, []);

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
      />
    </div>
  );
};

export default GlobeComponent;
