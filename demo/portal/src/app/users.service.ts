import { Injectable } from '@angular/core';
import { User } from './User';

@Injectable()
export class UserService {
  users: User[] = [
    {
      'id' : 'rkX1fdSH',
      'username' : 'trever',
      'name' : 'Trever Smith',
      'position' : 'Senior Truck Driver',
      'phone' : '2657258272',
      'email' : 'trever@wfm.com',
      'avatar' : 'https://s3.amazonaws.com/uifaces/faces/twitter/kolage/128.jpg',
      'banner' : 'http://web18.streamhoster.com/pentonmedia/beefmagazine.com/TreverStockyards_38371.jpg',
      'password': '123'
    },
    {
      'id' : 'rJeXyfdrH',
      'username' : 'daisy',
      'name' : 'Daisy Dialer',
      'position' : 'Junior Dispatcher',
      'phone' : '2657548176',
      'email' : 'daisy@wfm.com',
      'avatar' : 'https://s3.amazonaws.com/uifaces/faces/twitter/madysondesigns/128.jpg',
      'banner' : 'https://s3-eu-west-1.amazonaws.com/raincatcher-files/Screen+Shot+2017-03-27+at+11.04.27.png',
      'password': '123'
    },
    {
      'id' : 'H1ZmkzOrr',
      'username' : 'max',
      'name' : 'Max A. Million',
      'position' : 'Manager',
      'phone' : '2657134154',
      'email' : 'max@wfm.com',
      'avatar' : 'https://s3.amazonaws.com/uifaces/faces/twitter/davidburlton/128.jpg',
      'banner' : 'https://s3-eu-west-1.amazonaws.com/raincatcher-files/Screen+Shot+2017-03-27+at+11.04.27.png',
      'password': '123'
    },
    {
      'id' : 'ByzQyz_BS',
      'username' : 'phylis',
      'name' : 'Phylis Lexy',
      'position' : 'Phone Support',
      'phone' : '2657343446',
      'email' : 'phylis@wfm.com',
      'avatar' : 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
      'banner' : 'https://s3-eu-west-1.amazonaws.com/raincatcher-files/Screen+Shot+2017-03-27+at+11.04.27.png',
      'password': '123'
    },
    {
      'id' : 'BJQm1G_BS',
      'username' : 'john',
      'name' : 'Johnny Fizall',
      'position' : 'Junior Truck Driver',
      'phone' : '2657211126',
      'email' : 'johnf@wfm.com',
      'avatar' : 'https://s3.amazonaws.com/uifaces/faces/twitter/jfkingsley/128.jpg',
      'banner' : 'https://s3-eu-west-1.amazonaws.com/raincatcher-files/Screen+Shot+2017-03-27+at+11.04.27.png',
      'password': '123'
    },
    {
      'id' : 'SyVXyMuSr',
      'username' : 'bill',
      'name' : 'Billy Baller',
      'position' : 'Junior Truck Driver',
      'phone' : '2653111527',
      'email' : 'billb@wfm.com',
      'avatar' : 'https://s3.amazonaws.com/uifaces/faces/twitter/peterme/128.jpg',
      'banner' : 'https://s3-eu-west-1.amazonaws.com/raincatcher-files/Screen+Shot+2017-03-27+at+11.04.27.png',
      'password': '123'
    },
    {
      'id' : 'B1r71fOBr',
      'username' : 'sally',
      'name' : 'Sally Shorer',
      'position' : 'Junior Truck Driver',
      'phone' : '2653893496',
      'email' : 'sallys@wfm.com',
      'avatar' : 'https://s3.amazonaws.com/uifaces/faces/twitter/kfriedson/128.jpg',
      'banner' : 'https://s3-eu-west-1.amazonaws.com/raincatcher-files/Screen+Shot+2017-03-27+at+11.04.27.png',
      'password': '123'
    },
    {
      'id' : 'HJ8QkzOSH',
      'username' : 'danny',
      'name' : 'Danny Doorman',
      'position' : 'Junior Truck Driver',
      'phone' : '2654472304',
      'email' : 'dannyd@wfm.com',
      'avatar' : 'https://s3.amazonaws.com/uifaces/faces/twitter/danbenoni/128.jpg',
      'banner' : 'https://s3-eu-west-1.amazonaws.com/raincatcher-files/Screen+Shot+2017-03-27+at+11.04.27.png',
      'password': '123'
    }
  ]
  getUsers(): User[] {
    return this.users;
  }
}
