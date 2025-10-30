import { inject } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';

import { Match } from 'models/match';
import { MatchService } from 'services/match-service/match.service';
/**
 * Data source for the Table view and Form view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data.
 */
export class TournamentDataSource extends DataSource<Match> {
  private matchService: MatchService = inject(MatchService);
  matches: Match[] = [];
  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   *
   * @returns An observable of the items to be rendered by the table.
   */
  connect(): Observable<Match[]> {
    // Use the matches$ observable so the table updates when matches change
    return this.matchService.matches$;
  }
  /**
   * Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   *
   * @returns void
   */
  disconnect(): void {
    // No resources to clean up in this implementation.
  }
}