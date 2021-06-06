function generatePdfInvoiceData(racun, podjetje, storitev) {
    var data = {
        "documentTitle": "Račun",
        "locale": "sl-SI",
        "currency": "EUR",
        "taxNotation": "ddv",
        "marginTop": 25,
        "marginRight": 25,
        "marginLeft": 25,
        "marginBottom": 25,
        "logo": "https://i.imgur.com/CrSu085.png",
        //"background": "https://image.freepik.com/free-vector/white-abstract-background_23-2148810113.jpg", //or base64 //img or pdf
        "sender": {
            "company": podjetje.ime,
            "address": podjetje.naslov,
            "zip": "2000",
            "city": "Maribor",
            "country": "Slovenija",
            "custom1": racun.zaposleni.naziv,
            "custom2": racun.zaposleni.telefon,
        },
        "client": {
            "company": racun.priimek_stranke,
            "address": racun.ime_stranke,
            "zip": "2000",
            "city": "Maribor",
            "country": "Slovenija"
        },
        "invoiceId": racun._id,
        "invoiceDate": racun.datum,
        "products": [
            {
                "quantity": "1",
                "description": storitev.ime,
                "tax": 22,
                "price": racun.cena
            }
        ],
         "translate": {
             "invoiceNumber": "Številka računa",
             "invoiceDate": "Datumizdaje",
             "products": "Izdelki", 
             "quantity": "Količina", 
             "price": "Cena",
             "subtotal": "Cena brez DDV",
             "total": "Znesek" 
        }
    };

    return data
}

module.exports.generatePdfInvoiceData = generatePdfInvoiceData;