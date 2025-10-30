import { Component, InjectionToken, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

import { MatchService } from 'services/match-service/match.service';
/**
 * Injection token for browser storage.
 * This token is used to inject the browser's localStorage into services that require it.
 */
export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage,
});
/**
 * A component for settings page.
 */
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatRadioModule,
    MatSelectModule,
  ],
})
export class SettingsComponent implements OnInit {
  storage = inject<Storage>(BROWSER_STORAGE);
  matchService = inject(MatchService);

  datasetTypeArray = ['S', 'F', 'E'];
  originalDatasetType = 'S';
  private formBuilder = inject(FormBuilder);
  settingsForm = this.formBuilder.group({
    datasetTypeSelect: 'S',
  });
  /**
   * A component lifecycle hook method.
   * Runs once after Angular has initialized all the component's inputs.
   *
   * https://angular.dev/guide/components/lifecycle#ngoninit
   * @returns void
   */
  ngOnInit() {
    const datasetType = this.storage.getItem('datasetType') as string;
    this.settingsForm.controls.datasetTypeSelect.setValue(datasetType);
    this.originalDatasetType = datasetType;
    console.log('🟪SettingsComponent.ngOnInit(): datasetType[%s]', datasetType);
  }
  /**
   * Initialises with the selected dataset.
   *
   * @returns void
   */
  initialiseDataset() {
    const datasetType = this.settingsForm.controls.datasetTypeSelect.value as string;
    this.matchService.loadDataset(datasetType);
    this.originalDatasetType = datasetType;
    console.log('🟪SettingsComponent.initialiseDataset(): datasetType[%s]', datasetType);
  }
  /**
   * Describes the dataset type.
   *
   * @param datasetType 
   * @returns void
   */
  describeDatasetType(datasetType: string) {
    switch (datasetType) {
      case 'F':
        return 'Full';
      case 'E':
        return 'Empty';
      default: //'S'
        return 'Standard';
    }
  }

}
