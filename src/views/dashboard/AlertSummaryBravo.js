/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import axios from 'axios'
import GaugeComponent from 'react-gauge-component'
import { CChartDoughnut } from '@coreui/react-chartjs'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

// DB Connector:
// 
// Path Example: /System/Core/OpticsSource/AMS Device Manager/PSSMY SUBANG/EPM Subang/Demo Set/HART Multiplexer/HART/LCV-2011/_healthindex
// C:\Emerson\AMSOptics\site\System\Core\OpticsSource\AMS Device Manager\PSSMY SUBANG\EPM Subang\Demo Set\HART Multiplexer\HART\LCV-2011\_healthindex
// auth: m6SH7j707Zin3cGkoGgVqjVDH4vv26s5EUqHrDgxvWY=

const AlertSummaryBravo = () => {
  const [data, setData] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);


  useEffect(() => {
    fetchData = async() => {
      try {
        const response = await axios.get('localhost:6512/api/checkstatus', { 
          params: { }, 
          headers: {Authorization: `m6SH7j707Zin3cGkoGgVqjVDH4vv26s5EUqHrDgxvWY=`}
        });

      setData(response.data);
      } catch(error){
        console.error('Error fetching data: ', error);
      }
    };

    //
  }, []);

  return (
    <>
      <CRow>
          <CCol>
            <h6>Data</h6>
          </CCol>
      </CRow>
      <CRow>
          <CCol>
            <h6>
              Test
              {data && (
                <pre>{JSON.stringify(data,null, 2)}</pre>
              )}
            </h6>
          </CCol>
      </CRow>
    </>
  )

  // useEffect(() => {
  //   fetch('C:\Emerson\AMSOptics\site\System\Core\OpticsSource\AMS Device Manager\PSSMY SUBANG\EPM Subang\Demo Set\HART Multiplexer\HART\LCV-2011\_healthindex')
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error('No Response');
  //       }
  //       return response.json();
  //     })
  //     .then((jsonData) => {
  //       setData(jsonData);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       setError(error.message);
  //       setLoading(false);
  //     });
  // }, [])

  // if (loading) {
  //   return (
  //   <>
  //     <CRow>
  //         <CCol>
  //           <h6>Loading...</h6>
  //         </CCol>
  //     </CRow>
  //   </>)
  // }

  // if (error) {
  //   return (
  //   <>
  //     <CRow>
  //         <CCol>
  //           <h6>Error...</h6>
  //         </CCol>
  //     </CRow>
  //   </>)
  // }

  // return (
  //   <>
  //     <CRow>
  //         <CCol>
  //           <h6>Data</h6>
  //         </CCol>
  //     </CRow>
  //     <CRow>
  //         <CCol>
  //           <h6>
  //             Test
  //             {/* {data && (
  //               <pre>{JSON.stringify(data,null, 2)}</pre>
  //             )} */}
  //           </h6>
  //         </CCol>
  //     </CRow>
  //   </>)
}

// const AlertSummaryBravo = () => {
//     return (
//       <>
//         <CRow>
//            <CCol>
//              <h6>Data</h6>
//            </CCol>
//        </CRow>
//        <CRow>
//            <CCol>
//              <h6>
//                 Test
//                {/* {data && (
//                 <pre>{JSON.stringify(data,null, 2)}</pre>
//               )} */}
//             </h6>
//           </CCol>
//        </CRow>
//       </>
//     )
//   }
  


// const dummyData = {
//   daily: 98,
//   weekly: 96,
//   monthly: 90,
//   totalAlertsByDevice: [20, 80],
//   totalAlertsByCategory: { warning: 50, advisory: 50 },
//   alertList: [
//     {
//       timestamp: '02/11/2022 3:13:42 AM',
//       tag: 'KJC-PY-5810A_01',
//       criticality: 'C2',
//       manufacturer: 'Fisher Controls International',
//       model: 'DVC6200/DVC6000f',
//       alert: 'Performance Info',
//       period: 'Advisory',
//       description: 'An enumeration specifying the cause of the alert to be reported.',
//     },
//     {
//       timestamp: '02/11/2022 3:14:02 AM',
//       tag: 'KJC-PY-5810A_01',
//       criticality: 'C2',
//       manufacturer: 'Fisher Controls International',
//       model: 'DVC6200/DVC6000f',
//       alert: 'Travel Deviation',
//       period: 'Warning',
//       description: 'An enumeration specifying the cause of the alert to be reported.',
//     },
//   ],
// }

// TODO REFACTOR
// IDEAS: ROW 1 - ALERT SUMMARY
//        ROW 2 - LIST
//        ROW 3 - GAUGE, CHARTS, AND TABLE
//        ROW 4 COL-4 - GAUGE
//        ROW 4 COL-4 - CHART 1 + TABLE
//        ROW 4 COL-4 - CHART 2

