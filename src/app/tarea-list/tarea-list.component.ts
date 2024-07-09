import { Component, OnInit } from '@angular/core';
import { TareaService } from '../tarea.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { formatDate } from '@angular/common';

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
  fechaFin?: Date;
  diasPasado?: number;
}

@Component({
  selector: 'app-tarea-list',
  templateUrl: './tarea-list.component.html',
  styleUrls: ['./tarea-list.component.css']
})
export class TareaListComponent implements OnInit {
  tareas: Tarea[] = [];
  displayedColumns: string[] = ['empleado', 'tarea', 'fechaInicio', 'fechaFin', 'diasPasado', 'proyecto'];
  totalTareasPasadas: number = 0;
  form: FormGroup;

  constructor(private tareaService: TareaService, private fb: FormBuilder) {
    this.form = this.fb.group({
      startDate: [''],
      endDate: ['']
    });
  }

  ngOnInit(): void {
    // Inicialización si es necesaria
  }

  onSubmit(): void {
    const startDate = this.formatDate(this.form.value.startDate);
    const endDate = this.formatDate(this.form.value.endDate);
    this.tareaService.getTareas(startDate, endDate).subscribe(data => {
      this.tareas = data.map(tarea => ({
        ...tarea,
        fechaFin: this.calculateEndDate(new Date(tarea.fechaEmpezar), tarea.estimado),
        diasPasado: this.calculateDaysPassed(new Date(tarea.fechaEmpezar), tarea.estimado)
      }));
      this.totalTareasPasadas = this.tareas.length;
    });
  }

  formatDate(date: Date): string {
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }

  calculateEndDate(startDate: Date, days: number): Date {
    let endDate = new Date(startDate);
    let count = 0;
    while (count < days) {
      endDate.setDate(endDate.getDate() + 1);
      if (endDate.getDay() !== 0 && endDate.getDay() !== 6) { // Skip weekends
        count++;
      }
    }
    return endDate;
  }

  calculateDaysPassed(startDate: Date, days: number): number {
    const endDate = this.calculateEndDate(startDate, days);
    const today = new Date();
    if (today > endDate) {
      const diffTime = Math.abs(today.getTime() - endDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  }
}
