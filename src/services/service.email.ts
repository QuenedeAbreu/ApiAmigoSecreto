
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

transporter.use('compile', hbs(handlebarOptions));

interface EmailContext {
  title: string;
  message: string;
}

export const sendEmail = async (to: string, subject: string, context: EmailContext) => {
  try {
    const mailOptions = {
      from: 'Amigo Oculto <quenede.in@gmail.com>',
      to: to,
      subject: subject,
      template: 'senhaView',
      context: context // passamos o contexto para o template
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado: ' + info.response);
    return true;
  } catch (error) {
    console.error('Erro ao enviar email: ', error);
    return false;
  }
};