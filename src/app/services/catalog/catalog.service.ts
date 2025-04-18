import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  private url: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  async getProducts(): Promise<any> {
    console.log(this.url);
    try {
      if (environment.featureFlags.enableGraphQLApi) {
        const query = `
          query {
            allProducts {
              id
              name
              description
              price_in_cents
              image_url
            }
          }
        `;
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
        });

        const response = await this.http
          .post<any>(this.url, { query }, { headers })
          .toPromise();
        return response.data.allProducts;
      } else {
        const response = await this.http
          .get<any>(`${this.url}/products`)
          .toPromise();
        return response.products;
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  }
}
