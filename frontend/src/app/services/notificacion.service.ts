import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  requestPermission(): void {
    if (!('Notification' in window)) {
      console.error('Este navegador no soporta notificaciones de escritorio.');
      return;
    }

    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Permiso para notificaciones concedido.');
      } else if (permission === 'denied') {
        console.log('Permiso para notificaciones denegado.');
      }
    });
  }

  showNotification(title: string, options?: NotificationOptions): void {
    if (Notification.permission === 'granted') {
      new Notification(title, options);
    }
  }
}
