import { MapContainer, TileLayer, useMap, Rectangle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState, useRef, useEffect, use } from "react";

// Import komponentów ShadCN Dialog
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const GRID_SIZE = 0.1;
type Tile = [number, number];

// (Tutaj wklej swoje funkcje areTilesEqual, getAdjacentTiles, findCluster, getColorForType, ColoredOverlay, InteractiveGrid, ZoomListener jak w Twoim oryginalnym kodzie)

function areTilesEqual(a: Tile, b: Tile) {
  return a[0] === b[0] && a[1] === b[1];
}
function getAdjacentTiles(tile: Tile): Tile[] {
  const [lat, lng] = tile;
  // Zaokrąglamy do np. 6 miejsc po przecinku, aby uniknąć błędów float
  const round = (num: number) => parseFloat(num.toFixed(6));
  
  return [
    [round(lat - GRID_SIZE), round(lng - GRID_SIZE)], // SW
    [round(lat - GRID_SIZE), round(lng)],             // S
    [round(lat - GRID_SIZE), round(lng + GRID_SIZE)], // SE
    [round(lat), round(lng - GRID_SIZE)],             // W
    [round(lat), round(lng + GRID_SIZE)],             // E
    [round(lat + GRID_SIZE), round(lng - GRID_SIZE)], // NW
    [round(lat + GRID_SIZE), round(lng)],             // N
    [round(lat + GRID_SIZE), round(lng + GRID_SIZE)], // NE
  ];
}

