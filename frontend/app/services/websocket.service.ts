import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: Socket;

  constructor(private toastr: ToastrService) {
    // Replace 'http://localhost:3000' with the URL of your WebSocket server
    this.socket = io(`${environment.endpoint}` , { transports: ['websocket'] } ); // Actualiza esta URL según la configuración del servidor

   
  }

  listen(eventName: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: any) => {
        subscriber.next(data);
      });
    });
  }

}