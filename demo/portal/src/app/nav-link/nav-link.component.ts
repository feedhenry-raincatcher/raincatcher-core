import { Component, Input} from '@angular/core';

@Component({
  selector: 'rc-nav-link',
  templateUrl: './nav-link.component.html',
  styleUrls: ['./nav-link.component.css']
})
export class NavLinkComponent {
  @Input() route: string;
  @Input() icon: string;
  @Input() description: string;
}
