require('dotenv').config();
const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false }); // Modo visible
    const page = await browser.newPage();

    await page.goto('https://sistemacuenca.ucp.edu.ar/alumnosnotas/?_gl=1*ogqmfl*_gcl_au*MTk2MzI0OTE5OS4xNzQxNzMzODAx');

    await page.fill('#ctl00_ContentPlaceHolder1_TextBox1', process.env.STUDENT_USERNAME);
    await page.fill('#ctl00_ContentPlaceHolder1_Clave', process.env.STUDENT_PASSWORD);

    await page.click('#ctl00_ContentPlaceHolder1_ImageButton1');

    // espera un selector que solo aparece después del login
    await page.waitForSelector('#ctl00_PanelCursado_header', { timeout: 60000 });


    // entra a "Cursado"
    await page.click('#ctl00_PanelCursado_header');
    await page.waitForTimeout(1000);

    // accede a Inasistencias
    await page.click('a[href="Inasistencias.aspx?Sel=1"]');
    await page.waitForTimeout(1000);


    // espera la carga de la tabla
    await page.waitForSelector('#ctl00_ContentPlaceHolder1_GridView1', { timeout: 60000 });

    // extrae los datos de la tabla
    const inasistencias = await page.$$eval('#ctl00_ContentPlaceHolder1_GridView1 tr', rows => {
        return rows.slice(1).map(row => {
            const columns = row.querySelectorAll('td');
            return {
                materia: columns[0].innerText.trim(),
                porcentaje: parseFloat(columns[1].innerText.trim().replace('%', ''))
            };
        });
    });

    console.log("Datos de inasistencias:", inasistencias);

    // Calcula el porcentaje total de faltas
    const totalMaterias = inasistencias.length;
    const totalFaltas = inasistencias.reduce((sum, item) => sum + item.porcentaje, 0);
    const promedioFaltas = (totalFaltas / totalMaterias).toFixed(2);

    console.log(`Tu porcentaje promedio de inasistencias es: ${promedioFaltas} %`);

    await browser.close();
})();
