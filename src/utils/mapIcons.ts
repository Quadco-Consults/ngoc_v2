// Map icon configuration for different asset types
export const MAP_ICONS = [
  // Gas Plant icons
  {
    label: 'gas-plant',
    width: 60,
    height: 60,
    url: '/icons/flowstation.png',
  },
  {
    label: 'gas-plant-operational',
    width: 60,
    height: 60,
    url: '/icons/flowstation-active.png',
  },
  {
    label: 'gas-plant-maintenance',
    width: 60,
    height: 60,
    url: '/icons/flowstation-maintainance.png',
  },
  {
    label: 'gas-plant-offline',
    width: 60,
    height: 60,
    url: '/icons/flowstation-inactive.png',
  },

  // AGG Station icons (using manifold icons)
  {
    label: 'agg-station',
    width: 25,
    height: 25,
    url: '/icons/manifold.png',
  },
  {
    label: 'agg-station-operational',
    width: 25,
    height: 25,
    url: '/icons/manifold-active.png',
  },
  {
    label: 'agg-station-maintenance',
    width: 25,
    height: 25,
    url: '/icons/manifold-maintainance.png',
  },
  {
    label: 'agg-station-offline',
    width: 25,
    height: 25,
    url: '/icons/manifold-inactive.png',
  },

  // Power Station icons (using terminal icons)
  {
    label: 'power-station',
    width: 60,
    height: 60,
    url: '/icons/terminal.png',
  },
  {
    label: 'power-station-operational',
    width: 60,
    height: 60,
    url: '/icons/terminal-active.png',
  },
  {
    label: 'power-station-maintenance',
    width: 60,
    height: 60,
    url: '/icons/terminal-maintainance.png',
  },
  {
    label: 'power-station-offline',
    width: 60,
    height: 60,
    url: '/icons/terminal-inactive.png',
  },

  // LactPoint icons (can be used for measurement points)
  {
    label: 'lactpoint',
    width: 25,
    height: 25,
    url: '/icons/lactpoint.png',
  },
  {
    label: 'lactpoint-operational',
    width: 25,
    height: 25,
    url: '/icons/lactpoint-active.png',
  },
  {
    label: 'lactpoint-maintenance',
    width: 25,
    height: 25,
    url: '/icons/lactpoint-maintainance.png',
  },
  {
    label: 'lactpoint-offline',
    width: 25,
    height: 25,
    url: '/icons/lactpoint-inactive.png',
  },
];

// Helper function to load images onto Mapbox map
export const loadMapIcons = async (
  map: mapboxgl.Map,
  onProgress?: (loaded: number, total: number) => void
): Promise<boolean> => {
  let loadedCount = 0;
  let successCount = 0;
  const totalImages = MAP_ICONS.length;

  const promises = MAP_ICONS.map(
    (icon) =>
      new Promise<void>((resolve) => {
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
              map.addImage(icon.label, image as any, { pixelRatio: 2 });
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
  return successCount > 0;
};
