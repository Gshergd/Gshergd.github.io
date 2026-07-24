export const GALLERY_TITLE_LIMIT = 48;
export const GALLERY_DESCRIPTION_LIMIT = 180;
export const GALLERY_UPLOAD_LIMIT = 10 * 1024 * 1024;

export type GalleryItem = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  storage_path: string | null;
  sort_order: number;
  created_at?: string;
};

const titles = [
  "Island Light",
  "After the Fire",
  "An Unexpected Ally",
  "Roads Between",
  "A Complicated Room",
  "Desert Transit",
  "Negotiations",
  "A New City",
  "The Pearl",
  "Open Water",
  "Industrial Night",
  "Midnight Run",
  "Mountain Curve",
  "Backstreet Detour",
  "Golden Hour",
  "The Long Way Home",
];

export const staticGalleryItems: GalleryItem[] = titles.map((title, index) => ({
  id: `00000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
  title,
  description: "A screenshot collected from games, experiments, characters, environments, and the visual moments worth keeping.",
  image_url: `/assets/portfolio/field-${String(index + 1).padStart(2, "0")}.webp`,
  storage_path: null,
  sort_order: index + 10,
}));
