import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Agenda } from './models/agenda';


const url = 'http://localhost:8080';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor( private http: HttpClient ) { }

  agendas_temp: Agenda[] = [
    { id: 1, titulo: 'Hola 1', descripcion: 'es una agenda 1', fecha_creado: new Date().toLocaleString() },
    { id: 2, titulo: 'Hola 2', descripcion: 'es una agenda 2', fecha_creado: new Date().toLocaleString() },
    { id: 3, titulo: 'Hola 3', descripcion: 'es una agenda 3', fecha_creado: new Date().toLocaleString() },
  ]

  agendas: Agenda[] = [];

  selectedAgenda: Agenda = new Agenda();

  ngOnInit(){
    // this.http.get<Agenda[]>('https://jsonplaceholder.typicode.com/todos').subscribe( ( resp ) => {
    //   console.log(resp);
      
    //   this.agendas = resp;
    // });
    this.agendas = this.agendas_temp;
  }

  agregar(){
    const body:Agenda = { titulo: 'Nueva nota', descripcion: 'Nueva descripción'}
    this.http.post<Agenda>('https://jsonplaceholder.typicode.com/todos', body ).subscribe( ( resp ) => {
      this.agendas.push( resp );
    });
  }

  openForEdit( agenda:Agenda ){
    this.selectedAgenda = agenda;
  }

  addOrEdit(){
    if ( this.selectedAgenda.id === 0 ){
      this.selectedAgenda.id = this.agendas.length + 1;
      this.agendas.push( this.selectedAgenda );
    }
    this.selectedAgenda = new Agenda();
  }
  cancel(){
    this.selectedAgenda = new Agenda();
  }

  delete(){
    if ( confirm('are you sure you want to delete it?') ){
      this.agendas = this.agendas.filter( a => a.id !== this.selectedAgenda.id );
      this.selectedAgenda = new Agenda();
    }
  }

  editar(){
    const body:Agenda = { titulo: 'Nueva nota', descripcion: 'Nueva descripción'}
    this.http.put<Agenda>('https://jsonplaceholder.typicode.com/todos', body ).subscribe( ( resp ) => {
      const agenda = this.agendas.find( a => a.id === resp.id );
      agenda.titulo = resp.titulo,
      agenda.descripcion = resp.descripcion
    });
  }

  eliminar(){
    this.http.delete<Agenda>('https://jsonplaceholder.typicode.com/todos').subscribe( ( resp ) => {
      this.agendas = this.agendas.filter( a => a.id !== resp.id );
    });
  }

}