function findCluster(tile: Tile, tiles: Tile[]): Tile[] {
  const visited = new Set<string>();
  const cluster: Tile[] = [];
  const queue: Tile[] = [tile];
  while (queue.length > 0) {
    const current = queue.pop()!;
    const key = `${current[0]},${current[1]}`;
    if (visited.has(key)) continue;
    visited.add(key);
    cluster.push(current);
    for (const adj of getAdjacentTiles(current)) {
      if (
        tiles.some((t) => areTilesEqual(t, adj)) &&
        !visited.has(`${adj[0]},${adj[1]}`)
      ) {
        queue.push(adj);
      }
    }
  }
  return cluster;
}
function getColorForType(type: string): string {
  switch (type) {
    case "Carrots":
      return "orange";
    case "Potatoes":
      return "saddlebrown";
    default:
      return "green";
  }
}
function ColoredOverlay({
  clusters,
  pendingClusters,
}: {
  clusters: { tiles: Tile[]; type: string }[];
  pendingClusters?: Tile[][];
}) {
  return (
    <>
      {clusters.flatMap(({ tiles, type }) =>
        tiles.map(([lat, lng]) => (
          <Rectangle
            key={`rect_${lat}_${lng}_${type}`}
            bounds={[
              [lat, lng],
              [lat + GRID_SIZE, lng + GRID_SIZE],
            ]}
            pathOptions={{
              color: getColorForType(type),
              weight: 1,
              fillOpacity: 0.5,
            }}
          />
        ))
      )}
      {pendingClusters?.flatMap((tiles, idx) =>
        tiles.map(([lat, lng]) => (
          <Rectangle
            key={`pending_${idx}_${lat}_${lng}`}
            bounds={[
              [lat, lng],
              [lat + GRID_SIZE, lng + GRID_SIZE],
            ]}
            pathOptions={{
              color: "red",
              weight: 1,
              fillOpacity: 0.2,
              dashArray: "4",
            }}
          />
        ))
      )}
    </>
  );
}
function InteractiveGrid({
  clusters,
  setClusters,
  onClusterAdd,
}: {
  clusters: { tiles: Tile[]; type: string }[];
  setClusters: React.Dispatch<
    React.SetStateAction<{ tiles: Tile[]; type: string }[]>
  >;
  onClusterAdd: (cluster: Tile[]) => void;
}) {
  // Zbierz kafelki sąsiadujące do wszystkich zaznaczonych klastrów
  const adjacentToClusters = clusters.flatMap(({ tiles }) =>
    tiles.flatMap((tile) => getAdjacentTiles(tile))
  );

  // Funkcja sprawdzająca czy dany tile jest sąsiadem istniejących farm
  function isAdjacentToCluster(tile: Tile) {
    return adjacentToClusters.some((adj) => areTilesEqual(adj, tile));
  }

  const map = useMap();
  const [visibleTiles, setVisibleTiles] = useState<Tile[]>([]);

  const allSelectedTiles = clusters.flatMap((c) => c.tiles);

  const updateVisibleTiles = () => {
    const bounds = map.getBounds();
    const north = bounds.getNorth();
    const south = bounds.getSouth();
    const west = bounds.getWest();
    const east = bounds.getEast();

    const tiles: Tile[] = [];
    for (
      let lat = Math.floor(south / GRID_SIZE) * GRID_SIZE;
      lat < north;
      lat += GRID_SIZE
    ) {
      for (
        let lng = Math.floor(west / GRID_SIZE) * GRID_SIZE;
        lng < east;
        lng += GRID_SIZE
      ) {
        tiles.push([parseFloat(lat.toFixed(6)), parseFloat(lng.toFixed(6))]);
      }
    }
    setVisibleTiles(tiles);
  };

  useEffect(() => {
    updateVisibleTiles();
    map.on("moveend", updateVisibleTiles);
    return () => {
      map.off("moveend", updateVisibleTiles);
    };
  }, [map]);

  const handleClick = (tile: Tile) => {
    if (isAdjacentToCluster(tile)) {
      alert("Nie można zaznaczyć pola sąsiadującego z istniejącą farmą!");
      return; // Nie pozwalamy na zaznaczenie
    }
    const alreadySelected = allSelectedTiles.some((t) =>
      areTilesEqual(t, tile)
    );
    if (!alreadySelected) {
      const newTiles = [...allSelectedTiles, tile];
      const cluster = findCluster(tile, newTiles);
      onClusterAdd(cluster);
    } else {
      const updatedClusters = clusters
        .map((c) => ({
          ...c,
          tiles: c.tiles.filter((t) => !areTilesEqual(t, tile)),
        }))
        .filter((c) => c.tiles.length > 0);
      setClusters(updatedClusters);
    }
  };

  return (
    <>
      {visibleTiles.map(([lat, lng]) => {
        const isSelected = allSelectedTiles.some(
          ([a, b]) => a === lat && b === lng
        );
        const isDisabled = isAdjacentToCluster([lat, lng]);
        return (
          <Rectangle
            key={`${lat}_${lng}`}
            bounds={[
              [lat, lng],
              [lat + GRID_SIZE, lng + GRID_SIZE],
            ]}
            pathOptions={{
              color: isSelected ? "#aaa" : isDisabled ? "" : "#ffffff44",
              weight: 1,
              fillOpacity: isSelected ? 0.3 : isDisabled ? 0.1 : 0,
              dashArray: isDisabled ? "4" : undefined,
            }}
            eventHandlers={{
              click: () => !isDisabled && handleClick([lat, lng]),
            }}
          />
        );
      })}
    </>
  );
}
function ZoomListener({
  onZoomChange,
}: {
  onZoomChange: (zoom: number) => void;
}) {
  const map = useMap();
  useEffect(() => {
    onZoomChange(map.getZoom());
    const handleZoom = () => {
      onZoomChange(map.getZoom());
    };
    map.on("zoomend", handleZoom);
    return () => {
      map.off("zoomend", handleZoom);
    };
  }, [map, onZoomChange]);
  return null;
}

