import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Tarea {
  idTarea: number;
  descripcion: string;
  fechaEmpezar: Date;
  estimado: number;
  estado: string;
  empleado: {
    nombre: string;
    apellido: string;
  };
  proyecto: {
    nombreProyecto: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TareaService {
  private apiUrl = 'https://backendminicore-production.up.railway.app/tareas/pasadas-estimado';

  constructor(private http: HttpClient) { }

  getTareas(startDate: string, endDate: string): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(`${this.apiUrl}?startDate=${startDate}&endDate=${endDate}`);
  }
}
