export declare class EmailService {
    private transporter;
    constructor();
    sendPasswordEmail(recipientEmail: string, password: string): Promise<void>;
    sendResetMail(to: string, subject: string, text: string): Promise<void>;
}
