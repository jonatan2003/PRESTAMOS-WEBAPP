import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from './notificacion.service'; // Importa el nuevo servicio
import { environment } from '../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: Socket;

  constructor(private toastr: ToastrService, private notificationService: NotificationService) {
    this.socket = io(`${environment.endpoint}`, { transports: ['websocket'] });

    this.notificationService.requestPermission();
  }

  listen(eventName: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: any) => {
        subscriber.next(data);

        this.notificationService.showNotification('Nuevo evento', {
          body: JSON.stringify(data),
          icon: 'ruta/a/icono.png', // opcional
        });
      });
    });
  }
}
