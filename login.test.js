import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Pruebas de Login', () => {
    test.describe('pruebas de login', () => {
        test('caso exitoso: ingreso correcto al sistema con credenciales validas', async ({ page }) => {
            // abre la pagina del sistema de alumnos
            await page.goto('https://sistemacuenca.ucp.edu.ar/alumnosnotas/');
    
            // completa el campo de usuario con el nombre de usuario 
            await page.fill('#ctl00_ContentPlaceHolder1_TextBox1', process.env.STUDENT_USERNAME || '');
            // completa el campo de clave con la contraseña 
            await page.fill('#ctl00_ContentPlaceHolder1_Clave', process.env.STUDENT_PASSWORD || '');
    
            // hace click en el boton de inicio de sesion
            await page.click('#ctl00_ContentPlaceHolder1_ImageButton1');
    
            // espera a que aparezca el panel de cursado, lo que indica un inicio de sesion exitoso
            await page.waitForSelector('#ctl00_PanelCursado_header', { timeout: 60000 });
    
            // verifica que el panel de cursado sea visible
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
            
            errorMessage = errorMessage.replace(/\s+/g, ' ').trim();
        
            console.log("Mensaje de error encontrado:", errorMessage);
        
            expect(errorMessage).toContain("La combinación de usuario y clave no coincide o no tiene permisos");
        });
    });
    
});