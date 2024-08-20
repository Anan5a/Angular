import { Component, computed, effect, input } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { BarChartStruct, ChartingService } from '../charting.service';


@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss'
})
export class BarChartComponent {
  barChartData = this.chartingService.getBarChartData;




  isHighcharts = typeof Highcharts === 'object';
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options



  constructor(private chartingService: ChartingService) {
    effect(() => {
      this.updateChartOptions()
    })
  }

  ngOnInit(): void {
    console.log(this.barChartData())
  }
  private updateChartOptions() {

    this.chartOptions = {
      chart: {
        type: 'column',
      },
      title: {
        text: this.barChartData()?.title,
        align: 'left'
      },

      subtitle: {
        text: this.barChartData()?.subtitle,
        align: 'left'
      },
      xAxis: {
        categories: this.barChartData()?.categories,

        crosshair: true,
        title: {
          text: this.barChartData()?.xAxisTitle || ''
        }
      },
      yAxis: {
        title: {
          text: this.barChartData()?.yAxisTitle
        }
      },
      tooltip: {
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },

      series: this.barChartData()?.series as Highcharts.SeriesOptionsType[],

      credits: {
        enabled: false // Disable credits
      },
      exporting: {
        enabled: true
      },


    };
  }
}
