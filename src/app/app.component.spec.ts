import { ActivatedRoute, Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatMenuHarness, MatMenuItemHarness } from '@angular/material/menu/testing';
import { of } from 'rxjs';
import { AppComponent, MENU_ITEMS } from './app.component';
/**
 * Unit tests for the AppComponent.
 * This file contains tests to ensure that the component compiles correctly,
 * has the correct title, renders the title in the template, renders menu items,
 * and handles menu actions with navigation.
 *
 * @returns void
 */
describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let loader: HarnessLoader;
  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            snapshot: { paramMap: { get: () => null } },
          },
        },
        { provide: Router, useValue: routerSpy }
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });
  /**
   * Test to check if the AppComponent compiles successfully.
   * This test ensures that the component can be instantiated without errors.
   *
   * @returns void
   */
  it('should create the app', () => {
    // GIVEN
    // WHEN
    // THEN
    expect(component).toBeTruthy();
  });
  /**
   * Test to check if the AppComponent has the correct title.
   * This test verifies that the title property of the component is set to 'RecruitmentTaskS2'.
   *
   * @returns void
   */
  it(`should have the 'RecruitmentTaskSR1' title`, async () => {
    // GIVEN
    // WHEN
    // THEN
    expect(component.title).toEqual('RecruitmentTaskSR1');
  });
  /**
   * Test to check if menuHandler navigates to expected path when menu with given label is clicked.
   */
  Object.entries(MENU_ITEMS).forEach(([key, menuItem]) =>
    it(`should navigate to path '${menuItem.path}' when menu '${menuItem.label}' is clicked`, () => {
      // GIVEN
      // WHEN
      component.menuHandler(menuItem);
      // THEN
      expect(routerSpy.navigate).toHaveBeenCalledWith([menuItem.path], { relativeTo: jasmine.anything() });
      console.debug("key[" + key + "]");
    })
  );
  /**
   * Test to check if all menu items are rendered.
   * This test ensures that the menu contains all expected items.
   */
  it('should render all menu items using harness', async () => {
    // GIVEN
    const mainMenuHarness = await loader.getHarness(MatMenuHarness);
    // WHEN
    await mainMenuHarness.open();
    // THEN
    const menuItemHarnesses: MatMenuItemHarness[] = await mainMenuHarness.getItems();
    expect(menuItemHarnesses.length).toBe(5);
    const menuTexts: string[] = await Promise.all(menuItemHarnesses.map(item => item.getText()));
    expect(menuTexts[0]).toContain(MENU_ITEMS['Home'].label);
    expect(menuTexts[1]).toContain(MENU_ITEMS['Scoreboard'].label);
    expect(menuTexts[2]).toContain(MENU_ITEMS['Tournament'].label);
    expect(menuTexts[3]).toContain(MENU_ITEMS['CreatePDFReports'].label);
    expect(menuTexts[4]).toContain(MENU_ITEMS['Settings'].label);
  });
});
