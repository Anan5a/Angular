import { Component, input } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';


@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss'
})
export class BarChartComponent {
  chartTitle = input.required<string>()
  chartSubTitle = input.required<string>()



  isHighcharts = typeof Highcharts === 'object';
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options
  ngOnInit(): void {
    this.chartOptions = {
      chart: {
        type: 'column',
      },
      title: {
        text: this.chartTitle(),
        align: 'left'
      },

      subtitle: {
        text: this.chartSubTitle(),
        align: 'left'
      },
      xAxis: {
        categories: ['Jan', 'Jan', 'Jan', 'Jan', 'Jan', 'Jan', 'Jan',],
        crosshair: true,
        accessibility: {
          description: 'Countries'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: '1000 metric tons (MT)'
        }
      },
      tooltip: {
        valueSuffix: ' (1000 MT)'
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },

      series: [
        {
          name: 'Corn',
          data: [387749 * Math.random(), 387749 * Math.random(), 387749 * Math.random(), 387749 * Math.random(), 387749 * Math.random(), 387749 * Math.random(), 387749 * Math.random(), ]
        } as Highcharts.SeriesOptionsType,
        {
          name: 'Wheat',
          data: [387749 * Math.random(), 387749 * Math.random(), 387749 * Math.random(), 387749 * Math.random(), 387749 * Math.random(), 387749 * Math.random(), 387749 * Math.random(),]
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
