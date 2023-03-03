import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Prices } from '../../../app/prices';
import { AdminService } from '../admin.service';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'pm-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.css']
})
export class PricesComponent implements OnInit {

  prices: Prices;

  priceDetails = new UntypedFormGroup({
    superDeluxe: new UntypedFormControl('',[Validators.required]),
    deluxe: new UntypedFormControl('',[Validators.required]),
    standard: new UntypedFormControl('',[Validators.required]),
    foodPackage: new UntypedFormControl('',[Validators.required]),
    electricityBillPerUnit: new UntypedFormControl('',[Validators.required]),
    securityDeposit: new UntypedFormControl('',[Validators.required])
  });

  constructor(private adminService: AdminService) {
    this.adminService.findHostelPriceDetails().subscribe((hostelPriceDetail) => {
      this.prices = hostelPriceDetail;
      this.setValue(hostelPriceDetail);
    });
    this.priceDetails.get('superDeluxe')!.disable();
    this.priceDetails.get('deluxe')!.disable();
    this.priceDetails.get('standard')!.disable();
    this.priceDetails.get('foodPackage')!.disable();
    this.priceDetails.get('electricityBillPerUnit')!.disable();
    this.priceDetails.get('securityDeposit')!.disable();
  }

  setValue(price: Prices) {
    this.priceDetails.controls['superDeluxe'].setValue(price.superDeluxe);
    this.priceDetails.controls['deluxe'].setValue(price.deluxe);
    this.priceDetails.controls['standard'].setValue(price.standard);
    this.priceDetails.controls['foodPackage'].setValue(price.foodPackage);
    this.priceDetails.controls['electricityBillPerUnit'].setValue(price.electricityBillPerUnit);
    this.priceDetails.controls['securityDeposit'].setValue(price.securityDeposit);
  }

  updatePriceDetails() {
    if(this.priceDetails.status == "INVALID") { 
      alert('Please Enter Valiad Value !');
      return; 
    }
    const price = this.priceDetails.getRawValue();
    // console.log(price);
    this.adminService.updatePriceDetails(price)
    .subscribe((msg) => {
        alert(msg);
    }
    );
  }

  ngOnInit(): void {
    
  }

}
