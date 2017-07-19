import { Db } from 'mongodb';

const workorders = [
  {
    id: 'rkX1fdSH',
    workflowId: 'SyVXyMuSr',
    assignee: 'rkX1fdSH',
    type: 'Job Order',
    title: 'Footpath in disrepair',
    status: 'New',
    startTimestamp: '',
    finishTimestamp: '',
    address: '1795 Davie St, Vancouver, BC V6G 2M9',
    location: [49.287227, -123.141489],
    summary: 'Please remove damaged element and return to the base'
  }, {
    id: 'rJeXyfdrH',
    workflowId: 'SyVXyMuSr',
    assignee: 'rkX1fdSH',
    type: 'Job Order',
    title: 'Chimney in disrepair',
    status: 'New',
    startTimestamp: '',
    finishTimestamp: '',
    address: '1641 Davie St, Vancouver, BC V6G 1W1',
    location: [49.285547, -123.138915],
    summary: 'Please remove damaged item'
  }, {
    id: 'ByzQyz_BS',
    workflowId: 'SyVXyMuSr',
    assignee: 'rkX1fdSH',
    type: 'Job Order',
    title: 'Wall in disrepair',
    status: 'New',
    startTimestamp: '',
    finishTimestamp: '',
    address: '1095 W Pender St, Vancouver, BC V6E',
    location: [49.287339, -123.120203],
    summary: 'Please remove damaged item'
  }, {
    id: 'SJ8b3Mr8g',
    workflowId: 'SyVXyMuSr',
    assignee: 'rkX1fdSH',
    type: 'Job Order',
    title: 'House in disrepair',
    status: 'New',
    startTimestamp: '',
    finishTimestamp: '',
    address: '1088 Burrard St, Vancouver, BC V6Z 2R9',
    location: [49.280396, -123.125868],
    summary: 'Please remove damaged item'
  }, {
    id: 'SyVXyMuSr',
    workflowId: 'B1r71fOBr',
    assignee: 'rkX1fdSH',
    type: 'Job Order',
    title: 'Road in disrepair',
    status: 'New',
    startTimestamp: '',
    finishTimestamp: '',
    address: '977 Mainland St #987, Vancouver, BC V6B 1T2',
    location: [49.277026, -123.118487],
    summary: 'Please remove damaged item'
  }, {
    id: 'B1r71fOBr',
    workflowId: 'SyVXyMuSr',
    assignee: 'rkX1fdSH',
    type: 'Job Order',
    title: 'Driveway in disrepair',
    status: 'New',
    startTimestamp: '',
    finishTimestamp: '',
    address: '157 st, 163 Keefer St, Vancouver, BC V6A 1X4',
    location: [49.279490, -123.099947],
    summary: 'Please remove damaged item'
  }, {
    id: 'HJ8QkzOSH',
    workflowId: 'SyVXyMuSr',
    assignee: 'rkX1fdSH',
    type: 'Job Order',
    title: 'Door in disrepair',
    status: 'New',
    startTimestamp: '',
    finishTimestamp: '',
    address: '2795 East Hastings St, Vancouver, BC V5K 1Z8',
    location: [49.281159, -123.047076],
    summary: 'Please remove damaged item'
  }, {
    id: 'BJwQJfdrH',
    workflowId: 'HJ8QkzOSH',
    assignee: 'rkX1fdSH',
    type: 'Job Order',
    title: 'Roof in disrepair',
    status: 'New',
    startTimestamp: '',
    finishTimestamp: '',
    address: '2930 Virtual Way, Vancouver, BC V5M 0A5',
    location: [49.259429, -123.044158],
    summary: 'Please remove damaged item'
  }, {
    id: 'HJQTjsUr',
    workflowId: 'SyVXyMuSr',
    assignee: 'BJQm1G_BS',
    type: 'Job Order',
    title: 'Yard in disrepair',
    status: 'New',
    startTimestamp: '',
    finishTimestamp: '',
    address: '1780 E Broadway, Vancouver, BC V5N 1W3',
    location: [49.261782, -123.068705],
    summary: 'Please remove damaged item'
  }, {
    id: 'Syx76jiUH',
    workflowId: 'SyVXyMuSr',
    assignee: 'BJQm1G_BS',
    type: 'Job Order',
    title: 'Sprinkler in disrepair',
    status: 'New',
    startTimestamp: '',
    finishTimestamp: '',
    address: '311 E Broadway, Vancouver, BC V5T 1W5',
    location: [49.262902, -123.098917],
    summary: 'Please remove damaged item'
  }, {
    id: 'HJbXpioIS',
    workflowId: 'SyVXyMuSr',
    assignee: 'BJQm1G_BS',
    type: 'Job Order',
    title: 'House in disrepair',
    status: 'New',
    startTimestamp: '',
    finishTimestamp: '',
    address: '2035 Yukon St, Vancouver, BC V5Y 3W3',
    location: [49.267271, -123.112822],
    summary: 'Please remove damaged item'
  }, {
    id: 'ryMXaos8S',
    workflowId: 'SyVXyMuSr',
    assignee: 'SyVXyMuSr',
    type: 'Job Order',
    title: 'Tub in disrepair',
    status: 'New',
    startTimestamp: '',
    finishTimestamp: '',
    address: '555 W 12th Ave, Vancouver, BC V5Z 3X7',
    location: [49.260662, -123.116599],
    summary: 'Please remove damaged item'
  }, {
    id: 'SJEXaso8r',
    workflowId: 'SyVXyMuSr',
    assignee: 'B1r71fOBr',
    type: 'Job Order',
    title: 'Window in disrepair',
    status: 'New',
    startTimestamp: '',
    finishTimestamp: '',
    address: '1502 E Hastings St, Vancouver, BC V5L 1S5',
    location: [49.281159, -123.073855],
    summary: 'Please remove damaged item'
  }, {
    id: 'H1H76ij8r',
    workflowId: 'HJ8QkzOSH',
    assignee: 'HJ8QkzOSH',
    type: 'Job Order',
    title: 'Carpet in disrepair',
    status: 'New',
    startTimestamp: '2015-10-22T20:00:00Z',
    finishTimestamp: '',
    address: '860 Drake St, Vancouver, BC V6Z 2P2',
    location: [49.276903, -123.129645],
    summary: 'Please remove damaged item'
  }, {
    id: 'BkuXajsIB',
    workflowId: 'SyVXyMuSr',
    assignee: 'HJ8QkzOSH',
    type: 'Job Order',
    title: 'Sink in disrepair',
    status: 'New',
    startTimestamp: '',
    finishTimestamp: '',
    address: '3820 Oak St, Vancouver, BC V6H 2M5',
    location: [49.251362, -123.127070],
    summary: 'Please remove damaged item'
  }
];

export default function(collectionName: string, database: Db) {
  database.collection(collectionName).count({}, function(err, count) {
    if (count !== 0) {
      return;
    }
    // Change workorders dates
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 4);
    workorders.forEach(function(workorder, index) {
      const date = new Date(workorder.startTimestamp);
      const hours = date.getHours();
      const newDate = index < workorders.length * 2 / 3 ? today : tomorrow;
      newDate.setHours(hours);
      workorder.startTimestamp = newDate.toDateString();
      workorder.finishTimestamp = tomorrow.toDateString();
    });
    console.info('Saving workorders');
    database.collection(collectionName).insertMany(workorders);
  });
}
