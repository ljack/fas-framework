// AUTO-GENERATED - DO NOT EDIT DIRECTLY
import { FeatureRegistry } from './registry';

import { exampleFeature } from '../features/example/feature';
import { leaderboardFeature } from '../features/leaderboard/feature';

export function registerActiveFeatures(registry: FeatureRegistry) {
  registry.register(exampleFeature);
  registry.register(leaderboardFeature);
}
