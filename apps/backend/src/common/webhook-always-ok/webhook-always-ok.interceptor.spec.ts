import { WebhookAlwaysOkInterceptor } from './webhook-always-ok.interceptor';

describe('WebhookAlwaysOkInterceptor', () => {
  it('should be defined', () => {
    expect(new WebhookAlwaysOkInterceptor()).toBeDefined();
  });
});
