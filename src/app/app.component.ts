import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, TranslateModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  tasks: [] = [];

  constructor(private translate: TranslateService) {
    this.translate.addLangs(['en', 'es']);

    const savedLang = localStorage.getItem('lang');
    const browserLang = this.translate.getBrowserLang();
    const defaultLang = savedLang || (browserLang !== 'es' && browserLang !== 'en' ? 'es' : browserLang);

    this.translate.setDefaultLang(defaultLang);
    this.translate.use(defaultLang);
  }
}
