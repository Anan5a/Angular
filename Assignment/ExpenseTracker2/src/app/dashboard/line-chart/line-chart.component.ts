import { ChangeDetectorRef, Component, computed, effect, input, OnInit, signal } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import { ChartingService, LineChartStruct } from '../charting.service';


Exporting(Highcharts);

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss'
})
export class LineChartComponent implements OnInit {

  lineChartData = this.chartingService.getLineChartData

  isHighcharts = typeof Highcharts === 'object';
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options

  constructor(private chartingService: ChartingService) {
    effect(() => {
      this.updateChartOptions()
    })
  }


  ngOnInit(): void {
    this.updateChartOptions()
  }

  private updateChartOptions() {
    this.chartOptions = {
      chart: {
        type: 'line',

      },
      title: {
        text: this.lineChartData()?.title,
        align: 'left'
      },

      subtitle: {
        text: this.lineChartData()?.subtitle,
        align: 'left'
      },

      yAxis: {
        title: {
          text: this.lineChartData()?.yAxisTitle
        }
      },

      xAxis: {
        categories: this.lineChartData()?.categories as [],
        title: {
          text: this.lineChartData()?.xAxisTitle
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
          enableMouseTracking: false,
          connectNulls: true,

        },

      },

      series: this.lineChartData()?.series as Highcharts.SeriesOptionsType[],


      credits: {
        enabled: false // Disable credits
      },
      exporting: {
        enabled: true
      },


    };


  }

}
