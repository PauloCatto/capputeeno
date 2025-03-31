import { Component, OnInit } from '@angular/core';
import { CatalogService } from 'src/app/services/catalog.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  products: any[] = [];

  constructor(private catalogService: CatalogService) {}

  ngOnInit(): void {
    this.catalogService.getProducts()
    .then((data) => {
      this.products = data;
    })
    .catch((error) => {
      console.error(error);
    });
  }

}
