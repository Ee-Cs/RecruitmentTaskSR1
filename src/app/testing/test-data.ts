import { Match } from 'models/match';
/**
 * Test tournament data.
 * This data is used to populate the matches array in tests.
 */
export const TEST_MATCHES: Match[] = [
  {
    id: '1',
    name: 'Match 1', teams: [
      { name: 'A', score: 5 },
      { name: 'B', score: 3 }
    ]
  }, // total 8
  {
    id: '2',
    name: 'Match 2', teams: [
      { name: 'C', score: 4 },
      { name: 'D', score: 3 }
    ]
  }, // total 7
  {
    id: '3',
    name: 'Match 3', teams: [
      { name: 'E', score: 3 },
      { name: 'F', score: 3 }
    ]
  }, // total 6
  {
    id: '4',
    name: 'Match 4', teams: [
      { name: 'G', score: 2 },
      { name: 'H', score: 2 }
    ]
  }, // total 4
];
export const TEST_MATCH: Match = {
  id: '1',
  name: '',
  teams: [
    { name: '', score: 0 },
    { name: '', score: 0 }
  ]
};