export default function MarsMap() {
  const [zoom, setZoom] = useState(6);
  const [showGrid, setShowGrid] = useState(false);
  const [changes, setChanges] = useState(false);
  const [clusters, setClusters] = useState<{ tiles: Tile[]; type: string }[]>(
    []
  );
  const [pendingClusters, setPendingClusters] = useState<Tile[][]>([]);

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [farmName, setFarmName] = useState("");
  const [farmType, setFarmType] = useState("Carrots"); // domyślny typ

  const initialRef = useRef<string>("");

  useEffect(() => {
    const saved = localStorage.getItem("farmClusters");
    if (saved) {
      setClusters(JSON.parse(saved));
      initialRef.current = saved;
    }
  }, []);

  useEffect(() => {
    setChanges(
      JSON.stringify(clusters) !== initialRef.current ||
        pendingClusters.length > 0
    );
  }, [clusters, pendingClusters]);

  const handleSaveClick = () => {
    // Jeśli są jakieś pendingClusters, otwieramy dialog
    if (pendingClusters.length > 0) {
      setIsDialogOpen(true);
      // Możesz zresetować wartości formularza
      setFarmName("");
      setFarmType("Carrots");
    } else {
      setChanges(false);
      localStorage.setItem("farmClusters", JSON.stringify(clusters));
    }
  };

  const handleDialogSave = () => {
    const newCluster = {
      tiles: pendingClusters.flat(),
      type: farmType,
      name: farmName,
    };

    fetch("http://localhost:8080/api/plants/createPlant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        species: newCluster.type
      }),
    })
      .then((response) => {
        if (response.ok) {
          setClusters((prev) => [...prev, newCluster]);
          setPendingClusters([]);
          localStorage.setItem(
            "farmClusters",
            JSON.stringify([...clusters, newCluster])
          );
          initialRef.current = JSON.stringify([...clusters, newCluster]);
          setChanges(false);
          setIsDialogOpen(false);
        } else {
          alert("Failed to save the farm to the server.");
        }
      })
      .catch(() => {
        alert("Network error while saving the farm.");
      });
  };

  const handleClusterAdd = (cluster: Tile[]) => {
    // Spłaszczone wszystkie tile z aktualnych farm (clusters)
    const existingTiles = clusters.flatMap((c) => c.tiles);

    // Sprawdzenie czy którykolwiek tile z cluster jestsiaduje z istniejącymi tile (poza tym clusterem)
    const isAdjacentToExisting = cluster.some((tile) => {
      const adjacentTiles = getAdjacentTiles(tile);
      return adjacentTiles.some((adj) =>
        existingTiles.some((t) => areTilesEqual(t, adj))
      );
    });

    if (isAdjacentToExisting) {
      alert("Cannot add cluster next to an existing farm!");
      return; // Nie dodajemy klastra
    }

    // Jeśli nie sąsiaduje, dodajemy do pendingClusters
    setPendingClusters((prev) => [...prev, cluster]);
  };

  useEffect(() => {
    if (zoom < 7) {
      setShowGrid(false);
    }
  }, [zoom]);
  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      <button
        onClick={() => {
          setPendingClusters([]);
          setChanges(false);
        }}
        style={{
          position: "absolute",
          top: 10,
          right: 265,
          zIndex: 10,
          padding: "8px 12px",
          background: "#333",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          display: changes ? "block" : "none",
        }}
      >
        Clear changes
      </button>

      <button
        onClick={handleSaveClick}
        style={{
          position: "absolute",
          top: 10,
          right: 120,
          zIndex: 10,
          padding: "8px 12px",
          background: "#333",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          display: changes ? "block" : "none",
        }}
      >
        Save changes
      </button>

      <button
        onClick={() => setShowGrid((prev) => !prev)}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 10,
          padding: "8px 12px",
          background: zoom >= 7 ? "#333" : "#666",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: zoom >= 7 ? "pointer" : "not-allowed",
          opacity: zoom >= 7 ? 1 : 0.5,
        }}
        disabled={zoom < 7}
      >
        {showGrid ? "Hide grid" : "Show grid"}
      </button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Save Farm</DialogTitle>
            <DialogDescription>
              Please provide the details for the farm you want to save.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 pb-4">
            <div>
              <label
                htmlFor="farmName"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                Name of the farm
              </label>
              <Input
                id="farmName"
                type="text"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                placeholder="Enter farm name"
                className="mt-1 w-full"
              />
            </div>
            <div>
              <label
                htmlFor="farmType"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                Type of the farm
              </label>
              <Select onValueChange={setFarmType} defaultValue={farmType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Wybierz typ farmy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Carrots">Carrots</SelectItem>
                  <SelectItem value="Potatoes">Potatoes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Tutaj możesz wyświetlić inne dane */}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleDialogSave} disabled={!farmName.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MapContainer
        center={[0, -90]}
        zoom={zoom}
        minZoom={3}
        crs={L.CRS.EPSG4326}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
        maxBounds={[
          [-90, -180],
          [90, 0],
        ]}
      >
        <TileLayer
          url="http://s3-eu-west-1.amazonaws.com/whereonmars.cartodb.net/viking_mdim21_global/{z}/{x}/{y}.png"
          attribution='Map data © <a href="https://www.openplanetary.org/">OpenPlanetary</a>'
          tms={true}
          noWrap={true}
          maxZoom={7}
        />
        {showGrid && (
          <InteractiveGrid
            clusters={clusters}
            setClusters={setClusters}
            onClusterAdd={handleClusterAdd}
          />
        )}
        <ColoredOverlay clusters={clusters} pendingClusters={pendingClusters} />
        <ZoomListener onZoomChange={setZoom} />
      </MapContainer>
    </div>
  );
}
