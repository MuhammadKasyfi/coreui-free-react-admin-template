/* eslint-disable prettier/prettier */

import React from 'react'
import GaugeComponent from 'react-gauge-component'
import { CChartDoughnut } from '@coreui/react-chartjs'

const dummyData = {
  daily: 98,
  weekly: 96,
  monthly: 90,
  totalAlertsByDevice: 1,
  totalAlertsByCategory: { warning: 50, advisory: 50 },
  alertList: [
    {
      timestamp: '02/11/2022 3:13:42 AM',
      tag: 'KJC-PY-5810A_01',
      criticality: 'C2',
      manufacturer: 'Fisher Controls International',
      model: 'DVC6200/DVC6000f',
      alert: 'Performance Info',
      priority: 'Advisory',
      description: 'An enumeration specifying the cause of the alert to be reported.',
    },
    {
      timestamp: '02/11/2022 3:14:02 AM',
      tag: 'KJC-PY-5810A_01',
      criticality: 'C2',
      manufacturer: 'Fisher Controls International',
      model: 'DVC6200/DVC6000f',
      alert: 'Travel Deviation',
      priority: 'Warning',
      description: 'An enumeration specifying the cause of the alert to be reported.',
    },
  ],
}

const AlertSummaryBravo = () => {
  return (
    <div className="content-wrapper" style={{ padding: '20px' }}>
      <h2>Alert Summary Charlie</h2>
      <div className="row">
        <div className="col-md-4">
          <h4>Daily Alert Summary</h4>
          <GaugeComponent
            type="semicircle"
            arc={{
              width: 0.2,
              padding: 0.005,
              cornerRadius: 1,
              subArcs: [
                {
                  limit: 30,
                  color: '#EA4228',
                  showTick: true,
                  tooltip: { text: 'Too low alert!' },
                },
                {
                  limit: 60,
                  color: '#F5CD19',
                  showTick: true,
                  tooltip: { text: 'Low alert!' },
                },
                {
                  limit: 90,
                  color: '#5BE12C',
                  showTick: true,
                  tooltip: { text: 'OK alert!' },
                },
                {
                  color: '#F5CD19',
                  tooltip: { text: 'High alert!' },
                },
                {
                  color: '#EA4228',
                  tooltip: { text: 'Too high alert!' },
                },
              ],
            }}
            pointer={{
              color: '#345243',
              length: 0.8,
              width: 15,
            }}
            labels={{
              valueLabel: { formatTextValue: (value) => value + '%' },
              tickLabels: {
                type: 'outer',
                defaultTickValueConfig: {
                  formatTextValue: (value) => value + '%',
                  style: { fontSize: 10 },
                },
                ticks: [0, 30, 60, 90, 100],
              },
            }}
            value={dummyData.daily}
            minValue={0}
            maxValue={100}
          />
          <p>Daily: {dummyData.daily}</p>

          {/* Repeat the same structure for weekly and monthly gauges */}
          <h4>Weekly Alert Summary</h4>
          <GaugeComponent
            type="semicircle"
            arc={{
              width: 0.2,
              padding: 0.005,
              cornerRadius: 1,
              subArcs: [
                {
                  limit: 30,
                  color: '#EA4228',
                  showTick: true,
                  tooltip: { text: 'Too low alert!' },
                },
                {
                  limit: 60,
                  color: '#F5CD19',
                  showTick: true,
                  tooltip: { text: 'Low alert!' },
                },
                {
                  limit: 90,
                  color: '#5BE12C',
                  showTick: true,
                  tooltip: { text: 'OK alert!' },
                },
                {
                  color: '#F5CD19',
                  tooltip: { text: 'High alert!' },
                },
                {
                  color: '#EA4228',
                  tooltip: { text: 'Too high alert!' },
                },
              ],
            }}
            pointer={{
              color: '#345243',
              length: 0.8,
              width: 15,
            }}
            labels={{
              valueLabel: { formatTextValue: (value) => value + '%' },
              tickLabels: {
                type: 'outer',
                defaultTickValueConfig: {
                  formatTextValue: (value) => value + '%',
                  style: { fontSize: 10 },
                },
                ticks: [0, 30, 60, 90, 100],
              },
            }}
            value={dummyData.weekly}
            minValue={0}
            maxValue={100}
          />
          <p>Weekly: {dummyData.weekly}</p>

          <h4>Monthly Alert Summary</h4>
          <GaugeComponent
            type="semicircle"
            arc={{
              width: 0.2,
              padding: 0.005,
              cornerRadius: 1,
              subArcs: [
                {
                  limit: 30,
                  color: '#EA4228',
                  showTick: true,
                  tooltip: { text: 'Too low alert!' },
                },
                {
                  limit: 60,
                  color: '#F5CD19',
                  showTick: true,
                  tooltip: { text: 'Low alert!' },
                },
                {
                  limit: 90,
                  color: '#5BE12C',
                  showTick: true,
                  tooltip: { text: 'OK alert!' },
                },
                {
                  color: '#F5CD19',
                  tooltip: { text: 'High alert!' },
                },
                {
                  color: '#EA4228',
                  tooltip: { text: 'Too high alert!' },
                },
              ],
            }}
            pointer={{
              color: '#345243',
              length: 0.8,
              width: 15,
            }}
            labels={{
              valueLabel: { formatTextValue: (value) => value + '%' },
              tickLabels: {
                type: 'outer',
                defaultTickValueConfig: {
                  formatTextValue: (value) => value + '%',
                  style: { fontSize: 10 },
                },
                ticks: [0, 30, 60, 90, 100],
              },
            }}
            value={dummyData.monthly}
            minValue={0}
            maxValue={100}
          />
          <p>Monthly: {dummyData.monthly}</p>
        </div>

        <div className="col-md-4">
          <h4>Total Alert By Category</h4>
          <CChartDoughnut
            data={{
              labels: ['Warning', 'Advisory'],
              datasets: [
                {
                  data: [
                    dummyData.totalAlertsByCategory.warning,
                    dummyData.totalAlertsByCategory.advisory,
                  ],
                  backgroundColor: ['#FFCE56', '#36A2EB'],
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: 'bottom',
                },
              },
            }}
          />
        </div>

        <div className="col-md-4">
          <h4>Alert Listing</h4>
          <table className="table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>AMSTag</th>
                <th>Criticality</th>
                <th>Manufacturer</th>
                <th>Model</th>
                <th>Alert</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {dummyData.alertList.map((alert, index) => (
                <tr key={index}>
                  <td>{alert.timestamp}</td>
                  <td>{alert.tag}</td>
                  <td>{alert.criticality}</td>
                  <td>{alert.manufacturer}</td>
                  <td>{alert.model}</td>
                  <td>{alert.alert}</td>
                  <td>{alert.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AlertSummaryBravo
