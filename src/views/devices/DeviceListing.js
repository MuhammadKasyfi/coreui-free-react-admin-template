import React, { useEffect, useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormSelect,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react';

const DeviceListing = () => {
  const [devices, setDevices] = useState([]); // State to hold fetched devices
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        // Uncomment and replace the URL with the actual API endpoint from Emerson Data Studio
        // const response = await fetch('API_ENDPOINT_HERE');
        // if (!response.ok) {
        //   throw new Error('Network response was not ok');
        // }
        // const data = await response.json();
        // setDevices(data); // Set the fetched data to state

        // Placeholder data for demonstration purposes
        setDevices([
          {
            AMStag: 'PZT-04',
            Manufacturer: 'Rosemount',
            DeviceType: '3051',
            DeviceRev: '7',
            Protocol: 'HART',
            SerialNo: '12777265',
            Circuit: 'C1',
          },
          {
            AMStag: '017-PZT-01',
            Manufacturer: 'Rosemount',
            DeviceType: '3051',
            DeviceRev: '7',
            Protocol: 'HART',
            SerialNo: '9164776',
            Circuit: 'C1',
          },
        ]);
      } catch (error) {
        setError(error.message); // Set error message if fetching fails
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchDevices();
  }, []); // Empty dependency array means this runs once on component mount

  return (
    <CRow>
      {/* Main Card for Device Listing */}
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Device Listing</strong>
          </CCardHeader>
          <CCardBody>
            <CRow>
              {/* Area Selection */}
              <CCol md={3}>
                <h5>Area</h5>
                <CFormSelect aria-label="Select Area">
                  <option value="all">All</option>
                  <option value="KNTC">KNTC</option>
                  <option value="KNPGB">KNPGB</option>
                </CFormSelect>
              </CCol>

              {/* Device Type Filter */}
              <CCol md={3}>
                <h5>Device Type</h5>
                <CFormSelect aria-label="Select Device Type">
                  <option value="all">All</option>
                  <option value="Fieldbus">Fieldbus</option>
                  <option value="Hart-DCS">Hart-DCS</option>
                  <option value="Hart-FGS">Hart-FGS</option>
                  <option value="Positioner">Positioner</option>
                  <option value="Wireless">Wireless</option>
                </CFormSelect>
              </CCol>

              {/* Device Details Table */}
              <CCol md={12} className="mt-4">
                {loading ? (
                  <div>Loading...</div> // Loading message
                ) : error ? (
                  <div>Error: {error}</div> // Error message
                ) : (
                  <CTable responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>AMStag</CTableHeaderCell>
                        <CTableHeaderCell>Manufacturer</CTableHeaderCell>
                        <CTableHeaderCell>Device Type</CTableHeaderCell>
                        <CTableHeaderCell>Device Rev</CTableHeaderCell>
                        <CTableHeaderCell>Protocol</CTableHeaderCell>
                        <CTableHeaderCell>Serial No</CTableHeaderCell>
                        <CTableHeaderCell>Circuit</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {devices.map((device, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell>{device.AMStag}</CTableDataCell>
                          <CTableDataCell>{device.Manufacturer}</CTableDataCell>
                          <CTableDataCell>{device.DeviceType}</CTableDataCell>
                          <CTableDataCell>{device.DeviceRev}</CTableDataCell>
                          <CTableDataCell>{device.Protocol}</CTableDataCell>
                          <CTableDataCell>{device.SerialNo}</CTableDataCell>
                          <CTableDataCell>{device.Circuit}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                )}
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default DeviceListing;
