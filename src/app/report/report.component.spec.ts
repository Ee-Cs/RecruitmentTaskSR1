import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import pdfMake from 'pdfmake/build/pdfmake';

import { ReportComponent } from './report.component';
import { MatchService } from 'services/match-service/match.service';
import { TEST_MATCHES } from 'testing/test-data';
/**
 * Unit tests for the ReportComponent.
 * This file contains tests to ensure that the component compiles correctly.
 */
describe('ReportComponent', () => {
  let component: ReportComponent;
  let fixture: ComponentFixture<ReportComponent>;
  let matchServiceSpy: jasmine.SpyObj<MatchService>;

  /**
   * Set up the testing module for ReportComponent.
   * This function initializes the testing environment and compiles the component.
   */
  beforeEach(async () => {
    matchServiceSpy = jasmine.createSpyObj('MatchService', ['getTournamentMatches']);
    matchServiceSpy.getTournamentMatches.and.callFake(() => {
      return TEST_MATCHES;
    });
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 1 }),
            snapshot: { paramMap: { get: () => 1 } },
          },
        },
        { provide: MatchService, useValue: matchServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * Test to check if the ReportComponent compiles successfully.
   * This test ensures that the component can be instantiated without errors.
   */
  it('should compile', () => {
    // GIVEN
    // WHEN
    // THEN
    expect(component).toBeTruthy();
  });

  /**
   * Test to check if the reports page is rendered.
   */
  it('should render page', () => {
    // GIVEN
    // WHEN
    fixture.detectChanges();
    // THEN
    const compiled = fixture.nativeElement as HTMLElement;
    // Title
    expect(compiled.textContent).toContain('Reports');
    // Buttons
    const openBtn = Array.from(compiled.querySelectorAll('button')).find(btn => btn.textContent?.includes('Open PDF'));
    expect(openBtn).toBeTruthy();
    const printBtn = Array.from(compiled.querySelectorAll('button')).find(btn => btn.textContent?.includes('Print PDF'));
    expect(printBtn).toBeTruthy();
    const downloadBtn = Array.from(compiled.querySelectorAll('button')).find(btn => btn.textContent?.includes('Download PDF'));
    expect(downloadBtn).toBeTruthy();
  });

  /**
   * Test to check if the report is created.
   */
  it('should create PDF', () => {
    // GIVEN
    const openSpy = jasmine.createSpy('open');
    const document: PDFKit.PDFDocument = {} as PDFKit.PDFDocument;
    spyOn(pdfMake, 'createPdf').and.returnValue({
      open: openSpy,
      print: () => undefined,
      download: () => undefined,
      getBlob: () => undefined,
      getBase64: () => undefined,
      getBuffer: () => undefined,
      getDataUrl: () => undefined,
      getStream: () => document
    });
    fixture.detectChanges();
    const openBtn = fixture.debugElement.queryAll(By.css('button')).find(btn =>
      btn.nativeElement.textContent.includes('Open PDF')
    );
    expect(openBtn).toBeTruthy();
    // WHEN
    openBtn!.nativeElement.click();
    // THEN
    expect(pdfMake.createPdf).toHaveBeenCalled();
    expect(openSpy).toHaveBeenCalled();

    const docDef = (pdfMake.createPdf as jasmine.Spy).calls.mostRecent().args[0];
    const reportTitleActual = docDef.content[0].text;
    expect(reportTitleActual).toBe('Matches and Teams Report');

    const tableActual = docDef.content[1].table.body;
    expect(tableActual[0][0].text).toBe('Match Name');
    expect(tableActual[0][1].text).toBe('Home Team');
    expect(tableActual[0][3].text).toBe('Guest Team');
    expect(tableActual[1][1].text).toBe('Name');
    expect(tableActual[1][2].text).toBe('Score');
    expect(tableActual[1][3].text).toBe('Name');
    expect(tableActual[1][4].text).toBe('Score');

    for (let i = 0; i < TEST_MATCHES.length; i++) {
      const k = i + 2;
      expect(tableActual[k][0]).toBe(TEST_MATCHES[i].name);
      expect(tableActual[k][1]).toBe(TEST_MATCHES[i].teams[0].name);
      expect(tableActual[k][2]).toBe(TEST_MATCHES[i].teams[0].score);
      expect(tableActual[k][3]).toBe(TEST_MATCHES[i].teams[1].name);
      expect(tableActual[k][4]).toBe(TEST_MATCHES[i].teams[1].score);
    }
  });
});
