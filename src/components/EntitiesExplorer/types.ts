export interface EntityEntry {
  name:     string;   // Display name (e.g., "Animal - Swine - Gilt - Empty")
  entity:   string;   // snake_case identifier (e.g., "animal_swine_gilt_empty")
  category: string;   // Derived from directory (e.g., "SWINE")
  link:     string;   // GitHub link to source docs
  fields:   string[]; // Field names extracted from schema
  schema:   string;   // Python schema definition block
  example:  string;   // Python example block
}
