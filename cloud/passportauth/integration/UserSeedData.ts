export interface User {
  avatar: string;
  banner: string;
  email: string;
  id: string;
  name: string;
  notes: string;
  password: string;
  phone: string;
  position: string;
  username: string;
  roles: string[];
}

const userSeedData: User[] = [
  {
    avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/kolage/128.jpg',
    banner: 'http://web18.streamhoster.com/pentonmedia/beefmagazine.com/TreverStockyards_38371.jpg',
    email: 'trever@wfm.com',
    id: 'rkX1fdSH',
    name: 'Trever Smith',
    notes: 'Trever doesn\'t work during the weekends.',
    password: '123',
    phone: '2657258272',
    position: 'Senior Truck Driver',
    username: 'trever',
    roles: ['admin', 'user']
  },
  {
    avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/madysondesigns/128.jpg',
    banner: 'https://s3-eu-west-1.amazonaws.com/raincatcher-files/Screen+Shot+2017-03-27+at+11.04.27.png',
    email: 'daisy@wfm.com',
    id: 'rJeXyfdrH',
    name: 'Daisy Dialer',
    notes: '',
    password: '123',
    phone: '2657548176',
    position: 'Junior Dispatcher',
    username: 'daisy',
    roles: ['admin', 'user']
  },
  {
    avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/davidburlton/128.jpg',
    banner: 'https://s3-eu-west-1.amazonaws.com/raincatcher-files/Screen+Shot+2017-03-27+at+11.04.27.png',
    email: 'max@wfm.com',
    id: 'H1ZmkzOrr',
    name: 'Max A. Million',
    notes: '',
    password: '123',
    phone: '2657134154',
    position: 'Manager',
    username: 'max',
    roles: ['user']
  },
  {
    avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    banner: 'https://s3-eu-west-1.amazonaws.com/raincatcher-files/Screen+Shot+2017-03-27+at+11.04.27.png',
    email: 'phylis@wfm.com',
    id: 'ByzQyz_BS',
    name: 'Phylis Lexy',
    notes: '',
    password: '123',
    phone: '2657343446',
    position: 'Phone Support',
    username: 'phylis',
    roles: ['user']
  }
];

export default userSeedData;
