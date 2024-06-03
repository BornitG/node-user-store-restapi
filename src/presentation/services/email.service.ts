import nodemailer, { Transporter } from 'nodemailer';

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
}

export interface Attachement {
  filename: string;
  path: string;
}


export class EmailService {

  private transporter: Transporter;

  constructor(
    mailerService: string,
    mailerEmail: string,
    senderEmailPassword: string,
    private readonly postToProvider: boolean,
  ) {

    this.transporter = nodemailer.createTransport( {
        service: mailerService,
        auth: {
            user: mailerEmail,
            pass: senderEmailPassword,
        }
    });

  }


  async sendEmail( options: SendMailOptions ): Promise<boolean> {

    const { to, subject, htmlBody } = options;

    try {

        if ( !this.postToProvider ) return true;

        const sendInformation = await this.transporter.sendMail( {
            to: to,
            subject: subject,
            html: htmlBody,
        });

        return true;
    } catch ( error ) {
        return false;
    }

  }


}
