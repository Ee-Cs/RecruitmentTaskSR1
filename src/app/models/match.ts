import { Team } from './team';
/**
 * Represents a match on scoreboard.
 * This interface defines the structure of a match object,
 * including its unique identifier, name, and teams.
 *
 * @interface Match
 * @property {number} id - The unique identifier for the match.
 * @property {string} name - The name of the match.
 * @property {Team[]} teams - The teams belonging to the match.
 */
export interface Match {
  id: string;
  name: string;
  teams: Team[];
}
