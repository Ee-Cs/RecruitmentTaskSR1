import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

import { ScoreboardFormComponent } from './scoreboard-form.component';
import { MatchService } from 'services/match-service/match.service';
import { TEST_MATCH } from '../testing/test-data';

/**
 * Unit tests for the ScoreboardFormComponent.
 * This file contains tests to ensure that the component compiles correctly and behaves as expected.
 */
describe('ScoreboardFormComponent', () => {
  let component: ScoreboardFormComponent;
  let matchServiceSpy: jasmine.SpyObj<MatchService>;
  let fixture: ComponentFixture<ScoreboardFormComponent>;

  /**
   * Sets up the testing module and compiles the component before each test.
   * Imports necessary modules and sets up test doubles for dependencies.
   */
  beforeEach(async () => {
    matchServiceSpy = jasmine.createSpyObj('MatchService', [
      'getScoreboardMatch',
      'setScoreboardMatch',
      'finishScoreboardMatch'
    ]);
    matchServiceSpy.getScoreboardMatch.and.returnValue(TEST_MATCH);
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatDialogModule
      ],
      providers: [
        provideNativeDateAdapter(),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            snapshot: { paramMap: { get: () => null } },
          },
        },
        { provide: MatchService, useValue: matchServiceSpy }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ScoreboardFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * Tests that the component is created successfully.
   */
  it('should compile', () => {
    // GIVEN
    // WHEN
    // THEN
    if (!component) throw new Error('Component should be created');
  });

  /**
   * Tests that the form is initialized with empty values.
   */
  it('should initialize form with empty values', () => {
    // GIVEN
    // WHEN
    const form = component.scoreboardForm;
    // THEN
    if (!form) throw new Error('Form should be created');
    if (form.get('matchName')?.value !== '')
      throw new Error('Match name should be empty');
    if (form.get('homeTeamName')?.value !== '')
      throw new Error('Home team name should be empty');
    if (form.get('guestTeamName')?.value !== '')
      throw new Error('Guest team name should be empty');
    if (form.get('homeTeamScore')?.value !== 0)
      throw new Error('Home team score should be 0');
    if (form.get('guestTeamScore')?.value !== 0)
      throw new Error('Guest team score should be 0');
  });

  /**
   * Tests form validation for required fields.
   */
  it('should validate required form fields', () => {
    // GIVEN
    const form = component.scoreboardForm;
    // WHEN
    // THEN
    if (form.valid) throw new Error('Form should be invalid when empty');
    if (!form.get('matchName')?.errors?.['required'])
      throw new Error('Match name should be required');
    if (!form.get('homeTeamName')?.errors?.['required'])
      throw new Error('Home team name should be required');
    if (!form.get('guestTeamName')?.errors?.['required'])
      throw new Error('Guest team name should be required');
  });

  /**
   * Tests finishing a match successfully with user confirmation.
   * Tests the complete flow of:
   * 1. Click "Finish match" button
   * 2. Confirm in the dialog
   * 3. Verify service call
   * 4. Verify form reset
   */
  it('should finish match with correct data when confirmed', () => {
    // GIVEN
    const dialog = TestBed.inject(MatDialog);
    const dialogRef = jasmine.createSpyObj<MatDialogRef<unknown>>(['afterClosed', 'close']);
    dialogRef.afterClosed.and.returnValue(of(true));
    const dialogSpy = spyOn(dialog, 'open').and.returnValue(dialogRef);
    component.scoreboardForm.patchValue({
      matchName: TEST_MATCH.name,
      homeTeamName: TEST_MATCH.teams[0].name,
      homeTeamScore: TEST_MATCH.teams[0].score,
      guestTeamName: TEST_MATCH.teams[1].name,
      guestTeamScore: TEST_MATCH.teams[1].score
    });
    // WHEN
    component.onSubmit();
    // THEN
    if (!dialogSpy.calls.any()) throw new Error('Dialog should be opened');
    // Verify matchService was called with correct data
    if (!matchServiceSpy.finishScoreboardMatch.calls.any())
      throw new Error('finishScoreboardMatch should be called');
    const actualMatch = matchServiceSpy.finishScoreboardMatch.calls.first().args[0];
    if (actualMatch.name !== TEST_MATCH.name) throw new Error('Match name should match');
    if (actualMatch.teams[0].name !== TEST_MATCH.teams[0].name)
      throw new Error('Home team name should match');
    if (actualMatch.teams[1].name !== TEST_MATCH.teams[1].name)
      throw new Error('Guest team name should match');
    if (actualMatch.teams[0].score !== TEST_MATCH.teams[0].score)
      throw new Error('Home team score should match');
    if (actualMatch.teams[1].score !== TEST_MATCH.teams[1].score)
      throw new Error('Guest team score should match');
    // Verify form was reset
    if (component.scoreboardForm.get('matchName')?.value !== null)
      throw new Error('Match name should be reset');
    if (component.scoreboardForm.get('homeTeamName')?.value !== null)
      throw new Error('Home team name should be reset');
    if (component.scoreboardForm.get('homeTeamScore')?.value !== 0)
      throw new Error('Home team score should be reset to 0');
    if (component.scoreboardForm.get('guestTeamName')?.value !== null)
      throw new Error('Guest team name should be reset');
    if (component.scoreboardForm.get('guestTeamScore')?.value !== 0)
      throw new Error('Guest team score should be reset to 0');
  });

  /**
   * Tests that nothing happens when user cancels the finish match dialog.
   */
  it('should not finish match when dialog is cancelled', () => {
    // GIVEN
    const dialog = TestBed.inject(MatDialog);
    const dialogRef = jasmine.createSpyObj<MatDialogRef<unknown>>(['afterClosed', 'close']);
    dialogRef.afterClosed.and.returnValue(of(false));
    spyOn(dialog, 'open').and.returnValue(dialogRef);
    component.scoreboardForm.patchValue({
      matchName: TEST_MATCH.name,
      homeTeamName: TEST_MATCH.teams[0].name,
      homeTeamScore: TEST_MATCH.teams[0].score,
      guestTeamName: TEST_MATCH.teams[1].name,
      guestTeamScore: TEST_MATCH.teams[1].score
    });
    // WHEN
    component.onSubmit();
    // THEN
    if (matchServiceSpy.finishScoreboardMatch.calls.any())
      throw new Error('finishScoreboardMatch should not be called');
    // Form should not be reset
    if (component.scoreboardForm.get('matchName')?.value !== TEST_MATCH.name)
      throw new Error('Match name should not be reset');
    if (component.scoreboardForm.get('homeTeamName')?.value !== TEST_MATCH.teams[0].name)
      throw new Error('Home team name should not be reset');
    if (component.scoreboardForm.get('homeTeamScore')?.value !== TEST_MATCH.teams[0].score)
      throw new Error('Home team score should not be reset');
    if (component.scoreboardForm.get('guestTeamName')?.value !== TEST_MATCH.teams[1].name)
      throw new Error('Guest team name should not be reset');
    if (component.scoreboardForm.get('guestTeamScore')?.value !== TEST_MATCH.teams[1].score)
      throw new Error('Guest team score should not be reset');
  });

  /**
   * Tests that the form tracks score changes correctly.
   */
  it('should update scores when form changes', () => {
    // GIVEN
    component.scoreboardForm.patchValue({
      matchName: 'Test Match',
      homeTeamName: 'Home',
      homeTeamScore: 3,
      guestTeamName: 'Guest',
      guestTeamScore: 1
    });
    // WHEN
    const homeScore = component.scoreboardForm.get('homeTeamScore')?.value;
    const guestScore = component.scoreboardForm.get('guestTeamScore')?.value;
    // THEN
    if (homeScore !== 3) throw new Error('Home score should be 3');
    if (guestScore !== 1) throw new Error('Guest score should be 1');
  });

  /**
   * Tests deleting a match successfully with user confirmation.
   * Tests the complete flow of:
   * 1. Click "Delete match" button
   * 2. Confirm in the dialog
   * 3. Verify form reset
   */
  it('should delete match and reset form', () => {
    // GIVEN
    const dialog = TestBed.inject(MatDialog);
    const dialogRef = jasmine.createSpyObj<MatDialogRef<unknown>>(['afterClosed', 'close']);
    dialogRef.afterClosed.and.returnValue(of(true));
    const dialogSpy = spyOn(dialog, 'open').and.returnValue(dialogRef);
    component.scoreboardForm.patchValue({
      matchName: TEST_MATCH.name,
      homeTeamName: TEST_MATCH.teams[0].name,
      homeTeamScore: TEST_MATCH.teams[0].score,
      guestTeamName: TEST_MATCH.teams[1].name,
      guestTeamScore: TEST_MATCH.teams[1].score
    });
    // WHEN
    component.deleteMatch();
    // THEN
    if (!dialogSpy.calls.any())
      throw new Error('Dialog should be opened');
    // Verify form was reset
    if (component.scoreboardForm.get('matchName')?.value !== null)
      throw new Error('Match name should be reset');
    if (component.scoreboardForm.get('homeTeamName')?.value !== null)
      throw new Error('Home team name should be reset');
    if (component.scoreboardForm.get('homeTeamScore')?.value !== 0)
      throw new Error('Home team score should be reset to 0');
    if (component.scoreboardForm.get('guestTeamName')?.value !== null)
      throw new Error('Guest team name should be reset');
    if (component.scoreboardForm.get('guestTeamScore')?.value !== 0)
      throw new Error('Guest team score should be reset to 0');
  });

  /**
   * Tests that nothing happens when user cancels the delete match dialog.
   */
  it('should not delete match when dialog is cancelled', () => {
    // GIVEN
    const dialog = TestBed.inject(MatDialog);
    const dialogRef = jasmine.createSpyObj<MatDialogRef<unknown>>(['afterClosed', 'close']);
    dialogRef.afterClosed.and.returnValue(of(false));
    spyOn(dialog, 'open').and.returnValue(dialogRef);
    component.scoreboardForm.patchValue({
      matchName: TEST_MATCH.name,
      homeTeamName: TEST_MATCH.teams[0].name,
      homeTeamScore: TEST_MATCH.teams[0].score,
      guestTeamName: TEST_MATCH.teams[1].name,
      guestTeamScore: TEST_MATCH.teams[1].score
    });
    // WHEN
    component.onSubmit();
    // THEN
    // Form should not be reset
    if (component.scoreboardForm.get('matchName')?.value !== TEST_MATCH.name)
      throw new Error('Match name should not be reset');
    if (component.scoreboardForm.get('homeTeamName')?.value !== TEST_MATCH.teams[0].name)
      throw new Error('Home team name should not be reset');
    if (component.scoreboardForm.get('homeTeamScore')?.value !== TEST_MATCH.teams[0].score)
      throw new Error('Home team score should not be reset');
    if (component.scoreboardForm.get('guestTeamName')?.value !== TEST_MATCH.teams[1].name)
      throw new Error('Guest team name should not be reset');
    if (component.scoreboardForm.get('guestTeamScore')?.value !== TEST_MATCH.teams[1].score)
      throw new Error('Guest team score should not be reset');
  });

});
