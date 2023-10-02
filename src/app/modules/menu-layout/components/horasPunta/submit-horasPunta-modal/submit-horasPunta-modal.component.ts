import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EndPointGobalService } from '@shared/services/end-point-gobal.service';
import { NotificationService } from '@shared/services/notification.service';
import { horasPuntaShema } from 'src/Core/interfaces/horasPunta.interface';

@Component({
  selector: 'app-submit-horasPunta-modal',
  templateUrl: './submit-horasPunta-modal.component.html',
  styleUrls: ['./submit-horasPunta-modal.component.css']
})
export class SubmithorasPuntaModalComponent implements OnInit {
  @Output() DataUpdated: EventEmitter<horasPuntaShema> = new EventEmitter<horasPuntaShema>();
  @Input() dataPosition!: horasPuntaShema;

  isVisible = false;
  horasPuntaIsDisable: boolean = false;
  listOfData: horasPuntaShema[] = [];
  validateForm!: FormGroup;
  newhorasPunta!: horasPuntaShema;

  url = {
    get: 'get-horasPunta',
    post: 'horasPunta',
    delete: 'horasPunta',
    update: 'horasPunta',
  };
  EmptyForm = this.fb.group({
    fechaInicial: ['', [Validators.required]],
    fechaFinal: ['', [Validators.required]],
    horas: ['', [Validators.required]],
    multiplicador: ['', [Validators.required]],

  });

  constructor(
    private globalService: EndPointGobalService,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {this.validateForm = this.fb.group({
    fechaInicial: ['', [Validators.required]],
    fechaFinal: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    horas : ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    multiplicador : ['', [Validators.required, Validators.pattern(/^\d+$/)]],
  });}

  submitForm(): void {
    if (!this.dataPosition) {

      this.submitPostForm();
    } else {

      this.submitUpdateForm();
    }
  }



  submitPostForm() {
    if (this.validateForm.valid) {
      this.newhorasPunta = {
        ...this.validateForm.value,
        Estado: true
      };
      this.isVisible = false;
      this.globalService.Post(this.url.post, this.newhorasPunta).subscribe(
        (result: any) => {
          console.log("----------", result);
          if (result) {
            this.DataUpdated.emit(result);
            this.notificationService.createMessage(
              'success',
              'La acción se ejecutó con éxito 😎'
            );
          } else {
            this.notificationService.createMessage(
              'error',
              'La acción falló 😓'
            );
          }
        }
      );
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  submitUpdateForm() {
    if (this.validateForm.valid) {
      this.newhorasPunta = {
        ...this.validateForm.value,
        Estado: true
      };

      this.isVisible = false;
      this.globalService
        .Patch(this.url.post, this.dataPosition.Id, this.newhorasPunta)
        .subscribe(
          (result: any) => {
            if (!result){
            this.dataPosition.fechaInicial = this.newhorasPunta.fechaInicial;
            this.dataPosition.fechaFinal = this.newhorasPunta.fechaFinal;
            this.dataPosition.horas= this.newhorasPunta.horas;
            this.dataPosition.multiplicador= this.newhorasPunta.multiplicador;

            this.notificationService.createMessage(
              'success',
              'La acción se ejecutó con éxito 😎'
            );
          } else {
            this.notificationService.createMessage(
              'error',
              'La acción falló 😓'
            );
          }
        }
      );
  } else {
    Object.values(this.validateForm.controls).forEach((control) => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });
  }
  }

  editableFrom(data: horasPuntaShema): void{
    //console.log(data);
    let fechaInicialParts = data.fechaInicial.split('-').map(part => parseInt(part, 10));
    let fechaFinalParts = data.fechaFinal.split('-').map(part => parseInt(part, 10));

    let fechaInicialUTC = new Date(fechaInicialParts[0], fechaInicialParts[1] - 1, fechaInicialParts[2]);
    let fechaFinalUTC = new Date(fechaFinalParts[0], fechaFinalParts[1] - 1, fechaFinalParts[2]);

    this.validateForm = this.fb.group({
      fechaInicial: [fechaInicialUTC, [Validators.required]],
      fechaFinal: [fechaFinalUTC, [Validators.required]],
      horas: [data.horas.toString(), [Validators.required]],
      multiplicador: [data.multiplicador.toString(), [Validators.required]],
    })
    console.log(this.validateForm.value);
  }

  fullSchema(){
    this.newhorasPunta = {
      ... this.validateForm.value,
      Estado: true
    }
  }

  updateMainTable(): void{
    this.dataPosition = {
      Id: this.dataPosition.Id,
      ... this.validateForm.value,
      Estado: this.dataPosition.Estado
    }
  }

  showModal(): void {
    this.isVisible = true;
    if(!this.dataPosition){
      this.CleanForm();

    }else{
      this.editableFrom(this.dataPosition);
    }
  }

  handleOk(): void {
    //console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    //console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  CleanForm(){
    this.validateForm = this.fb.group({
      fechaInicial: ['', [Validators.required]],
      fechaFinal: ['', [Validators.required]],
      horas: ['', [Validators.required]],
      multiplicador: ['', [Validators.required]],
    })
  }
}
