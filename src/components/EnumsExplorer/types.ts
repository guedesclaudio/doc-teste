export interface EnumGroup {
  label:  string;   // "" for ungrouped, or e.g. "Poultry Animal Type"
  values: string[]; // e.g., ["BROILER", "GRILLER"]
}

export interface EnumEntry {
  name:     string;      // Display name, e.g. "AnimalType (or AnimalGroupAnimalType)"
  enum:     string;      // snake_case identifier, e.g. "animal_type"
  category: string;      // Derived from file/directory, e.g. "ANIMAL"
  link:     string;      // GitHub link to source docs
  values:   string[];    // Flat list of all values (for search/count)
  groups:   EnumGroup[]; // Grouped values for display in modal
}
