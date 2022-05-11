import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import { Offer } from '../../model/offer';
import { OffersService } from '../../services/offers.service';
import {FormControl, NgForm, Validators} from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import * as _ from "lodash";

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit, AfterViewInit {
  
  offerData: Offer;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'title', 'description', 'points', 'businessId', 'actions']

  @ViewChild('offerForm', {static: false})
  offerForm!: NgForm;

  @ViewChild(MatPaginator, {static: true})
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  isEditMode = false;

  constructor(private offersService: OffersService) {
    this.offerData = {} as Offer;
    this.dataSource = new MatTableDataSource<any>();
  }

  ngOnInit(): void {
    this.getAllOffers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getAllOffers() {
    this.offersService.getAll().subscribe((response: any) => {
      this.dataSource.data = response;
    });
  }

  editItem(element: Offer) {
    this.offerData = _.cloneDeep(element);
    this.isEditMode = true;
  }

  cancelEdit() {
    this.isEditMode = false;
    this.offerForm.resetForm();
  }

  deleteItem(id: number) {
    this.offersService.delete(id).subscribe(() => {
      this.dataSource.data = this.dataSource.data.filter((o: Offer) => {
        return o.id !== id ? o : false;
      });
    });
    console.log(this.dataSource.data);
  }

  addOffer() {
    this.offerData.id = 0;
    this.offersService.create(this.offerData).subscribe((response: any) => {
      this.dataSource.data.push({...response});
      this.dataSource.data = this.dataSource.data.map((o: any) => { return o; });
    });
  }

  updateOffer() {
    this.offersService.update(this.offerData.id, this.offerData).subscribe((response: any) => {
      this.dataSource.data = this.dataSource.data.map((o: Offer) => {
        if (o.id == response.id) {
          o = response;
        }
        return o;
      });
    });

  }
  onSubmit() {
    
    if (this.offerForm.form.valid) {
      console.log('valid');
      if (this.isEditMode) {
        console.log('about to update');
        this.updateOffer();
      } else {
        console.log('about to create');
        this.addOffer();
      }
      this.cancelEdit();
    } else {
      console.log('Invalid data');
    }
  }

  get totalRows(): number {
    this.offersService.setCount.emit({
      data: this.dataSource.data.length
    })

    return this.dataSource.data.length;
  }
}
