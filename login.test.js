require('dotenv').config();
const { chromium } = require('playwright');

let browser;
let page;

beforeAll(async () => {
    browser = await chromium.launch({ headless: false });
    page = await browser.newPage();
});

afterAll(async () => {
    await browser.close();
});

describe('Pruebas de Login', () => {

    test('Caso exitoso: ingreso correcto al sistema con credenciales válidas', async () => {
        await page.goto('https://sistemacuenca.ucp.edu.ar/alumnosnotas/?_gl=1*ogqmfl*_gcl_au*MTk2MzI0OTE5OS4xNzQxNzMzODAx');

        await page.fill('#ctl00_ContentPlaceHolder1_TextBox1', process.env.STUDENT_USERNAME);
        await page.fill('#ctl00_ContentPlaceHolder1_Clave', process.env.STUDENT_PASSWORD);

        await page.click('#ctl00_ContentPlaceHolder1_ImageButton1');

        // Espera la carga del panel Cursado
        await page.waitForSelector('#ctl00_PanelCursado_header', { timeout: 60000 });

        // Verifica que el login haya sido exitoso
        const panelCursado = await page.isVisible('#ctl00_PanelCursado_header');
        expect(panelCursado).toBe(true);
    });

    test('Caso fallido: intento de ingreso con credenciales incorrectas', async () => {
        await page.goto('https://sistemacuenca.ucp.edu.ar/alumnosnotas/?_gl=1*ogqmfl*_gcl_au*MTk2MzI0OTE5OS4xNzQxNzMzODAx');

        // Ingresa un usuario y contraseña incorrectos
        await page.fill('#ctl00_ContentPlaceHolder1_TextBox1', 'usuario_incorrecto');
        await page.fill('#ctl00_ContentPlaceHolder1_Clave', 'clave_incorrecta');

        await page.click('#ctl00_ContentPlaceHolder1_ImageButton1');

        // Espera la aparicion del mensaje de error o que no se cargue el panel
        await page.waitForSelector('#ctl00_ContentPlaceHolder1_LabelError', { timeout: 60000 });

        // Verifica que el mensaje de error este presente
        const errorMessage = await page.isVisible('#ctl00_ContentPlaceHolder1_LabelError');
        expect(errorMessage).toBe(true);
    });

});
