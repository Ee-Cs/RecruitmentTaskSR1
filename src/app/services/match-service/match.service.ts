import { Injectable, InjectionToken, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Match } from 'models/match';
import { STANDARD_DATASET, FULL_DATASET, EMPTY_DATASET } from '../../settings/initial-data';
/**
 * Injection token for browser storage.
 * This token is used to inject the browser's localStorage into services that require it.
 */
export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage,
});
/**
 * Service for managing matchs.
 * This service provides methods to create matches.
 * It uses local storage to persist match data across sessions.
 * It also interacts with the TeamService to manage teams associated with matchs.
 */
@Injectable({
  providedIn: 'root',
})
export class MatchService {
  storage = inject<Storage>(BROWSER_STORAGE);
  /**
   * Observable stream of tournament matches. Components and data sources should
   * subscribe to this to receive immediate updates when matches change.
   */
  matches$ = new BehaviorSubject<Match[]>([]);

  /**
   * Constructor.
   */
  constructor() {
    this.loadDataset('S');
    // Seed the matches$ stream with current storage state
    this.matches$.next(this.getTournamentMatches());
    console.log('MatchService.constructor():');
  }
  /**
   * Loads the dataset.
   * 
   * @param datasetType the dataset type
   * @returns void
   */
  loadDataset(datasetType: string) {
    this.storage.setItem('datasetType', datasetType);
    switch (datasetType) {
      case 'F':
        this.storage.setItem('tournamentMatches', JSON.stringify(FULL_DATASET.tournamentMatches));
        break;
      case 'E':
        this.storage.setItem('tournamentMatches', JSON.stringify(EMPTY_DATASET.tournamentMatches));
        break;
      default: //'S'
        this.storage.setItem('tournamentMatches', JSON.stringify(STANDARD_DATASET.tournamentMatches));
    }
    // Notify subscribers that dataset changed
    this.matches$.next(this.getTournamentMatches());
    console.log('MatchService.loadDataset(): datasetType[%s]', datasetType);
  }
  /**
   * Gets the match.
   *
   * @returns the Match object
   */
  getScoreboardMatch(): Match {
    let match: Match;
    const json = this.storage.getItem('scoreboardMatch') ?? '';
    if (json.trim().length === 0) {
      match = {
        id: crypto.randomUUID(),
        name: '',
        teams: [
          {
            name: '',
            score: 0,
          },
          {
            name: '',
            score: 0,
          },
        ]
      };
    } else {
      match = JSON.parse(json) as Match;
    }
    console.log('MatchService.getScoreboardMatch(): id[%s], name[%s]', match.id, match.name);
    return match;
  }
  /**
   * Sets the match.
   *
   * @param the Match object
   */
  setScoreboardMatch(match: Match) {
    const json = JSON.stringify(match) ?? '';
    this.storage.setItem('scoreboardMatch', json);
    console.log('MatchService.setScoreboardMatch(): id[%s], name[%s]', match.id, match.name);
    return match;
  }
  /**
   * Finishes the match on scoreboard.
   *
   * @param match the match
   * @return void
   */
  finishScoreboardMatch(match: Match) {
    this.storage.setItem('scoreboardMatch', '');
    let matches = this.getTournamentMatches();
    if (matches.length === 0) {
      matches = [match];
    } else {
      matches.push(match);
    }
    const json = JSON.stringify(matches) ?? '';
    this.storage.setItem('tournamentMatches', json);
    this.matches$.next(this.getTournamentMatches());
    console.log('MatchService.finishScoreboardMatch(): id[%s], name[%s]', match.id, match.name);
  }
  /**
   * Gets the match array.
   * Retrieves the match array from local storage,
   * parses it from JSON format,
   * and returns it as an array of Match objects.
   * If the storage is empty, it returns an empty array.
   *
   * @returns an array of Match objects
   */
  getTournamentMatches(): Match[] {
    const json = this.storage.getItem('tournamentMatches') ?? '';
    let matches: Match[];
    if (json.trim().length === 0) {
      matches = [];
    } else {
      // Parse stored matches and sort by total score descending.
      // When total scores are equal, the match added later (higher index) should come first.
      const parsed = JSON.parse(json) as Match[];
      const enriched = parsed.map((m, i) => ({
        match: m,
        index: i,
        total: (Number(m.teams?.[0]?.score ?? 0) + Number(m.teams?.[1]?.score ?? 0)),
      }));
      enriched.sort((a, b) => {
        if (b.total !== a.total) {
          return b.total - a.total; // higher total first
        }
        return b.index - a.index; // later-inserted first
      });
      matches = enriched.map(e => e.match);
    }
    console.log('MatchService.getTournamentMatches(): matches length[%d]', matches.length);
    return matches;
  }
}
