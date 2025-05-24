export type Tile = [number, number];
export type FarmType = "carrot" | "potato" | "corn" | null;
export type TileWithType = {
  position: Tile;
  type: FarmType;
};
