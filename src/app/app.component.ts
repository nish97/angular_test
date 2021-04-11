import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
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
  edgeNumber = 1
  edgeKeys: string[] = []
  data = [];
  links = [{
    source: 'Node 2',
    target: 'Node 1',
  }];

  constructor(private fb: FormBuilder) {}

  formGroup = this.fb.group({
    subject: [''],
    nodeFormArray: this.fb.array([
      this.fb.control('')
    ])
  })

  edgeObject: Object = {}

  edgeGroup: any


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

  get nodeControl() {
    return this.formGroup.get('nodeFormArray') as FormArray;
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

  viewGraph(){
    this.num = 3;
  }

  addEdges(){
    this.data = this.formGroup.value.nodeFormArray.map((element: string,i :number,arr: any ) => {
      this.edgeOptions.push(element);
      this.edgeObject = Object.assign(this.edgeObject,{['edge'+i]: this.fb.array([this.fb.control('')])})
      return {name: element}
    })
    this.edgeGroup = this.fb.group(this.edgeObject)
    console.log(this.edgeGroup.value)
    if(Object.keys(this.edgeGroup.value).length > 1 ){
      this.num = 2;
      this.edgeKeys = Object.keys(this.edgeGroup.value);
      this.filteredOptions3 = this.selectChange(this.edgeGroup,this.edgeOptions)
    }

  }


  editNodes(){
    this.num = 1;
  }

  increment(str:string){

    if(str="node"){
      this.nodeNumber++;
      this.nodeControl.push(this.fb.control(''));
    }

  }

  decrement(str:string, index : number){

    if(str="node") {
      this.nodeNumber--;
      this.nodeControl.removeAt(index);
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
        cursor: 'pointer',
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