// const AlertSummaryBravo = () => {
//   return (
//     <>
//       <CRow>
//         <CCol>
//           <h6>Alert Summary</h6>
//         </CCol>
//       </CRow>
//       <CRow>
//         <CCol xs={12}>
//           <CCard>
//             <CCardBody>
//               <CRow>
//                 <CCol xs={3}>
//                   <CCard>
//                     <CCardHeader>
//                       <p>Platform Summary</p>
//                     </CCardHeader>
//                   </CCard>
//                 </CCol>
//                 <CCol xs={2}>
//                   <CCard>
//                     <CCardHeader>
//                       <p>DCS</p>
//                     </CCardHeader>
//                   </CCard>
//                 </CCol>
//                 <CCol xs={1}>
//                   <CCard>
//                     <CCardHeader>
//                       <p>FGS</p>
//                     </CCardHeader>
//                   </CCard>
//                 </CCol>
//                 <CCol xs={2}>
//                   <CCard>
//                     <CCardHeader>
//                       <p>SIS</p>
//                     </CCardHeader>
//                   </CCard>
//                 </CCol>
//                 <CCol xs={2}>
//                   <CCard>
//                     <CCardHeader>
//                       <p>TCP2420A</p>
//                     </CCardHeader>
//                   </CCard>
//                 </CCol>
//                 <CCol xs={2}>
//                   <CCard>
//                     <CCardHeader>
//                       <p>TCP2420B</p>
//                     </CCardHeader>
//                   </CCard>
//                 </CCol>
//               </CRow>
//             </CCardBody>
//           </CCard>
//         </CCol>
//       </CRow>
//       <CRow>
//         <CCol className="mt-2">
//           <h6 id="percent" className="card-title mb-0">
//             Percent Good
//           </h6>
//           <GaugeComponent
//             type="semicircle"
//             arc={{
//               width: 0.1,
//               padding: 0.005,
//               cornerRadius: 1,
//               subArcs: [
//                 {
//                   limit: 30,
//                   color: '#EA4228',
//                   showTick: true,
//                   tooltip: { text: 'Too low alert!' },
//                 },
//                 { limit: 60, color: '#F5CD19', showTick: true, tooltip: { text: 'Low alert!' } },
//                 { limit: 90, color: '#5BE12C', showTick: true, tooltip: { text: 'OK alert!' } },
//                 { color: '#F5CD19', tooltip: { text: 'High alert!' } },
//                 { color: '#EA4228', tooltip: { text: 'Too high alert!' } },
//               ],
//             }}
//             pointer={{ color: '#345243', length: 0.8, width: 15 }}
//             labels={{
//               valueLabel: { formatTextValue: (value) => value + '%' },
//               tickLabels: {
//                 type: 'outer',
//                 defaultTickValueConfig: {
//                   formatTextValue: (value) => value + '%',
//                   style: { fontSize: 10 },
//                 },
//                 ticks: [0, 30, 60, 90, 100],
//               },
//             }}
//             value={dummyData.daily}
//             minValue={0}
//             maxValue={100}
//           />
//           <p>Daily: {dummyData.daily}</p>
//         </CCol>
//         <CCol>
//           <CCard>
//             <CCardHeader>Total Alert by Device:</CCardHeader>
//             <CCardBody>
//               <CChartDoughnut
//                 data={{
//                   labels: ['Fieldbus', 'Positioner'],
//                   datasets: [
//                     {
//                       data: dummyData.totalAlertsByDevice,
//                       backgroundColor: ['#000080', '#FFD700'],
//                     },
//                   ],
//                 }}
//               />
//             </CCardBody>
//           </CCard>
//         </CCol>
//         <CCol>
//           <CCard>
//             <CCardHeader>Total Alert by Category:</CCardHeader>
//             <CCardBody>
//               <CChartDoughnut
//                 data={{
//                   labels: ['Warning', 'Advisory'],
//                   datasets: [
//                     {
//                       data: [
//                         dummyData.totalAlertsByCategory.warning,
//                         dummyData.totalAlertsByCategory.advisory,
//                       ],
//                       backgroundColor: ['#FFCE56', '#36A2EB'],
//                     },
//                   ],
//                 }}
//               />
//             </CCardBody>
//           </CCard>
//         </CCol>
//       </CRow>
//       <CRow>
//         <CCol>
//           <CCard>
//             <CCardHeader>Alert Listing</CCardHeader>
//             <CCardBody>
//               <CTable>
//                 <CTableHead>
//                   {/* Try display data here */}
//                   <CTableRow>
//                     <CTableHeaderCell>Timestamp</CTableHeaderCell>
//                     <CTableHeaderCell>AMSTag</CTableHeaderCell>
//                     <CTableHeaderCell>Criticality</CTableHeaderCell>
//                     <CTableHeaderCell>Manufacturer</CTableHeaderCell>
//                     <CTableHeaderCell>Model</CTableHeaderCell>
//                     <CTableHeaderCell>Alert</CTableHeaderCell>
//                     <CTableHeaderCell>Period</CTableHeaderCell>
//                     <CTableHeaderCell>Alert Description</CTableHeaderCell>
//                   </CTableRow>
//                 </CTableHead>
//                 <CTableBody>
//                   {dummyData.alertList.map((alert, index) => (
//                     <CTableRow key={index}>
//                       <CTableDataCell>{alert.timestamp}</CTableDataCell>
//                       <CTableDataCell>{alert.tag}</CTableDataCell>
//                       <CTableDataCell>{alert.criticality}</CTableDataCell>
//                       <CTableDataCell>{alert.manufacturer}</CTableDataCell>
//                       <CTableDataCell>{alert.model}</CTableDataCell>
//                       <CTableDataCell>{alert.alert}</CTableDataCell>
//                       <CTableDataCell>{alert.period}</CTableDataCell>
//                       <CTableDataCell>{alert.description}</CTableDataCell>
//                     </CTableRow>
//                   ))}
//                 </CTableBody>
//               </CTable>
//             </CCardBody>
//           </CCard>
//         </CCol>
//       </CRow>
//     </>
//   )
// }

export default AlertSummaryBravo
