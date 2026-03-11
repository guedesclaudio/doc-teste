export interface EntityEntry {
  name:        string;   // Display name (e.g., "Animal")
  entity:      string;   // snake_case identifier (e.g., "animal")
  category:    string;   // Derived from filename (e.g., "ANIMAL")
  link:        string;   // GitHub link to source docs
  fields:      string[]; // Array of inferred field names
  inferences:  string;   // Raw inference field definitions text
  example:     string;   // JSON/Python example block
}
