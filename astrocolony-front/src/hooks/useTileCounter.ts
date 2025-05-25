import { useMemo, useState, useEffect } from 'react';

type Tile = [number, number];

interface FarmCluster {
  tiles: Tile[];
  type: string;
  name?: string;
}

interface TileCounterResult {
  totalTiles: number;
  savedTiles: number;
  pendingTiles: number;
  farmCounts: { [farmType: string]: number };
  clusters: FarmCluster[];
  isLoading: boolean;
}

interface TileCounterOptions {
  localStorageKey?: string;
  clusters?: FarmCluster[];
  pendingClusters?: Tile[][];
}

export function useTileCounter(options: TileCounterOptions = {}): TileCounterResult {
  const { localStorageKey, clusters: propClusters, pendingClusters = [] } = options;
  
  const [storageClusters, setStorageClusters] = useState<FarmCluster[]>([]);
  const [isLoading, setIsLoading] = useState(!!localStorageKey);

  // Pobierz dane z localStorage jeśli podano klucz
  useEffect(() => {
    if (!localStorageKey) {
      setIsLoading(false);
      return;
    }

    try {
      const saved = localStorage.getItem(localStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as FarmCluster[];
        setStorageClusters(parsed);
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      setStorageClusters([]);
    } finally {
      setIsLoading(false);
    }
  }, [localStorageKey]);

  // Wybierz źródło danych - props mają priorytet nad localStorage
  const clusters = propClusters || storageClusters;

  return useMemo(() => {
    // Zlicz kafelki z zapisanych farm
    const savedTiles = clusters.reduce((total, cluster) => total + cluster.tiles.length, 0);
    
    // Zlicz kafelki z oczekujących klastrów
    const pendingTiles = pendingClusters.reduce((total, cluster) => total + cluster.length, 0);
    
    // Zlicz kafelki według typu farmy
    const farmCounts = clusters.reduce((counts, cluster) => {
      const type = cluster.type;
      counts[type] = (counts[type] || 0) + cluster.tiles.length;
      return counts;
    }, {} as { [farmType: string]: number });
    
    // Całkowita liczba kafelków
    const totalTiles = savedTiles + pendingTiles;
    
    return {
      totalTiles,
      savedTiles,
      pendingTiles,
      farmCounts,
      clusters,
      isLoading
    };
  }, [clusters, pendingClusters, isLoading]);
}

// Wersja dla kompatybilności wstecznej
export function useTileCounterDirect(
  clusters: FarmCluster[],
  pendingClusters: Tile[][] = []
): TileCounterResult {
  return useTileCounter({ clusters, pendingClusters });
}