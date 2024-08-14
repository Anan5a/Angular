import { Component, input, OnInit } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';


Exporting(Highcharts);

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss'
})
export class PieChartComponent implements OnInit {
  chartTitle = input.required<string>()
  chartSubTitle = input.required<string>()

  chart_data = [
    {
      name: 'Water',
      y: 55.02
    },
    {
      name: 'Fat',
      sliced: true,
      selected: true,
      y: 26.71
    },
    {
      name: 'Carbohydrates',
      y: 1.09
    },
    {
      name: 'Protein',
      y: 15.5
    },
    {
      name: 'Ash',
      y: 1.68
    }
  ]

  isHighcharts = typeof Highcharts === 'object';
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options
  ngOnInit(): void {
    this.chartOptions = {
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Egg Yolk Composition'
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      subtitle: {
        text:
          'Source:<a href="https://www.mdpi.com/2072-6643/11/3/684/htm" target="_default">MDPI</a>'
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
          data: [
            {
              name: 'Water',
              y: 55.02
            },
            {
              name: 'Fat',
              y: 26.71
            },
            {
              name: 'Carbohydrates',
              y: 1.09
            },
            {
              name: 'Protein',
              y: 15.5
            },
            {
              name: 'Ash',
              y: 1.68
            }
          ]
        }
      ]
    }


  }
}
