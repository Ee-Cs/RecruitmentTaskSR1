import { Routes } from '@angular/router';

import { HomeComponent } from 'home/home.component';
import { ScoreboardFormComponent } from './scoreboard/scoreboard-form.component';
import { TournamentTableComponent } from './tournament/tournament-table.component';
import { ReportComponent } from './report/report.component';
import { SettingsComponent } from './settings/settings.component';
/**
 * Application routes for the Angular application.
 * This file defines the routes for the application, including paths for
 * match and team tables and forms.
 * Each route is associated with a specific component that will be displayed
 * when the route is activated.
 */
export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'scoreboard',
    component: ScoreboardFormComponent,
  },
  {
    path: 'tournament',
    component: TournamentTableComponent,
  },
  {
    path: 'report',
    component: ReportComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  // redirect to default
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
