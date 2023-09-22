const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const flowSecundario = addKeyword(['2', 'siguiente']).addAnswer(['📄 Aquí tenemos el flujo secundario'])

const flowDocs = addKeyword(['doc', 'documentacion', 'documentación']).addAnswer(
    [
        '📄 Aquí encontras las documentación recuerda que puedes mejorarla',
        'https://bot-whatsapp.netlify.app/',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowTuto = addKeyword(['tutorial', 'tuto']).addAnswer(
    [
        '🙌 Aquí encontras un ejemplo rapido',
        'https://bot-whatsapp.netlify.app/docs/example/',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowGracias = addKeyword(['gracias', 'grac']).addAnswer(
    [
        '🚀 Puedes aportar tu granito de arena a este proyecto',
        '[*opencollective*] https://opencollective.com/bot-whatsapp',
        '[*buymeacoffee*] https://www.buymeacoffee.com/leifermendez',
        '[*patreon*] https://www.patreon.com/leifermendez',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowDiscord = addKeyword(['discord']).addAnswer(
    ['🤪 Únete al discord', 'https://link.codigoencasa.com/DISCORD', '\n*2* Para siguiente paso.'],
    null,
    null,
    [flowSecundario]
)



var nombreBancoCampaña = "Bancoppel";
var nombre = "Jose";
var saldoPendiente = 14900; //si vamos a usar un numero porque vamos a operar el descuento directo con esto
var descuento = 70; //Recordar que este es tanto para la impresión del mensaje y calcular cuanto va a ser el saldo que queda pendiente
var deudaDescuento = saldoPendiente* ((100-70)/100); //con esta operación ya sale solo el descuento 

//Para esta primer versión este es el trigger, ya que contemos con la base de datos de los deudores y tal podemos hacer que el mensaje se envie en automatico según la base de datos.
const flowPrincipal = addKeyword(['hola', 'ole', 'alo', 'buen dia', 'saludos']) // Este es el flow principal, es decir el primario a partir del cual se desencadenan lo demás
    .addAnswer('🙌 Hola soy su asistente de Bancoppel, solo por hoy tenemos un increible descuento para tu cuenta BanCoppel ¿Te gustaría conocer más?', //Aquí añadir que se desplieguen unos botones y tal 
    {
        buttons: [
            {
                body: 'Cuentame más'
            },
            {
                body: 'Detener Promociones'
            }
        ]
    }
    )

const flowDetenerPromociones = addKeyword('detener promociones')
    .addAnswer('Lamento escuchar eso, esta interacción será cerrada, le invitamos a reanudar sus pagos. Excelente día.',
    null,
    null)

const flowCuentameMas = addKeyword('Cuentame más')
    .addAnswer('Nos alegra escuchar eso {nombre} Solo por hoy tenemos una increíble oferta para tu cuenta BanCoppel. Te ofrecemos un descuento del {descuento} sobre el saldo total a pagar. El saldo es de {saldoPendiente} pesos mexicanos, con el descuento que le ofrecemos el saldo pendiente a pagar queda en {deudaDescuento} pesos mexicanos. ¿Te gustaría aprovechar esta oferta?',
    null,
    null,
    [flowPago]
    )

const flowPago = addKeyword(['si', 'dime mas']) //Estas son las respuestas más comunes a la pregunta de que si quieren o no la oferta
    .addAnswer('Excelente! Estoy emocionado de que quieras aprovechar esta promoción. Te enviaré una carta convenio por este mismo medio para que puedas realizar el pago. Por favor, espera un momento mientras genero la carta convenio.',
    null,
    null)

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()

