import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
/**
 * Unit tests for the HomeComponent.
 * This file contains tests to ensure that the component compiles correctly and behaves as expected.
 */
describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  /**
   * Set up the testing module for HomeComponent.
   * This function initializes the testing environment and compiles the component.
   */
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HomeComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  /**
   * Test to check if the HomeComponent compiles successfully.
   * This test ensures that the component can be instantiated without errors.
   */
  it('should compile', () => {
    // GIVEN
    // WHEN
    // THEN
    expect(component).toBeTruthy();
  });
  /**
   * Test to check if the HomeComponent renders the page correctly.
   * This test ensures that key labels and options are present in the DOM.
   */
  it('should render page', () => {
    // GIVEN
    // WHEN
    fixture.detectChanges();
    // THEN
    const compiled = fixture.nativeElement as HTMLElement;
    const img = compiled.querySelector('img');
    if (!img) throw new Error('Image element should be present');
    const src = img.getAttribute('src') ?? '';
    if (!src.includes('logo.png')) throw new Error('Image src should contain logo.png');
  });
});
