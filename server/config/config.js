// =======================
//          puerto
//========================
process.env.PORT = process.env.PORT || 3000;

// =======================
//          Entorno
//========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =======================
//          Entorno
//========================

let urlDB;

if (process.env.NODE_ENV === 'dev') {

    urlDB = 'mongodb://localhost:27017/cafe';
} else {

    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


// =======================
// vencimiento del token
//========================
//60 seg
//60min
//24 hs
//30 dias 

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// =======================
// seed de autenticacion
//========================


process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrolloo';


//=================
//google client id
//==================

process.env.CLIENT_ID = process.env.CLIENT_ID || '44502255045-0ou78k70a0aleqof3of5hen5cqqdlnc7.apps.googleusercontent.com';