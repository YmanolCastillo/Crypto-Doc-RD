import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AlertController,
  LoadingController,
  NavController,
  Platform,
} from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  @ViewChild('filePicker', { static: false })
  filePickerRef: ElementRef<HTMLInputElement>;
  photo: SafeResourceUrl;
  isDesktop: boolean;
  constructor(
    private navCtrl: NavController,
    private platform: Platform,
    private sanitizer: DomSanitizer,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}
  ngOnInit() {
    if (
      (this.platform.is('mobile') && this.platform.is('hybrid')) ||
      this.platform.is('desktop')
    ) {
      this.isDesktop = true;
    }
  }

  async getPicture() {
    if (
      !Capacitor.isPluginAvailable('Camera') ||
      (this.isDesktop && 'gallery')
    ) {
      this.filePickerRef.nativeElement.click();
      return;
    }

    const image = await Camera.getPhoto({
      quality: 100,
      width: 400,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
    });

    this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(
      image && image.dataUrl
    );
  }
  onFileChoose(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    const pattern = /image-*/;
    const reader = new FileReader();

    if (!file.type.match(pattern)) {
      console.log('File format not supported');
      return;
    }

    reader.onload = () => {
      this.photo = reader.result.toString();
    };
    reader.readAsDataURL(file);
  }
  async convertImage() {
    const loading = await this.loadingController.create({
      message: 'Procesando imagen...',
      duration: 4000,
      spinner: 'circles',
    });

    loading.present();
    setTimeout(() => {
      this.onImageLoaded();
    }, 5000);
  }

  onGoToPDF() {
    this.navCtrl.navigateForward('tabs/tab2');
  }
  async onImageLoaded() {
    const alert = await this.alertController.create({
      header: '¡Todo listo!',
      subHeader: 'Important message',
      message: 'La imagen ha sido convertida correctamente',
      buttons: [
        {
          text: 'Ver imagen',
          role: 'confirm',
          handler: () => {
            this.onGoToPDF();
          },
        },
      ],
    });

    await alert.present();
  }
}
