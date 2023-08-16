import { Component, OnInit } from '@angular/core';
import { ColumnItem } from 'src/Core/interfaces/col-meter-table.interface';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { EndPointGobalService } from '@shared/services/end-point-gobal.service';
import { cpiShema } from 'src/Core/interfaces/cpi.interface';
import { NotificationService } from '@shared/services/notification.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-cpi',
  templateUrl: './cpi.component.html',
  styleUrls: ['./cpi.component.css']
})
export class cpiComponent implements OnInit {
  isVisible = false;
  CPIIsDisable: boolean = false;
  listOfData: cpiShema[] = [];
  validateForm!: FormGroup;
  provider!: cpiShema;

  url = {
    get: 'get-cpi',
    post: 'cpi',
    delete: 'cpi',
    update: 'cpi',
  };
  EmptyForm =this.fb.group({
    month: ['', [Validators.required]],
    year: ['', [Validators.required]],
    value: ['', [Validators.required]],
  })
  constructor(
    private globalService: EndPointGobalService,
    private fb: FormBuilder,
    private nzMessageService: NzMessageService,
    private notificationService: NotificationService,

  ) { }

  ngOnInit(): void {
    console.log("---------------------------" ,this.listOfData);
    this.Getcpi(1, false);
    this.validateForm = this.EmptyForm;
  }


  updateTable(list: cpiShema){
    this.listOfData = [... this.listOfData, list];
  }


  Getcpi(estado: number, switched: boolean){
    if(switched){
      if((!this.CPIIsDisable) && estado === 0){
        this.CPIIsDisable = true;
      }else{
        this.CPIIsDisable = false;
      }
    }

    this.globalService.GetId(this.url.get, estado).subscribe(
      (result:any) => {
        console.log("+++++++++++++++++++++++++++++++", result);
        this.listOfData = result;
      }
    );
  }

  disableClient(CPI: cpiShema, estado : number){
    let newEstado = Boolean(estado);
    this.globalService.Patch(this.url.update, CPI.id, {estado: newEstado}).subscribe(
      result => {
        if(!result){
          if(estado === 1){
            this.Getcpi(0, false);
          }else{
            this.Getcpi(1, false);
          }

        }
      }
    );
  }
  cancel(): void {
    this.nzMessageService.info('click cancel');
  }


  listOfColumns: ColumnItem[] = [
    {
      name: 'Mes',
      sortOrder: null,
      sortFn: (a: cpiShema, b: cpiShema) => a.month.localeCompare(b.month),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: string[], item: cpiShema) => list.some(month => item.month.indexOf(month) !== -1)
    },
    {
      name: 'Año',
      sortOrder: null,
      sortFn: (a: cpiShema, b: cpiShema) => a.year - b.year,
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: number[], item: cpiShema) => list.includes(item.year)
    },
    {
      name: 'Valor',
      sortOrder: null,
      sortFn: (a: cpiShema, b: cpiShema) => a.value - b.value,
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: number[], item: cpiShema) => list.includes(item.value)
    }
  ];

}