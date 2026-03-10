import type { RuleGroup } from '../../components/RulesExplorer/types';

// To add a new rule group: create a JSON file in this folder and import it below.
import animalWeaningRules from './animal_weaning.json';
import animalLossOffRules from './animal_loss_off.json';
import animalTransferRules from './animal_transfer.json';
import animalParturitionRules from './animal_parturition.json';
import animalLossRprRules from './animal_loss_rpr.json';
import animalMissedHeatRules from './animal_missed_heat.json';
import animalNurseMotherRules from './animal_nurse_mother.json';
import animalMatingRules from './animal_mating.json';

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
  {
    group: 'animal_parturition',
    label: 'Animal Parturition',
    rules: animalParturitionRules,
  },
  {
    group: 'animal_loss_rpr',
    label: 'Animal Loss RPR',
    rules: animalLossRprRules,
  },
  {
    group: 'animal_missed_heat',
    label: 'Animal Missed Heat',
    rules: animalMissedHeatRules,
  },
  {
    group: 'animal_nurse_mother',
    label: 'Animal Nurse Mother',
    rules: animalNurseMotherRules,
  },
  {
    group: 'animal_mating',
    label: 'Animal Mating',
    rules: animalMatingRules,
  },
];

export type { RuleGroup };
