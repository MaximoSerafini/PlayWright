import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Pruebas de Login', () => {
    test('Caso exitoso: ingreso correcto al sistema con credenciales válidas', async ({ page }) => {
        await page.goto('https://sistemacuenca.ucp.edu.ar/alumnosnotas/');

        await page.fill('#ctl00_ContentPlaceHolder1_TextBox1', process.env.STUDENT_USERNAME || '');
        await page.fill('#ctl00_ContentPlaceHolder1_Clave', process.env.STUDENT_PASSWORD || '');

        await page.click('#ctl00_ContentPlaceHolder1_ImageButton1');

        await page.waitForSelector('#ctl00_PanelCursado_header', { timeout: 60000 });

        const panelCursado = await page.isVisible('#ctl00_PanelCursado_header');
        expect(panelCursado).toBe(true);
    });

    test('Caso fallido: intento de ingreso con credenciales incorrectas (debe fallar)', async ({ page }) => {
        await page.goto('https://sistemacuenca.ucp.edu.ar/alumnosnotas/');
        
        await page.fill('#ctl00_ContentPlaceHolder1_TextBox1', 'usuario_incorrecto');
        await page.fill('#ctl00_ContentPlaceHolder1_Clave', 'clave_incorrecta');
    
        await page.click('#ctl00_ContentPlaceHolder1_ImageButton1');
    
        await page.waitForSelector('#ctl00_ContentPlaceHolder1_Label2', { timeout: 60000 });
    
        let errorMessage = await page.textContent('#ctl00_ContentPlaceHolder1_Label2');
        
        // Elimine espacios extra entre palabras
        errorMessage = errorMessage.replace(/\s+/g, ' ').trim();
    
        console.log("Mensaje de error encontrado:", errorMessage);
    
        expect(errorMessage).toContain("La combinación de usuario y clave no coincide o no tiene permisos");
    });
    
});