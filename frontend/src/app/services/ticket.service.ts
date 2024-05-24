import { HttpClient,HttpParams  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/environment';
import { Ticket } from '../interfaces/ticket.interface';



@Injectable({
    providedIn: 'root'
  })export class TicketService {
    private apiUrl: string;
  
    constructor(private http: HttpClient) {
      this.apiUrl = `${environment.endpoint}api/v1/ticket`;
    }
  
    getListTickets(): Observable<Ticket[]> {
      return this.http.get<Ticket[]>(this.apiUrl);
    }
    getListTicketPrestamo(idprestamo: number): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/prestamo/${idprestamo}`);
    }
  
    getTicket(id: number): Observable<Ticket> {
      return this.http.get<Ticket>(`${this.apiUrl}/${id}`);
    }
  
    saveTicket(ticket: Ticket): Observable<Ticket> {
      return this.http.post<Ticket>(this.apiUrl, ticket);
    }
  
    updateTicket(id: number, ticket: Ticket): Observable<Ticket> {
      return this.http.put<Ticket>(`${this.apiUrl}/${id}`, ticket);
    }
  
    deleteTicket(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
  
    searchTicket(searchTerm: string): Observable<Ticket[]> {
      const params = new HttpParams().set('searchTerm', searchTerm);
      return this.http.get<Ticket[]>(`${this.apiUrl}/search/searchTerm=`, { params });
    }
  }
  