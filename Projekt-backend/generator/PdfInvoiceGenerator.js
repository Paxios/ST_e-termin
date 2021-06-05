function generatePdfInvoiceData(racun, podjetje, storitev) {
    var data = {
        //"documentTitle": "RECEIPT", //Defaults to INVOICE
        "locale": "sl-SI", //Defaults to en-US, used for number formatting (see docs)
        "currency": "EUR", //See documentation 'Locales and Currency' for more info
        "taxNotation": "vat", //or gst
        "marginTop": 25,
        "marginRight": 25,
        "marginLeft": 25,
        "marginBottom": 25,
        "logo": "https://public.easyinvoice.cloud/img/logo_en_original.png", //or base64
        //"background": "https://public.easyinvoice.cloud/img/watermark-draft.jpg", //or base64 //img or pdf
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
        //Used for translating the headers to your preferred language
        //Defaults to English. Below example is translated to Dutch
        // "translate": { 
        //     "invoiceNumber": "Factuurnummer",
        //     "invoiceDate": "Factuurdatum",
        //     "products": "Producten", 
        //     "quantity": "Aantal", 
        //     "price": "Prijs",
        //     "subtotal": "Subtotaal",
        //     "total": "Totaal" 
        // }
    };

    return data
}

module.exports.generatePdfInvoiceData = generatePdfInvoiceData;