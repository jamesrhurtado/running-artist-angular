import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { OffersService } from '../../services/offers.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  constructor(private offersService: OffersService) { 
    this.dataSource = new MatTableDataSource<any>();
  }

  ngOnInit(): void {
    this.getAllOffers();
  }
  getAllOffers() {
    this.offersService.getAll().subscribe((response: any) => {
      this.dataSource.data = response;
    });
  }

}
