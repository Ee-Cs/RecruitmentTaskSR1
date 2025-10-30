import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsComponent } from './settings.component';
import { MatchService } from 'services/match-service/match.service';

/**
 * Unit tests for the SettingsComponent.
 * This file contains tests to ensure that the component compiles correctly and behaves as expected.
 */
describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let matchServiceSpy: jasmine.SpyObj<MatchService>;
  let fixture: ComponentFixture<SettingsComponent>;
  /**
   * Set up the testing module for SettingsComponent.
   * This function initializes the testing environment and compiles the component.
   */
  beforeEach(() => {
    matchServiceSpy = jasmine.createSpyObj('MatchService', ['loadDataset']);
    TestBed.configureTestingModule({
      imports: [SettingsComponent],
      providers: [
        { provide: MatchService, useValue: matchServiceSpy }
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  /**
   * Test to check if the SettingsComponent compiles successfully.
   * This test ensures that the component can be instantiated without errors.
   */
  it('should compile', () => {
    // GIVEN
    // WHEN
    // THEN
    expect(component).toBeTruthy();
  });
  /**
   * Test to check if the SettingsComponent renders the page correctly.
   * This test ensures that key labels and options are present in the DOM.
   */
  it('should render page', () => {
    // GIVEN
    // WHEN
    fixture.detectChanges();
    // THEN
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Settings');
    expect(compiled.textContent).toContain('Dataset');
    expect(compiled.textContent).toContain('Standard');
    expect(compiled.textContent).toContain('Full');
    expect(compiled.textContent).toContain('Empty');
    expect(compiled.textContent).toContain('Load dataset');
  });

  /**
    * Test to check if the datasetTypeSelect method is called
    * when the full dataset is selected and the button is clicked.
    * This test simulates a click on the "Load dataset" button and checks the spy.
    */
  it('should select full dataset', () => {
    // GIVEN
    fixture.detectChanges();
    const button = fixture.debugElement.queryAll(By.css('button')).find(btn =>
      btn.nativeElement.textContent.includes('Load dataset')
    );
    expect(button).toBeTruthy();
    window.localStorage.setItem('datasetType', 'S');
    component.settingsForm.controls['datasetTypeSelect'].setValue('F');
    fixture.detectChanges();
    // WHEN
    button!.nativeElement.click();
    // THEN
    expect(matchServiceSpy.loadDataset).toHaveBeenCalled();
    // reset storage
    window.localStorage.setItem('datasetType', 'S');
  });
  /**
    * Test to check if the datasetTypeSelect method is called
    * when the empty dataset is selected and the button is clicked.
    * This test simulates a click on the "Load dataset" button and checks the spy.
    */
  it('should select empty dataset', () => {
    // GIVEN
    fixture.detectChanges();
    const button = fixture.debugElement.queryAll(By.css('button')).find(btn =>
      btn.nativeElement.textContent.includes('Load dataset')
    );
    expect(button).toBeTruthy();
    window.localStorage.setItem('datasetType', 'F');
    component.settingsForm.controls['datasetTypeSelect'].setValue('E');
    fixture.detectChanges();
    // WHEN
    button!.nativeElement.click();
    // THEN
    expect(matchServiceSpy.loadDataset).toHaveBeenCalled();
    // reset storage
    window.localStorage.setItem('datasetType', 'S');
  });
  /**
     * Test to check if the button is disabled and the datasetTypeSelect method is not called.
     * This test simulates a click on the "Load dataset" button and checks the spy.
     */
  it('should not select standard dataset twice', () => {
    // GIVEN
    window.localStorage.setItem('datasetType', 'S');
    component.settingsForm.controls['datasetTypeSelect'].setValue('S');
    component.ngOnInit();
    fixture.detectChanges();
    const button = fixture.debugElement.queryAll(By.css('button')).find(btn =>
      btn.nativeElement.textContent.includes('Load dataset')
    );
    expect(button).toBeTruthy();
    // WHEN
    // THEN
    expect(button!.nativeElement.disabled).toBeTruthy();
    expect(matchServiceSpy.loadDataset).not.toHaveBeenCalled();
  });
});
