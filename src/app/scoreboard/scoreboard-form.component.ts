import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  OnDestroy
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Match } from 'models/match';
import { MatchService } from 'services/match-service/match.service';
/**
 * Dialog displaying delete match warning message.
 */
@Component({
  template: `<h2 mat-dialog-title>Delete the match?</h2>
    <mat-dialog-content></mat-dialog-content>
    <mat-dialog-actions>
      <button matButton [mat-dialog-close]="false" cdkFocusInitial>
        Cancel
      </button>
      <button matButton [mat-dialog-close]="true">
        Delete
      </button>
    </mat-dialog-actions>`,
  imports: [MatDialogActions, MatButtonModule, MatDialogClose, MatDialogContent, MatDialogTitle],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class DeleteMatchDialog { }
/**
 * Dialog displaying finish match warning message.
 */
@Component({
  template: `<h2 mat-dialog-title>Finish the match?</h2>
    <mat-dialog-content></mat-dialog-content>
    <mat-dialog-actions>
      <button matButton [mat-dialog-close]="false" cdkFocusInitial>
        Cancel
      </button>
      <button matButton [mat-dialog-close]="true">
        Finish
      </button>
    </mat-dialog-actions>`,
  imports: [MatDialogActions, MatButtonModule, MatDialogClose, MatDialogContent, MatDialogTitle],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class FinishMatchDialog { }
/**
 * ScoreboardFormComponent is an Angular component that provides a form for creating, updating, or deleting a scoreboard.
 * It uses Angular Material components for UI elements and Reactive Forms for form handling.
 * This component is part of the forms module and is used to manage scoreboard-related forms.
 */
@Component({
  selector: 'app-scoreboard-form',
  templateUrl: './scoreboard-form.component.html',
  styleUrl: './scoreboard-form.component.css',
  standalone: true,
  imports: [
    NgClass,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
})
export class ScoreboardFormComponent implements OnInit, OnDestroy {
  matchService = inject(MatchService);
  private formBuilder = inject(FormBuilder);
  scoreboardForm = this.formBuilder.group({
    matchName: ['', Validators.required],
    matchFinished: false,
    homeTeamName: ['', Validators.required],
    homeTeamScore: [0],
    guestTeamName: ['', Validators.required],
    guestTeamScore: [0],
  });
  dialog: MatDialog = inject(MatDialog);
  private matchId = '';
  /**
   * A component lifecycle hook method.
   * Runs once after Angular has initialized all the component's inputs.
   */
  ngOnInit() {
    const match = this.matchService.getScoreboardMatch();
    this.matchId = match?.id ?? '';
    this.scoreboardForm.controls.matchName.setValue(match?.name ?? '');
    this.scoreboardForm.controls.homeTeamName.setValue(match?.teams[0].name ?? '');
    this.scoreboardForm.controls.homeTeamScore.setValue(match?.teams[0].score ?? 0);
    this.scoreboardForm.controls.guestTeamName.setValue(match?.teams[1].name ?? '');
    this.scoreboardForm.controls.guestTeamScore.setValue(match?.teams[1].score ?? 0);
    console.log('🟩ScoreboardFormComponent.ngOnInit():');
  }
  /**
   * Save current scoreboard to storage when leaving the component.
   */
  ngOnDestroy(): void {
    const match: Match = {
      id: this.matchId,
      name: this.scoreboardForm.get('matchName')?.value ?? '',
      teams: [
        {
          name: this.scoreboardForm.get('homeTeamName')?.value ?? '',
          score: Number(this.scoreboardForm.get('homeTeamScore')?.value ?? 0),
        },
        {
          name: this.scoreboardForm.get('guestTeamName')?.value ?? '',
          score: Number(this.scoreboardForm.get('guestTeamScore')?.value ?? 0),
        }
      ],
    };
    this.matchService.setScoreboardMatch(match);
    console.log('🟩ScoreboardFormComponent.ngOnDestroy(): saved scoreboard');
  }
  /**
   * The delete match action handler.
   */
  deleteMatch() {
    const dialogRef = this.dialog.open(DeleteMatchDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.scoreboardForm.reset();
        this.scoreboardForm.controls.homeTeamScore.setValue(0);
        this.scoreboardForm.controls.guestTeamScore.setValue(0);
      }
    });
    console.log('🟩ScoreboardFormComponent.deleteMatch():');
  }
  /**
   * The finish match action handler.
   */
  onSubmit() {
    const dialogRef = this.dialog.open(FinishMatchDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const match: Match = {
          id: this.matchId,
          name: this.scoreboardForm.get('matchName')?.value ?? '',
          teams: [
            {
              name: this.scoreboardForm.get('homeTeamName')?.value ?? '',
              score: this.scoreboardForm.get('homeTeamScore')?.value ?? 0,
            },
            {
              name: this.scoreboardForm.get('guestTeamName')?.value ?? '',
              score: this.scoreboardForm.get('guestTeamScore')?.value ?? 0,
            }
          ],
        };
        this.matchService.finishScoreboardMatch(match);
        this.scoreboardForm.reset();
        this.scoreboardForm.controls.homeTeamScore.setValue(0);
        this.scoreboardForm.controls.guestTeamScore.setValue(0);
        console.log('🟩ScoreboardFormComponent.onSubmit(): finished match[%s]', match?.name);
      } else {
        console.log('🟩ScoreboardFormComponent.onSubmit(): match finish canceled');
      }
    });
  }
  /**
   * Determines the CSS class for score coloring based on comparison
   */
  getScoreClass(team: 'home' | 'guest'): string {
    const homeScore = Number(this.scoreboardForm.get('homeTeamScore')?.value ?? 0);
    const guestScore = Number(this.scoreboardForm.get('guestTeamScore')?.value ?? 0);
    if (homeScore === guestScore) {
      return 'score-tied';
    }
    if (team === 'home') {
      return homeScore > guestScore ? 'score-winning' : 'score-losing';
    } else {
      return guestScore > homeScore ? 'score-winning' : 'score-losing';
    }
  }
  /**
   * The add home team score action handler.
   */
  addHomeTeamScore() {
    const score = (this.scoreboardForm.get('homeTeamScore')?.value ?? 0) + 1;
    this.scoreboardForm.controls.homeTeamScore.setValue(score);
  }
  /**
   * The subtract home team score action handler.
   */
  subtractHomeTeamScore() {
    const score = this.scoreboardForm.get('homeTeamScore')?.value ?? 0;
    if (score > 0) {
      this.scoreboardForm.controls.homeTeamScore.setValue(score - 1);
    }
  }
  /**
   * The add guest team score action handler.
   */
  addGuestTeamScore() {
    const score = (this.scoreboardForm.get('guestTeamScore')?.value ?? 0) + 1;
    this.scoreboardForm.controls.guestTeamScore.setValue(score);
  }
  /**
   * The subtract guest team score action handler.
   */
  subtractGuestTeamScore() {
    const score = this.scoreboardForm.get('guestTeamScore')?.value ?? 0;
    if (score > 0) {
      this.scoreboardForm.controls.guestTeamScore.setValue(score - 1);
    }
  }
}
