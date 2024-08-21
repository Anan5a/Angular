import { Component, computed, effect, input, OnInit } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import { ChartingService, PieChartStruct } from '../charting.service';
import { LEFT_ARROW } from '@angular/cdk/keycodes';


Exporting(Highcharts);

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss'
})
export class PieChartComponent implements OnInit {
  pieChartData = this.chartingService.getPieChartData


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
        type: 'pie'
      },
      title: {
        text: this.pieChartData()?.title || '',
        align: 'left'
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      subtitle: {
        text: this.pieChartData()?.subtitle || '',
        align: 'left'
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
      },

      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            distance: -50,
            format: '{point.percentage:.1f}%',
            style: {
              fontSize: '1.2em',
              textOutline: 'none',
              opacity: 0.7
            },
            filter: {
              operator: '>',
              property: 'percentage',
              value: 10
            }
          },
          showInLegend: true
        }
      },
      credits: {
        enabled: false // Disable credits
      },
      series: [
        {
          type: 'pie',
          name: 'Percentage',
          data: this.pieChartData()?.data || []
        }
      ]
    }

  }
}
