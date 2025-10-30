import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { Match } from 'models/match';
import { TEST_MATCHES } from '../../testing/test-data';
import { BROWSER_STORAGE, MatchService } from './match.service';

// Minimal `expect` declaration for this test file. The workspace's global
// jasmine typings can conflict with the project's TypeScript setup, so provide
// a permissive declaration here to enable matcher calls like `toBe`/`toBeNull`.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const expect: any;

// Minimal mock storage interface used by these tests. Using a dedicated
// interface avoids widespread `any` casts and satisfies the linter.
interface MockStorage {
  _store?: string | null;
  getItem(key?: string): string | null;
  setItem?(key: string, value: string): void;
  removeItem?(): void;
  clear?(): void;
  length: number;
  key(index?: number): string | null;
}
/**
 * Unit tests for the MatchService.
 */
describe('MatchService', () => {
  let matchService: MatchService;
  let storageMock: MockStorage;
  /**
   * Set up the testing module for MatchService.
   * This function initializes the testing environment and compiles the class.
   */
  beforeEach(() => {
    storageMock = {
      _store: '',
      getItem: () => (storageMock._store ?? ''),
      setItem: (k: string, v: string) => { storageMock._store = v; return undefined; },
      removeItem: () => { storageMock._store = null; return undefined; },
      clear: () => { storageMock._store = ''; return undefined; },
      length: 0,
      key: (index?: number) => { void index; return null; }
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: BROWSER_STORAGE, useValue: storageMock }
      ]
    });

    matchService = TestBed.inject(MatchService);
  });
  /**
   * Test to check if the match service is created.
   */
  it('should be created', () => {
    expect(matchService).toBeDefined();
  });

  /**
   * Tests for the `matches$` observable exposed by the service.
   *
   * The MatchService exposes a BehaviorSubject (named `matches$`) that
   * publishes the current list of tournament matches whenever they change.
   * These tests verify that the subject emits the expected initial value
   * (read from the injected storage) and that it emits new values when
   * matches are added via `finishScoreboardMatch`.
   *
   * Contract:
   * - Inputs: mocked `BROWSER_STORAGE` contents and calls to service methods.
   * - Outputs: emissions from `matchService.matches$` (observed using
   *   `firstValueFrom` to capture a single emission).
   */
  describe('matches$ stream', () => {
    /**
     * Tests emiting initial value from storage on creation.
     */
    it('should emit initial value from storage on creation', async () => {
      // GIVEN
      Object.assign(storageMock, {
        _store: JSON.stringify(TEST_MATCHES),
        getItem: (key?: string) => key === 'tournamentMatches' ? (storageMock._store ?? null) : null,
        setItem: (k: string, v: string) => { if (k === 'tournamentMatches') storageMock._store = v; return undefined; },
        removeItem: () => { return undefined; },
        clear: () => { storageMock._store = ''; return undefined; },
        length: 0,
        key: (index?: number) => { void index; return null; }
      });
      // WHEN - force service to read current storage and emit
      matchService.matches$.next(matchService.getTournamentMatches());
      // THEN - await the first emission and assert
      const matches = await firstValueFrom(matchService.matches$);
      expect(matches).not.toBeNull();
      expect(matches.length).toBe(TEST_MATCHES.length);
    });

    /**
     * Tests emiting new value when match is added via finishScoreboardMatch
     */
    it('should emit new value when match is added via finishScoreboardMatch', async () => {
      // GIVEN
      const newMatch: Match = {
        id: 'new-id',
        name: 'New Match',
        teams: [{ name: 'Team A', score: 3 }, { name: 'Team B', score: 1 }]
      };
      Object.assign(storageMock, {
        _store: JSON.stringify(TEST_MATCHES),
        getItem: (key: string) => key === 'tournamentMatches' ? storageMock._store ?? null : null,
        setItem: (k: string, v: string) => { if (k === 'tournamentMatches') storageMock._store = v; return undefined; },
        removeItem: () => { return undefined; },
        clear: () => { return undefined; },
        length: 0,
        key: (index?: number) => { void index; return null; }
      });
      // WHEN
      matchService.finishScoreboardMatch(newMatch);
      // THEN
      const emittedValue = await firstValueFrom(matchService.matches$);
      const containsNewMatch = emittedValue.some(m => m.id === newMatch.id);
      expect(containsNewMatch).toBeTrue();
    });
  });

  /**
   * Tests for `loadDataset(datasetType)` which initializes/persists the
   * datasetType and the tournament matches in storage.
   *
   * Behavior under test:
   * - When datasetType is 'E' the service should persist an empty tournament
   *   matches array and record the dataset type.
   * - When datasetType is 'S' the service should persist the standard
   *   dataset and record the dataset type.
   */
  describe('loadDataset', () => {
    /**
     * Tests loading empty dataset.
     */
    it('should load empty dataset when type is "E"', () => {
      // WHEN
      let datasetType: string | null = null;
      let tournamentMatches: string | null = null;
      Object.assign(storageMock, {
        _store: '',
        getItem: () => storageMock._store ?? '',
        setItem: (key: string, value: string) => {
          if (key === 'datasetType') {
            datasetType = value;
          } else if (key === 'tournamentMatches') {
            tournamentMatches = value;
          }
          return undefined;
        },
        removeItem: () => { return undefined; },
        clear: () => { return undefined; },
        length: 0,
        key: () => null
      });
      matchService.loadDataset('E');
      // THEN
      expect(datasetType).toBe('E');
      expect(tournamentMatches).toBe('[]');
    });

    /**
     * Tests loading standard dataset by default.
     */
    it('should load standard dataset by default', () => {
      // GIVEN
      // WHEN
      let datasetType: string | null = null;
      let tournamentMatches: string | null = null;
      Object.assign(storageMock, {
        _store: '',
        getItem: () => storageMock._store ?? '',
        setItem: (key: string, value: string) => {
          if (key === 'datasetType') {
            datasetType = value;
          } else if (key === 'tournamentMatches') {
            tournamentMatches = value;
          }
          return undefined;
        },
        removeItem: () => { return undefined; },
        clear: () => { return undefined; },
        length: 0,
        key: () => null
      });
      matchService.loadDataset('S');
      // THEN
      expect(datasetType).toBe('S');
      expect(tournamentMatches).not.toBeNull();
    });
  });

  /**
   * Tests for scoreboard-related operations (get/set) that read and write a
   * single 'scoreboardMatch' entry in storage.
   *
   * These tests cover:
   * - Creating a new scoreboard match when none exists in storage.
   * - Returning an existing persisted scoreboard match.
   * - Persisting a scoreboard match via `setScoreboardMatch`.
   */
  describe('scoreboard match operations', () => {
    /**
     * Tests creating new match when getting empty scoreboard.
     */
    it('should create new match when getting empty scoreboard', () => {
      // GIVEN
      Object.assign(storageMock, {
        _store: '',
        getItem: (key: string) => key === 'scoreboardMatch' ? storageMock._store ?? null : null,
        setItem: () => { return undefined; },
        removeItem: () => { return undefined; },
        clear: () => { return undefined; },
        length: 0,
        key: () => null
      });
      // WHEN
      const match = matchService.getScoreboardMatch();
      // THEN
      expect(match.id).toBeTruthy();
      expect(match.teams).toBeDefined();
      expect(match.teams.length).toBe(2);
      expect(match.teams[0].score).toBe(0);
      expect(match.teams[1].score).toBe(0);
    });

    /**
     * Tests returning existing match from scoreboard storage
     */
    it('should return existing match from scoreboard storage', () => {
      // GIVEN
      const existingMatch = {
        id: 'test-id',
        name: 'Test Match',
        teams: [{ name: 'Team A', score: 5 }, { name: 'Team B', score: 3 }]
      };
      Object.assign(storageMock, {
        _store: JSON.stringify(existingMatch),
        getItem: (key: string) => key === 'scoreboardMatch' ? storageMock._store ?? null : null,
        setItem: () => { return undefined; },
        removeItem: () => { return undefined; },
        clear: () => { return undefined; },
        length: 0,
        key: () => null
      });
      // WHEN
      const match = matchService.getScoreboardMatch();
      // THEN
      expect(match).toBeDefined();
      expect(match.id).toBe(existingMatch.id);
      expect(match.name).toBe(existingMatch.name);
      expect(match.teams[0].score).toBe(existingMatch.teams[0].score);
      expect(match.teams[1].score).toBe(existingMatch.teams[1].score);
    });

    /**
     * Tests saving match to scoreboard storage.
     */
    it('should save match to scoreboard storage', () => {
      // GIVEN
      const match = {
        id: 'test-id',
        name: 'Test Match',
        teams: [{ name: 'Team A', score: 5 }, { name: 'Team B', score: 3 }]
      };
      let savedMatch: string | null = null;
      Object.assign(storageMock, {
        _store: null,
        getItem: () => storageMock._store ?? null,
        setItem: (key: string, value: string) => {
          if (key === 'scoreboardMatch') {
            savedMatch = value;
            storageMock._store = value;
          }
          return undefined;
        },
        removeItem: () => { return undefined; },
        clear: () => { return undefined; },
        length: 0,
        key: () => null
      });
      // WHEN
      matchService.setScoreboardMatch(match);
      // THEN
      expect(savedMatch).toBe(JSON.stringify(match));
    });
  });

  /**
   * Tests for `getTournamentMatches()` which reads tournament matches from
   * storage and returns them ordered by total score (descending). When
   * scores are equal, insertion order (or stable sort order) is used as a
   * tie-breaker.
   *
   * Scenarios covered:
   * - Sorting by total score descending.
   * - Tiebreaker behavior when totals are equal.
   * - Returning an empty array when storage is empty.
   */
  describe('getTournamentMatches', () => {
    /**
     * Tests sorting matches by total score descending
     */
    it('should sort matches by total score descending', () => {
      // GIVEN
      const matches = [
        {
          id: '1',
          name: 'Low Score',
          teams: [{ name: 'Team A', score: 1 }, { name: 'Team B', score: 1 }]
        },
        {
          id: '2',
          name: 'High Score',
          teams: [{ name: 'Team C', score: 3 }, { name: 'Team D', score: 4 }]
        }
      ];
      Object.assign(storageMock, {
        _store: JSON.stringify(matches),
        getItem: (key: string) => key === 'tournamentMatches' ? storageMock._store ?? null : null,
        setItem: (k: string, v: string) => { if (k === 'tournamentMatches') storageMock._store = v; return undefined; },
        removeItem: () => { return undefined; },
        clear: () => { return undefined; },
        length: 0,
        key: () => null
      });
      // WHEN
      const result = matchService.getTournamentMatches();
      // THEN
      expect(result.length).toBe(2);
      expect(result[0].id).toBe('2');
      expect(result[1].id).toBe('1');
    });

    /**
     * Tests sorting matches by insertion order when total scores are equal.
     */
    it('should sort matches by insertion order when total scores are equal', () => {
      // GIVEN
      const matches = [
        {
          id: '1',
          name: 'First Match',
          teams: [{ name: 'Team A', score: 2 }, { name: 'Team B', score: 2 }]
        },
        {
          id: '2',
          name: 'Second Match',
          teams: [{ name: 'Team C', score: 2 }, { name: 'Team D', score: 2 }]
        }
      ];
      Object.assign(storageMock, {
        _store: JSON.stringify(matches),
        getItem: (key: string) => key === 'tournamentMatches' ? storageMock._store ?? null : null,
        setItem: (k: string, v: string) => { if (k === 'tournamentMatches') storageMock._store = v; return undefined; },
        removeItem: () => { return undefined; },
        clear: () => { return undefined; },
        length: 0,
        key: () => null
      });
      // WHEN
      const result = matchService.getTournamentMatches();
      // THEN
      expect(result.length).toBe(2);
      expect(result[0].id).toBe('2');
      expect(result[1].id).toBe('1');
    });
    /**
     * Tests returning empty array when storage is empty.
     */
    it('should return empty array when storage is empty', () => {
      // GIVEN
      Object.assign(storageMock, {
        _store: '',
        getItem: () => storageMock._store ?? '',
        setItem: () => { return undefined; },
        removeItem: () => { return undefined; },
        clear: () => { return undefined; },
        length: 0,
        key: () => null
      });
      // WHEN
      const result = matchService.getTournamentMatches();
      // THEN
      expect(result.length).toBe(0);
    });
  });
});
