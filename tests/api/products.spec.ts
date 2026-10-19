import { test, expect } from '@playwright/test';

test('GET product returns the requested product and its data', async ({ request }) => {
  const response = await request.get('/products/1');

  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/json');
  const product = await response.json();
  expect(product).toMatchObject({
    id: 1,
    title: expect.any(String),
    category: expect.any(String),
    price: expect.any(Number),
    stock: expect.any(Number),
  });
  expect(product.title.trim().length).toBeGreaterThan(0);
  expect(product.price).toBeGreaterThan(0);
  expect(Number.isInteger(product.stock)).toBe(true);
  expect(product.stock).toBeGreaterThanOrEqual(0);
});

test('GET nonexistent product returns 404 with an error message', async ({ request }) => {
  const response = await request.get('/products/999999');

  expect(response.status()).toBe(404);
  expect(await response.json()).toEqual({
    message: "Product with id '999999' not found",
  });
});

test('POST product simulates creation and returns the submitted data', async ({ request }) => {
  const newProduct = { title: 'QA Portfolio Demo Product', price: 19.99 };

  // DummyJSON simulates creation: the product is not persisted on the server.
  const response = await request.post('/products/add', { data: newProduct });

  expect(response.status()).toBe(201);
  const product = await response.json();
  expect(product).toMatchObject({ ...newProduct, id: expect.any(Number) });
  expect(Number.isInteger(product.id)).toBe(true);
  expect(product.id).toBeGreaterThan(0);
});
