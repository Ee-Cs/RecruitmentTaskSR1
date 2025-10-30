import { Component, InjectionToken, OnInit, isDevMode } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

/**
 * Injection token for browser storage.
 * This token is used to inject the browser's localStorage into services that require it.
 */
export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage,
});
/**
 * A component for home page.
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true,
  imports: [
    MatCardModule,
  ],
})
export class HomeComponent implements OnInit {
  logo = '';
  /**
   * A component lifecycle hook method.
   * Runs once after Angular has initialized all the component's inputs.
   * @returns void
   */
  ngOnInit() {
    if(isDevMode()) {
      this.logo = 'http://localhost:8080/images/logo.png';
     } else {
      this.logo = 'https://ee-cs.github.io/RecruitmentTaskSR1/images/logo.png'
    }
    console.log('🟫HomeComponent.ngOnInit():');
  }
}
