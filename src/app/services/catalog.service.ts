import { environment } from './../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  private url: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProducts(): Promise<any> {
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

    return this.http
      .post<any>(this.url, { query }, { headers })
      .toPromise()
      .then((response) => response.data.allProducts)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  }
}
