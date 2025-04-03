import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product, Tab } from 'src/app/models/product.interface';
import { CatalogService } from 'src/app/services/catalog.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {
  @Input() filtered: Product[] = [];
  products: Product[] = [];
  tabs: Tab[] = [];
  selectedTab = 0;

  constructor(private catalogService: CatalogService, private router: Router) {}

  ngOnInit(): void {
    this.catalogService.getProducts()
      .then((data: Product[]) => {
        if (data && data.length > 0) {
          this.processProducts(data);
        } else {
          console.error('Nenhum produto encontrado.');
        }
      })
      .catch((error) => {
        console.error('Erro ao buscar produtos:', error);
      });
  }

  selectTab(index: number) {
    this.selectedTab = index;
  }

  processProducts(data: Product[]) {
    this.products = data;

    const allProducts = data;
    const tshirts = data.filter((product: { name: string; }) => product.name.toLowerCase().includes('camiseta'));
    const mugs = data.filter((product: { name: string; }) => product.name.toLowerCase().includes('caneca'));

    this.tabs = [
      { label: 'Todos os Produtos', data: allProducts },
      { label: 'Camisetas', data: tshirts },
      { label: 'Canecas', data: mugs }
    ];
  }

  onProductClick(product: Product) {
    localStorage.setItem('selectedProduct', JSON.stringify(product));
    this.router.navigate(['/product']);
  }
}
