export interface EventEntry {
  name:      string;
  rawTitle:  string;
  category:  string;
  link:      string;
  fields:    string[];
  schema:    string;
  example:   string;
  eventType: string; // e.g. "animal_register" extracted from EventType.ANIMAL_REGISTER
}
