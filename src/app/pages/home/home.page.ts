import { Component, OnInit, NgZone } from '@angular/core';
import { RealtimeService } from '../../services/realtime.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EventsService } from '../../services/events.service';
import { AttendeesService } from '../../services/attendees.service';
import {
  Barcode,
  BarcodeScanner,
  LensFacing,
} from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { DialogService } from '../../core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  actividades: any[] = [];
  user: any;
  newData: string = '';
  syncedData: any;
  asistentes: any[] = [];  // Para almacenar la lista de asistentes
  nuevoAsistente = { nombre: '', email: '', registroFecha: '' };
  eventId: string = '';
  attendees: any[] = [];
  userData: any;
  events: any[] = [];
  asistentesPorEvento: { [eventId: string]: { asistidos: any[], pendientes: any[] } } = {};  
  selectedEventId: string = '';
  //Para escanear codigos QR
  isSupported = false;
  public isPermissionGranted = false;
  barcodes: Barcode[] = [];
  public formGroup = new UntypedFormGroup({
    formats: new UntypedFormControl([]),
    lensFacing: new UntypedFormControl(LensFacing.Back),
    googleBarcodeScannerModuleInstallState: new UntypedFormControl(0),
    googleBarcodeScannerModuleInstallProgress: new UntypedFormControl(0),
  });
  constructor(private eventsService: EventsService,
    private realtimeService: RealtimeService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private attendeesService: AttendeesService,
    private alertController: AlertController,
    private readonly dialogService: DialogService,
    private readonly ngZone: NgZone,
    private router: Router) { 
      this.userData = this.authService.getUserDataFromToken();
    }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id')!;
    // Suscribirse a los cambios en los asistentes del evento en tiempo real
    this.loadDataEvents();
    this.realtimeService.getAssistance(this.eventId).subscribe((data) => {
      if (data) {
        this.attendees = Object.values(data);  // Transformar el objeto de datos en un array
      }
    });
    
    if (this.userData) {
      console.log('Datos del usuario:', this.userData);  // Mostrar los datos del payload
    } else {
      console.log('No se pudo obtener los datos del usuario');
    }

    //PARA EL CODIGO QR
    /*BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });*/
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    }).catch(error => {  //catch de errores
      console.error('Error checking barcode scanner support:', error);
    });
    BarcodeScanner.checkPermissions().then((result) => {
      this.isPermissionGranted = result.camera === 'granted';
    }).catch(error => {  //catch para manejar errores
      console.error('Error checking permissions:', error);
    });
    BarcodeScanner.removeAllListeners().then(() => {
      BarcodeScanner.addListener(
        'googleBarcodeScannerModuleInstallProgress',
        (event) => {
          this.ngZone.run(() => {
            console.log('googleBarcodeScannerModuleInstallProgress', event);
            const { state, progress } = event;
            this.formGroup.patchValue({
              googleBarcodeScannerModuleInstallState: state,
              googleBarcodeScannerModuleInstallProgress: progress,
            });
          });
        },
      );
    });
  }

async loadDataEvents(){
  this.eventsService.getEventsRealTimett().subscribe((data) => {
    if (data) {
      this.events = Object.values(data);  // Transformar el objeto de datos en un array
      console.log(this.events);
      if (!this.selectedEventId && this.events.length > 0) {
        this.selectedEventId = this.events[0].id;
        localStorage.setItem('selectedEventId', this.selectedEventId); 
      }
      this.asistentesPorEvento = {};////
      this.events.forEach(event => {
        console.log('este es id: '+event.id);
        this.attendeesService.getAssistantsRealTime(event.id).subscribe((asistentesData) => {
          //console.log(asistentesData);
          if (asistentesData) {
            // Filtrar los asistentes en base a su status
            const asistidos = Object.values(asistentesData).filter(
              (asistente: any) => asistente.status === 'Asistido'
            );
            const pendientes = Object.values(asistentesData).filter(
              (asistente: any) => asistente.status === 'Invitado'
            );

            // Guardar los asistentes en el objeto por evento
            this.asistentesPorEvento[event.id] = {
              asistidos: asistidos,
              pendientes: pendientes
            };
          }
        });
      });
    }
  });
}


// Método para manejar el clic en un evento
selectEventId(eventId: string): void {
  if (this.selectedEventId !== eventId) {
    this.selectedEventId = eventId; 
    localStorage.setItem('selectedEventId', eventId);
  } else {
    this.selectedEventId = '';
    localStorage.removeItem('selectedEventId');
  }
}

// Verificar si el evento está seleccionado
isSelected(eventId: string): boolean {
  console.log('Checking selection for event:', eventId, 'selectedEventId:', this.selectedEventId);
  return this.selectedEventId === eventId;
}

public async startScan(): Promise<void> {
  const formats = this.formGroup.get('formats')?.value || [];
  const lensFacing = this.formGroup.get('lensFacing')?.value || LensFacing.Back;
  const element = await this.dialogService.showModal({
    component: BarcodeScanningModalComponent,
    cssClass: 'barcode-scanning-modal',
    showBackdrop: false,
    componentProps: { formats, lensFacing },
  });

  element.onDidDismiss().then((result) => {
    const barcode: Barcode | undefined = result.data?.barcode;
    if (barcode) {
      this.barcodes = [barcode];
      const { IdEvento, IdAsistente } = this.parseQRCodeData(barcode.displayValue);
      console.log('IdEvento:', IdEvento, 'IdAsistente:', IdAsistente);
      const infoAsistente = { status: 'Asistido' };
      this.attendeesService.updateAssistant(IdEvento, IdAsistente, infoAsistente);
    }
  });
}



private parseQRCodeData(data: string): { IdEvento: string, IdAsistente: string } {
  // Suponiendo que el QR tiene formato 'IdEvento:xxxx;IdAsistente:yyyy'
  const params = data.split(';');
  const idEvento = params.find((item) => item.startsWith('IdEvento:'))?.split(':')[1] || '';
  const idAsistente = params.find((item) => item.startsWith('IdAsistente:'))?.split(':')[1] || '';

  return { IdEvento: idEvento, IdAsistente: idAsistente };
}

  toggleDarkMode = () => {
    document.documentElement.classList.toggle('ion-palette-dark');
  }
  goToEvents() {
    // Usar state para pasar ambos valores
    this.router.navigate(['/eventos']

    );
}
}
