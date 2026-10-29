import { test, expect } from '@/tests/e2e/fixtures/test';

test.describe('e2e: Register page', () => {
  test('load page', async ({ page }) => {
    const response = await page.goto('/register');

    expect(response?.ok()).toBe(true);

    await expect(
      page.getByRole('heading', { name: 'Criar conta' }),
    ).toBeVisible();

    await page.getByPlaceholder('Seu nome completo').fill('John Doe');
    await page.getByPlaceholder('mail@exemplo.com').fill('johndoe@test.com');
    await page.getByPlaceholder('Digite sua senha').fill('12345678');

    await page.getByRole('button', { name: 'Cadastrar' }).click();

    await page.waitForSelector('text=Usuário criado com sucesso.', {
      state: 'visible',
      timeout: 15000,
    });

    await expect(
      page.getByRole('heading', { name: 'Fazer login' }),
    ).toBeVisible();
  });
});
