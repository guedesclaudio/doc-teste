import type { RuleGroup } from '../../components/RulesExplorer/types';

// To add a new rule group: create a JSON file in this folder and import it below.
import animalWeaningRules from './animal_weaning.json';
import animalLossOffRules from './animal_loss_off.json';
import animalTransferRules from './animal_transfer.json';

export const ruleGroups: RuleGroup[] = [
  {
    group: 'animal_weaning',
    label: 'Animal Weaning',
    rules: animalWeaningRules,
  },
  {
    group: 'animal_loss_off',
    label: 'Animal Loss Off',
    rules: animalLossOffRules,
  },
  {
    group: 'animal_transfer',
    label: 'Animal Transfer',
    rules: animalTransferRules,
  },
];

export type { RuleGroup };
