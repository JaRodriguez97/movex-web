import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
  standalone: true,
  imports: [RouterLink]
})
export class TicketsComponent {}
