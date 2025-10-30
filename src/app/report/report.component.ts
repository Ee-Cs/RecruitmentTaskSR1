import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule, MatFabButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

import { Match } from 'models/match';
import { MatchService } from 'services/match-service/match.service';
/**
 * ReportComponent is an Angular component that creates reports.
 */
@Component({
  selector: 'app-report',
  templateUrl: 'report.component.html',
  styleUrl: './report.component.css',
  imports: [MatButtonModule, MatFabButton, MatCardModule, MatIconModule],
})
export class ReportComponent implements OnInit {
  private matchService: MatchService = inject(MatchService);
  matches: Match[] = [];
  /**
   * A component lifecycle hook method.
   * Runs once after Angular has initialized all the component's inputs.
   * @returns void
   */
  async ngOnInit() {
    this.matches = this.matchService.getTournamentMatches();
    pdfMake.vfs = pdfFonts.vfs;
    console.log('🟨ReportComponent.ngOnInit():');
  }
  /**
   * Generates the PDF file.
   * @param content
   * @param action
   * @returns void
   */
  generatePdf(
    action: string
  ): void {
    const documentDefinition = this.createDocumentDefinitionForMatchesAndTeams() as import('pdfmake/interfaces').TDocumentDefinitions;
    const tCreatedPdf = pdfMake.createPdf(documentDefinition);
    switch (action) {
      case 'open':
        tCreatedPdf.open();
        break;
      case 'print':
        tCreatedPdf.print();
        break;
      case 'download':
        tCreatedPdf.download();
        break;
      default:
        tCreatedPdf.open();
        break;
    }
    console.log('🟨ReportComponent.generatePdf(): action[%s]', action);
  }
  /**
   * Creates document definition for matches and teams.
   * @returns TDocumentDefinitions
   */
  private createDocumentDefinitionForMatchesAndTeams() {
    return {
      content: [
        {
          text: 'Matches and Teams Report',
          style: 'header',
          margin: [0, 0, 0, 20],
          alignment: 'center',
        },
        {
          table: {
            body: this.loadMatchTable(),
          },
          alignment: 'justify',
        },
      ],
      info: {
        title: 'Tournament Report',
        author: 'k1729p',
        subject: 'Matches and Teams',
        keywords: 'report',
      },
      styles: {
        header: {
          fontSize: 20,
          bold: true,
        },
        tableHeader: {
          bold: true,
        },
      },
    };
  }
  /**
   * Loads the table with the matches.
   * @returns matchTable
   */
  private loadMatchTable(): (
    | string
    | number
    | boolean
    | Record<string, unknown>
  )[][] {
    type TableCell = string | number | boolean | Record<string, unknown>;
    const matchTable: TableCell[][] = [];
    matchTable.push([
      {
        text: 'Match Name',
        style: 'tableHeader',
        alignment: 'center',
        fillColor: 'bisque',
        rowSpan: 2,
      },
      {
        text: 'Home Team',
        style: 'tableHeader',
        alignment: 'center',
        fillColor: 'honeydew',
        colSpan: 2,
      },
      '',
      {
        text: 'Guest Team',
        style: 'tableHeader',
        alignment: 'center',
        fillColor: 'thistle',
        colSpan: 2,
      },
      '',
    ]);
    matchTable.push([
      '',
      {
        text: 'Name',
        style: 'tableHeader',
        alignment: 'center',
        fillColor: 'honeydew',
      },
      {
        text: 'Score',
        style: 'tableHeader',
        alignment: 'center',
        fillColor: 'honeydew',
      },
      {
        text: 'Name',
        style: 'tableHeader',
        alignment: 'center',
        fillColor: 'thistle',
      },
      {
        text: 'Score',
        style: 'tableHeader',
        alignment: 'center',
        fillColor: 'thistle',
      },
    ]);
    for (const match of this.matches) {
      matchTable.push([
        match.name,
        match.teams[0].name,
        match.teams[0].score,
        match.teams[1].name,
        match.teams[1].score
      ]);
    }
    return matchTable;
  }
}
