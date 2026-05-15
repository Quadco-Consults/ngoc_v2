import mapboxgl from 'mapbox-gl';

// Import all icon assets
import flowstationPng from '../assets/imgs/flowstation.png';
import flowstationActivePng from '../assets/imgs/flowstation-active.png';
import flowstationInactivePng from '../assets/imgs/flowstation-inactive.png';
import flowstationMaintainancePng from '../assets/imgs/flowstation-maintainance.png';

import terminalPng from '../assets/imgs/terminal.png';
import terminalActivePng from '../assets/imgs/terminal-active.png';
import terminalInactivePng from '../assets/imgs/terminal-inactive.png';
import terminalMaintainancePng from '../assets/imgs/terminal-maintainance.png';

import manifoldPng from '../assets/imgs/manifold.png';
import manifoldActivePng from '../assets/imgs/manifold-active.png';
import manifoldInactivePng from '../assets/imgs/manifold-inactive.png';
import manifoldMaintainancePng from '../assets/imgs/manifold-maintainance.png';

import lactpointPng from '../assets/imgs/lactpoint.png';
import lactpointActivePng from '../assets/imgs/lactpoint-active.png';
import lactpointInactivePng from '../assets/imgs/lactpoint-inactive.png';
import lactpointMaintainancePng from '../assets/imgs/lactpoint-maintainance.png';

// Map icon configuration
export const MAP_ICONS = [
  // Gas Plant icons (flowstation)
  {
    label: 'gas-plant',
    width: 60,
    height: 60,
    url: flowstationPng,
  },
  {
    label: 'gas-plant-operational',
    width: 60,
    height: 60,
    url: flowstationActivePng,
  },
  {
    label: 'gas-plant-maintenance',
    width: 60,
    height: 60,
    url: flowstationMaintainancePng,
  },
  {
    label: 'gas-plant-offline',
    width: 60,
    height: 60,
    url: flowstationInactivePng,
  },

  // AGG Station icons (manifold)
  {
    label: 'agg-station',
    width: 25,
    height: 25,
    url: manifoldPng,
  },
  {
    label: 'agg-station-operational',
    width: 25,
    height: 25,
    url: manifoldActivePng,
  },
  {
    label: 'agg-station-maintenance',
    width: 25,
    height: 25,
    url: manifoldMaintainancePng,
  },
  {
    label: 'agg-station-offline',
    width: 25,
    height: 25,
    url: manifoldInactivePng,
  },

  // Power Station icons (terminal)
  {
    label: 'power-station',
    width: 60,
    height: 60,
    url: terminalPng,
  },
  {
    label: 'power-station-operational',
    width: 60,
    height: 60,
    url: terminalActivePng,
  },
  {
    label: 'power-station-maintenance',
    width: 60,
    height: 60,
    url: terminalMaintainancePng,
  },
  {
    label: 'power-station-offline',
    width: 60,
    height: 60,
    url: terminalInactivePng,
  },

  // LactPoint icons
  {
    label: 'lactpoint',
    width: 25,
    height: 25,
    url: lactpointPng,
  },
  {
    label: 'lactpoint-operational',
    width: 25,
    height: 25,
    url: lactpointActivePng,
  },
  {
    label: 'lactpoint-maintenance',
    width: 25,
    height: 25,
    url: lactpointMaintainancePng,
  },
  {
    label: 'lactpoint-offline',
    width: 25,
    height: 25,
    url: lactpointInactivePng,
  },
];

// Helper function to load images onto Mapbox map
export const loadMapIcons = async (
  map: mapboxgl.Map,
  onProgress?: (loaded: number, total: number) => void
): Promise<boolean> => {
  let loadedCount = 0;
  let successCount = 0;
  const totalImages = MAP_ICONS.filter((img) => img.url).length;

  const promises = MAP_ICONS.map(
    (icon) =>
      new Promise<void>((resolve) => {
        if (!icon.url) {
          loadedCount++;
          resolve();
          return;
        }

        if (map.hasImage(icon.label)) {
          loadedCount++;
          successCount++;
          onProgress?.(loadedCount, totalImages);
          resolve();
          return;
        }

        map.loadImage(icon.url, (error, image) => {
          loadedCount++;

          if (error) {
            console.error(`Error loading image ${icon.label} from ${icon.url}:`, error);
            onProgress?.(loadedCount, totalImages);
            resolve();
            return;
          }

          if (!image) {
            console.error(`No image returned for ${icon.label} from ${icon.url}`);
            onProgress?.(loadedCount, totalImages);
            resolve();
            return;
          }

          try {
            if (!map.hasImage(icon.label)) {
              map.addImage(icon.label, image as any);
              successCount++;
              console.log(`Successfully loaded icon: ${icon.label}`);
            } else {
              successCount++;
            }
          } catch (e) {
            console.error(`Error adding image ${icon.label}:`, e);
          }

          onProgress?.(loadedCount, totalImages);
          resolve();
        });
      })
  );

  await Promise.all(promises);

  console.log(`Loaded ${successCount} out of ${totalImages} icons`);
  return successCount > 0;
};
