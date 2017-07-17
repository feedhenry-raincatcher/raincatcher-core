import { Component, Input } from '@angular/core';

@Component({
  selector: 'rc-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  @Input() title: string;
  constructor() { }
}
