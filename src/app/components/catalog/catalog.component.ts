import { Component, OnInit } from '@angular/core';
import { CatalogService } from 'src/app/services/catalog.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  products: any[] = [];
  tabs = [
    { label: 'Todos os Produtos' },
    { label: 'Camisetas' },
    { label: 'Canecas' }
  ];
  selectedTab = 0;
  pages = [1, 2, 3, 4, 5, 6];
  selectedPage = 1;

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

  selectTab(index: number) {
    this.selectedTab = index;
  }


}
