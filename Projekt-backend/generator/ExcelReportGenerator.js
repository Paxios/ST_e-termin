var xl = require('excel4node');

function generiraj(racuni, podjetje) {
    var wb = new xl.Workbook();

    // Add Worksheets to the workbook
    var ws = wb.addWorksheet('Sheet 1');

    // Create a reusable style
    var titleStyle = wb.createStyle({
        font: {
            color: '#0F0F0F',
            size: 18,
            bold: true
        }
    });
    var podjetjeInfoStyle = wb.createStyle({
        font: {
            color: '#3b3b3b',
            size: 14,
            bold: false
        }
    });
    var headerStyle = wb.createStyle({
        font: {
            color: '#0F0F0F',
            size: 14,
            bold: true,
            border: {
                top:{
                    style: "thin",
                    color: "#f6F452"
                }
            }
        }
    });
    var valueStyle = wb.createStyle({
        font: {
            color: '#0F0F0F',
            size: 12,
            bold: false
        }
    });

    ws.cell(1, 1, 1, 6, true).string('Porocilo o poslovanju').style(titleStyle);
    ws.cell(2, 1, 2, 6, true).string(podjetje.ime).style(podjetjeInfoStyle);
    ws.cell(3, 1, 3, 6, true).string(podjetje.tip).style(podjetjeInfoStyle);
    ws.cell(4, 1, 4, 6, true).string(podjetje.naslov).style(podjetjeInfoStyle);
    ws.cell(5, 1, 5, 6, true).string("Slovenija").style(podjetjeInfoStyle);
    ws.cell(6, 1, 6, 6, true).string(podjetje.opis).style(podjetjeInfoStyle);

    ws.cell(9, 1, 9, 6, true).string('Izvedene storitve').style(headerStyle);

    ws.cell(10, 1)
        .string('id_račun')
        .style(headerStyle);
    ws.cell(10, 2)
        .string('storitev')
        .style(headerStyle);
    ws.cell(10, 3)
        .string('stranka')
        .style(headerStyle);
        ws.cell(10, 4)
        .string('opomba')
        .style(headerStyle);
    ws.cell(10, 5)
        .string('cena')
        .style(headerStyle);
    var vrstica = 11;
    racuni.map((racun) => {
        ws.cell(vrstica, 1).string(racun._id.toString()).style(valueStyle);
        ws.cell(vrstica, 2).string(racun.storitev.ime).style(valueStyle);
        ws.cell(vrstica, 3).string(racun.ime_stranke + " " + racun.priimek_stranke).style(valueStyle);
        ws.cell(vrstica, 4).string(racun.opomba).style(valueStyle);
        ws.cell(vrstica, 5).number(parseFloat(racun.cena)).style(valueStyle);
        vrstica++;
    });
    ws.cell(vrstica, 4).string("Skupaj").style(headerStyle);
    ws.cell(vrstica, 5).formula(`=SUM(E8:E${vrstica-1})`).style(headerStyle);
    return wb.writeToBuffer();

}

module.exports.generiraj = generiraj;