export interface Rule {
  event: string[];
  validationFields: string[];
  error: string;
  species: string[];
  stages: string[];
  description: string;
  conditions?: string[];
}

export interface RuleGroup {
  group: string;
  label: string;
  rules: Rule[];
}

export interface FlatRule extends Rule {
  group: string;
  groupLabel: string;
}

export type EventType = 'Register' | 'Update' | 'Deletion';
