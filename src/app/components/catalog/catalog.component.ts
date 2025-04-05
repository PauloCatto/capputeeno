import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product, Tab } from 'src/app/models/product.interface';
import { CatalogService } from 'src/app/services/catalog.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
})
export class CatalogComponent implements OnInit {
  @Input() filtered: Product[] = [];
  products: Product[] = [];
  tabs: Tab[] = [];
  selectedTab = 0;

  constructor(private catalogService: CatalogService, private router: Router) {}

  ngOnInit(): void {
    this.catalogService
      .getProducts()
      .then((data: Product[]) => {
        if (data && data.length > 0) {
          this.processProducts(data);
        } else {
          console.error('NO_PRODUCTS_FOUND');
        }
      })
      .catch((error) => {
        console.error('ERROR_FETCHING_PRODUCTS', error);
      });
  }

  selectTab(index: number) {
    this.selectedTab = index;
  }

  processProducts(data: Product[]) {
    this.products = data;

    console.log(this.products)

    const allProducts = data;
    const tshirts = data.filter((product: { name: string }) =>
      product.name.toLowerCase().includes('camiseta')
    );
    const mugs = data.filter((product: { name: string }) =>
      product.name.toLowerCase().includes('caneca')
    );

    this.tabs = [
      { label: 'ALL_PRODUCTS', data: allProducts },
      { label: 'TSHIRTS', data: tshirts },
      { label: 'MUGS', data: mugs },
    ];
  }

  onProductClick(product: Product) {
    localStorage.setItem('selectedProduct', JSON.stringify(product));
    this.router.navigate(['/product']);
  }
}
