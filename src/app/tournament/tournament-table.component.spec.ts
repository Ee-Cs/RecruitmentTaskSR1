import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';

import { TournamentTableComponent } from './tournament-table.component';
import { MatchService } from 'services/match-service/match.service';
import { Match } from 'models/match';
import { TEST_MATCHES } from '../testing/test-data';

/**
 * Unit tests for the TournamentTableComponent.
 * This file contains tests to ensure that the component compiles correctly and behaves as expected.
 */
describe('TournamentTableComponent', () => {
  let component: TournamentTableComponent;
  let fixture: ComponentFixture<TournamentTableComponent>;
  let matchServiceSpy: jasmine.SpyObj<MatchService>;

  /**
   * Set up the testing module for TournamentTableComponent.
   * This function initializes the testing environment and compiles the component.
   */
  beforeEach(() => {
    // Create a spy object for the MatchService
    matchServiceSpy = jasmine.createSpyObj('MatchService', ['matches$']);
    matchServiceSpy.matches$ = new BehaviorSubject<Match[]>([]);
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        TournamentTableComponent
      ],
      providers: [
        { provide: MatchService, useValue: matchServiceSpy }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TournamentTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * Test to check if the TournamentTableComponent compiles successfully.
   * This test ensures that the component can be instantiated without errors.
   */
  it('should compile', () => {
    // GIVEN
    // WHEN
    // THEN
    if (!component) throw new Error('Component should be created');
  });

  /**
   * Test to check if the TournamentTableComponent renders the page correctly.
   * This test ensures that key labels and options are present in the DOM.
   */
  it('should render page', () => {
    // GIVEN
    // WHEN
    fixture.detectChanges();
    // THEN
    const compiled = fixture.nativeElement as HTMLElement;
    if (!compiled.textContent?.includes('Tournament')) {
      throw new Error('Page should contain "Tournament" text');
    }
  });

  /**
   * Tests the position column displays correct position icons.
   * 1️⃣ for 1st place, 2️⃣ for 2nd place, 3️⃣ for 3rd place, 4️⃣ for for 4th place.
   */
  it('should display correct position based on ranking', () => {
    // GIVEN
    // WHEN
    matchServiceSpy.matches$.next(TEST_MATCHES);
    fixture.detectChanges();
    // THEN
    const positionCells = fixture.nativeElement.querySelectorAll('td[mat-cell]:first-child') as NodeListOf<HTMLElement>;
    if (positionCells.length !== 4) throw new Error('Should have 4 matches');
    if (positionCells[0].textContent?.trim() !== '1️⃣') throw new Error('First place should have 1️⃣ icon');
    if (positionCells[1].textContent?.trim() !== '2️⃣') throw new Error('Second place should have 2️⃣ icon');
    if (positionCells[2].textContent?.trim() !== '3️⃣') throw new Error('Third place should have 3️⃣ icon');
    if (positionCells[3].textContent?.trim() !== '4️⃣') throw new Error('Fourth place should have 4️⃣ icon');
  });

});
