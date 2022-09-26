import { Component } from '@angular/core';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  date: number = Date.now();

  constructor() {}

  onOpenPDF() {
    Browser.open({
      url: 'http://nolimstudios.com/wp-content/uploads/2022/09/Crypto-Doc-1.pdf',
    });
  }
}
