import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  selectedItems = [
    {value: 0},
    {value: 1},
    {value: 2},
    {value: 3},
    {value: 4},
    {value: 5},
  ];

  constructor() { }

  ngOnInit(): void {

  }

  f() {
    console.log(this.selectedItems)
  }

}
