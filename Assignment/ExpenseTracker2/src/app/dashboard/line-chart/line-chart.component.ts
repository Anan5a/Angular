import { Component, input, OnInit } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';


Exporting(Highcharts);

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl:'./line-chart.component.html',
  styleUrl: './line-chart.component.scss'
})
export class LineChartComponent implements OnInit {
  chartTitle = input.required<string>()
  chartSubTitle = input.required<string>()



  isHighcharts = typeof Highcharts === 'object';
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options
  ngOnInit(): void {
    this.chartOptions = {
      chart: {
        type: 'line',
      },
      title: {
        text: this.chartTitle(),
        align: 'left'
      },

      subtitle: {
        text: this.chartSubTitle(),
        align: 'left'
      },

      yAxis: {
        title: {
          text: 'Expense vs Income'
        }
      },

      xAxis: {
        categories: ['Jan', 'Jan', 'Jan', 'Jan', 'Jan', 'Jan', 'Jan',],
        title: {
          text: 'Months'
        }
      },

      legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'bottom'
      },

      plotOptions: {
        line: {
          dataLabels: {
            enabled: false
          },
          enableMouseTracking: false
        },

      },

      series: [
        {
          name: 'Manufacturing',
          data: [
            24916 * Math.random(), 24916 * Math.random(), 24916 * Math.random(), 24916 * Math.random(), 24916 * Math.random(), 24916 * Math.random(), 24916 * Math.random(),
          ]
        } as Highcharts.SeriesOptionsType,
        {
          name: 'Another',
          data: [
            24916 * Math.random(), 24916 * Math.random(), 24916 * Math.random(), 24916 * Math.random(), 24916 * Math.random(), 24916 * Math.random(), 24916 * Math.random(),
          ]
        } as Highcharts.SeriesOptionsType
      ],


      credits: {
        enabled: false // Disable credits
      },
      exporting: {
        enabled: true
      },


    };

  }

}
