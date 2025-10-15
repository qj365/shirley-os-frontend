/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { FetchHttpRequest } from './core/FetchHttpRequest';
import { AdminService } from './services/AdminService';
import { AuthService } from './services/AuthService';
import { CategoryService } from './services/CategoryService';
import { CookingClassService } from './services/CookingClassService';
import { HealthService } from './services/HealthService';
import { NotificationsService } from './services/NotificationsService';
import { OrderService } from './services/OrderService';
import { ProductService } from './services/ProductService';
import { UploadService } from './services/UploadService';
import { WebhookService } from './services/WebhookService';
type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;
export class ClientApi {
  public readonly admin: AdminService;
  public readonly auth: AuthService;
  public readonly category: CategoryService;
  public readonly cookingClass: CookingClassService;
  public readonly health: HealthService;
  public readonly notifications: NotificationsService;
  public readonly order: OrderService;
  public readonly product: ProductService;
  public readonly upload: UploadService;
  public readonly webhook: WebhookService;
  public readonly request: BaseHttpRequest;
  constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = FetchHttpRequest) {
    this.request = new HttpRequest({
      BASE: config?.BASE ?? '',
      VERSION: config?.VERSION ?? '0.0.1',
      WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
      CREDENTIALS: config?.CREDENTIALS ?? 'include',
      TOKEN: config?.TOKEN,
      USERNAME: config?.USERNAME,
      PASSWORD: config?.PASSWORD,
      HEADERS: config?.HEADERS,
      ENCODE_PATH: config?.ENCODE_PATH,
    });
    this.admin = new AdminService(this.request);
    this.auth = new AuthService(this.request);
    this.category = new CategoryService(this.request);
    this.cookingClass = new CookingClassService(this.request);
    this.health = new HealthService(this.request);
    this.notifications = new NotificationsService(this.request);
    this.order = new OrderService(this.request);
    this.product = new ProductService(this.request);
    this.upload = new UploadService(this.request);
    this.webhook = new WebhookService(this.request);
  }
}

