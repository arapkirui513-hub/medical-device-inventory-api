// data/devices.js

// Simple in-memory list of medical devices
// In a real app, this would come from a database.
let devices = [
  {
    id: 1,
    name: 'Infusion Pump',
    model: 'IP-3000',
    manufacturer: 'MedEquip Ltd',
    location: 'ICU Ward 3',
    status: 'active',
    lastServiceDate: '2026-06-01'
  },
  {
    id: 2,
    name: 'Ventilator',
    model: 'VentX-500',
    manufacturer: 'HealthTech Systems',
    location: 'Critical Care Unit',
    status: 'maintenance',
    lastServiceDate: '2026-05-20'
  },
  {
    id: 3,
    name: 'Patient Monitor',
    model: 'PM-12',
    manufacturer: 'BioMed Devices',
    location: 'Surgical Ward',
    status: 'active',
    lastServiceDate: '2026-04-15'
  }
];

// Helper functions to interact with the array
function getAllDevices() {
  return devices;
}

function getDeviceById(id) {
  return devices.find(device => device.id === id);
}

function addDevice(device) {
  devices.push(device);
  return device;
}

function updateDevice(id, updates) {
  const index = devices.findIndex(device => device.id === id);
  if (index === -1) {
    return null;
  }
  devices[index] = { ...devices[index], ...updates };
  return devices[index];
}

function deleteDevice(id) {
  const index = devices.findIndex(device => device.id === id);
  if (index === -1) {
    return false;
  }
  devices.splice(index, 1);
  return true;
}

module.exports = {
  getAllDevices,
  getDeviceById,
  addDevice,
  updateDevice,
  deleteDevice
};