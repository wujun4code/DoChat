import { Component, OnInit, AfterViewInit, AfterContentInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { LeanEngineReport } from '../../providers/lean-engine-report';
@Component({
  selector: 'leanengine-chart',
  templateUrl: 'leanengine-chart.html'
})
export class LeanengineChartComponent implements OnInit {

  text: string;

  constructor(public leanEngine: LeanEngineReport) {
    console.log('constructor');
  }
  ngOnInit() {
    console.log('ngOnInit');
  }
  ngAfterViewInit() {
    console.log('AfterViewInit');
    this.leanEngine.getByDate(new Date()).forEach(next => {
      console.log('next', JSON.stringify(next));
    });
    let canvas = <HTMLCanvasElement>document.getElementById('dayPie');
    let ctx = canvas.getContext('2d');
    let data = {
      labels: [
        "吃",
        "睡",
        "玩"
      ],
      datasets: [
        {
          data: [10, 20, 30],
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
          ]
        }]
    };
    let myPieChart = new Chart(ctx, {
      type: 'doughnut',
      data: data
    });
  }
  ngAfterContentInit() {

  }
}
