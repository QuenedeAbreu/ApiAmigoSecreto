
// Envio de Email
import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';


// Configuração do transportador de e-mail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'quenede.in@gmail.com',
    pass: 'bjuq jjnu llcb siss'
  }
});

// Configuração do mecanismo de template handlebars
const handlebarOptions: hbs.NodemailerExpressHandlebarsOptions = {
  viewEngine: {
    extname: '.hbs',
    layoutsDir: 'views/email/',
    defaultLayout: false,
    partialsDir: 'views/email/',
}, viewPath: 'views/email/', 
extName: '.hbs'
};
// transporter.use('compile', hbs(handlebarOptions));

export default transporter
