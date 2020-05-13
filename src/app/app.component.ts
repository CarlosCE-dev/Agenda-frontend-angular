import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Agenda } from './models/agenda';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor( private http: HttpClient ) { }

  agendas_temp: Agenda[] = [
    { id: 1, titulo: 'Hola 1', descripcion: 'es una agenda 1', fecha_creado: new Date().toLocaleString(), status: true },
    { id: 2, titulo: 'Hola 2', descripcion: 'es una agenda 2', fecha_creado: new Date().toLocaleString(), status: false },
    { id: 3, titulo: 'Hola 3', descripcion: 'es una agenda 3', fecha_creado: new Date().toLocaleString(), status: true },
  ]

  agendas: Agenda[] = [];

  selectedAgenda: Agenda = new Agenda();

  ngOnInit(){
    this.http.get<Agenda[]>('http://192.168.0.7:62483/api/agenda').subscribe( ( resp ) => {
      this.agendas = resp;
    });
  }

  agregar(){
    this.http.post<Agenda>('http://192.168.0.7:62483/api/agenda/create', this.selectedAgenda ).subscribe( ( resp ) => {
      this.agendas.push( resp );
    });
  }

  openForEdit( agenda:Agenda ){
    this.selectedAgenda = agenda;
  }

  addOrEdit(){
    if ( this.selectedAgenda.id === 0 ){
     this.agregar();
    } else {
      this.editar();
    }
    this.selectedAgenda = new Agenda();
  }
  cancel(){
    this.selectedAgenda = new Agenda();
  }

  completado(){
    const body = { id: this.selectedAgenda.id, status: true }
    this.http.post<Agenda>('http://192.168.0.7:62483/api/agenda/status', body ).subscribe( ( resp ) => {
      const agenda = this.agendas.find( a => a.id === this.selectedAgenda.id );
      agenda.status = true;
    });
  }

  delete(){
    const body = {}
    if ( confirm('are you sure you want to delete it?') ){
      this.http.post<Agenda>(`http://192.168.0.7:62483/api/agenda/delete/${ this.selectedAgenda.id }`, body ).subscribe( ( resp ) => {
        console.log(this.selectedAgenda);
        
      this.agendas = this.agendas.filter( a => a.id !== this.selectedAgenda.id );
     
      this.selectedAgenda = new Agenda();
      });
    }
  }

  editar(){
    this.http.post<Agenda>('http://192.168.0.7:62483/api/agenda/edit', this.selectedAgenda ).subscribe( ( resp ) => {
      const agenda = this.agendas.find( a => a.id === resp.id );
      agenda.titulo = resp.titulo,
      agenda.descripcion = resp.descripcion
    });
  }


}
