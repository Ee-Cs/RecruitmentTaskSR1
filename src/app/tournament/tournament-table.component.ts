import { AfterViewInit, Component, InjectionToken, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';

import { Match } from 'models/match';
import { TournamentDataSource } from './tournament.datasource';

/**
 * Injection token for browser storage.
 * This token is used to inject the browser's localStorage into services that require it.
 */
export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage,
});
/**
 * A component for tournament page.
 */
@Component({
  selector: 'app-tournament',
  templateUrl: './tournament-table.component.html',
  styleUrl: './tournament-table.component.css',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatRadioModule,
    MatSelectModule,
    MatTableModule,
    MatTable
  ],
})
export class TournamentTableComponent implements OnInit, AfterViewInit {
  storage = inject<Storage>(BROWSER_STORAGE);
  @ViewChild(MatTable) table!: MatTable<Match>;
  dataSource = new TournamentDataSource();
  displayedHeaderColumns1 = [
    'pos', 'matchHeader', 'homeTeamHeader', 'guestTeamHeader'
  ];
  displayedHeaderColumns2 = [
    'homeTeamNameHeader', 'homeTeamScoreHeader', 'guestTeamNameHeader', 'guestTeamScoreHeader'
  ];
  displayedColumns = [
    'pos', 'matchName', 'homeTeamName', 'homeTeamScore', 'guestTeamName', 'guestTeamScore'
  ];
  private formBuilder = inject(FormBuilder);
  tournamentForm = this.formBuilder.group({});
  /**
   * A component lifecycle hook method.
   * Runs once after Angular has initialized all the component's inputs.
   * @returns void
   */
  ngOnInit() {
    console.log('🟧TournamentComponent.ngOnInit():');
  }
  /**
   * A component lifecycle hook method.
   * Runs once after the component's view has been initialized.
   */
  ngAfterViewInit(): void {
    this.table.dataSource = this.dataSource;
    console.log('🟧TournamentComponent.ngAfterViewInit():');
  }
}
