import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  num : number = 1;
  counter = Array;
  nodeNumber = 1;


  edgeNumber: number[] = [];

  edgeKeys: string[] = [];

  data: object[] = [];

  links: object[] = [];

  constructor(private fb: FormBuilder) {}


  edgeObject: Object = {};

  edgeGroup: any;

  formGroup = this.fb.group({
    subject: [''],
    nodeFormArray: this.fb.array([
      this.fb.control('')
    ])
  });


  filteredOptions1!: Observable<string[]>;
  filteredOptions2!: Observable<string[]>;
  filteredOptions3!: Observable<string[]>;
  subjectOptions: string[] = ['One', 'Two', 'Three'];
  nodeOptions: string[] = ['Four','Five','Six','Seven'];
  edgeOptions: string[] = [];

  ngOnInit() {
    this.filteredOptions1 = this.selectChange(this.formGroup.get('subject'),this.subjectOptions)
    this.filteredOptions2 = this.selectChange(this.formGroup.get('nodeFormArray'),this.nodeOptions)
  }

  selectChange(control: AbstractControl | null, options: any){
    if (control !== null)
      return control.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value,options))
        );
    throw new Error("Wrong Controller");
  }
  private _filter(value: string, options :any): string[] {
    const filterValue = (typeof value === 'string')? value :
        Object.values(value)[0] as string;
    return options.filter(
      (option: any) => option.toLowerCase().indexOf(filterValue)===0);
  }


  editGraph(){
    this.num = 2;
  }


  editNodes(){
    this.num = 1;
  }


  addEdges(){
    this.data = this.formGroup.value.nodeFormArray.map((element: string,i :number) => {
      this.edgeOptions.push(element);
      this.edgeNumber.push(1);
      this.edgeObject = Object.assign(this.edgeObject,{
        ['edge'+i]: this.fb.array([this.fb.control('')])
      });
      return {name: element}
    })
    if(this.edgeGroup === undefined || this.formGroup.updateValueAndValidity){
      this.edgeGroup = this.fb.group(this.edgeObject)
      console.log(this.edgeGroup.value)
    }
    if(Object.keys(this.edgeGroup.value).length){
      this.num = 2;
      this.edgeKeys = Object.keys(this.edgeGroup.value);
      this.filteredOptions3 = this.selectChange(this.edgeGroup,this.edgeOptions)
    }
  }

  // Error in this Function have to refactor
  // viewGraph(){
  //   for(let i=0; i < this.edgeKeys.length; i++) {
  //     for (let value in this.edgeGroup.value) {
  //       console.log(this.edgeOptions[i],this.edgeGroup.value[value])
  //       this.links[i]= {
  //         source: this.edgeOptions[i],
  //         target: this.edgeGroup.value[value]
  //       }
  //     }
  //   }
  //   if(Object.keys(this.links).length)
  //     this.num = 3;
  // }

  get nodeControl() {
    return this.formGroup.get('nodeFormArray') as FormArray;
  }

  edgeControl(control: string){
    return this.edgeGroup.get(control) as FormArray
  }



  increment(str:string,i?:number,j?:number){
    if(str=="node"){
      this.nodeNumber++;
      this.nodeControl.push(this.fb.control(''));
    }
    else if(str.includes('edge')){
      console.log(str.split('edge')[1])
      let edge = str.split('edge')[1] as unknown as number
      this.edgeNumber[edge!]++;
      this.edgeControl(str).push(this.fb.control(''));
    }
  }

  decrement(str:string,i?: number ,j?:number){
    if(str=="node") {
      this.nodeNumber--;
      this.nodeControl.removeAt(this.nodeNumber);
    }
    else if(str.includes('edge')){
      console.log(str.split('edge')[1])
      let edge = str.split('edge')[1] as unknown as number
      this.edgeNumber[edge!]--;
      this.edgeControl(str).removeAt(this.edgeNumber[edge!]);
    }
  }

  options = {
    title: {
      text: this.formGroup.value.subject
    },
    animationDurationUpdate: 3000,
    animationEasingUpdate: 'quinticInOut',
    series: [
      {
        type: 'graph',
        layout: 'circular',
        symbolSize: 60,
        roam: true,
        label: {
          normal: {
            show: true
          }
        },
        data: this.data,
        links: this.links,
        edgeSymbol: ['none', 'arrow'],
        lineStyle: {
          normal: {
            opacity: 10,
            width: 2,
            curveness: 0
          }
        }
      }
    ]
  };


}
