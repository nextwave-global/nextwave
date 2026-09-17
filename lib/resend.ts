import { Resend } from "resend";

export interface ResendEmailData {
  email: string;
  fullName: string;
  eventTitle: string;
  eventDate: string;
  eventVenue: string;
  phone?: string;
}

export class ResendEmailService {
  private resend: Resend;
  private fromEmail: string;

  constructor() {
    if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY missing");
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.fromEmail =
      process.env.RESEND_FROM_EMAIL ||
      "NextWave Global <noreply@nextwaveglobal.com>";
  }

  async sendConfirmationEmail(data: ResendEmailData): Promise<void> {
    const { email, fullName, eventTitle, eventDate, eventVenue } = data;
    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: `Registration Confirmed: ${eventTitle} 🎉`,
        html: this.generateConfirmationHTML(data),
      });
      console.log(`✅ Confirmation email sent to ${email}`);
    } catch (error) {
      console.error("❌ Failed to send confirmation email:", error);
      throw error;
    }
  }

  async sendAdminNotification(data: ResendEmailData): Promise<void> {
    const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [
      "nextwaveglobalinfo@gmail.com",
    ];
    try {
      await Promise.all(
        adminEmails.map((admin) =>
          this.resend.emails.send({
            from: this.fromEmail,
            to: admin.trim(),
            subject: `New Registration: ${data.fullName} - ${data.eventTitle}`,
            html: this.generateAdminHTML(data),
          }),
        ),
      );
      console.log(
        `✅ Admin notifications sent to ${adminEmails.length} recipients`,
      );
    } catch (error) {
      console.error("❌ Failed to send admin notifications:", error);
      throw error;
    }
  }

  private generateConfirmationHTML(data: ResendEmailData): string {
    const { fullName, eventTitle, eventDate, eventVenue } = data;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f5f5f5}.container{background:#fff;border-radius:12px;padding:40px}.header{text-align:center;border-bottom:3px solid #b08d21;padding-bottom:20px;margin-bottom:30px}.logo{font-size:28px;font-weight:bold;color:#1a1a1a}.logo span{color:#b08d21}.event-details{background:#f8f9fa;border-radius:8px;padding:20px;margin:20px 0;border-left:4px solid #b08d21}.button{display:inline-block;background:#b08d21;color:#fff!important;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;margin:20px 0}.footer{margin-top:30px;padding-top:20px;border-top:1px solid #e5e5e5;text-align:center;color:#6b7280;font-size:12px}</style></head><body><div class="container"><div class="header"><div class="logo">Nextwave <span>Global</span></div></div><h2 style="text-align:center">🎉 Registration Confirmed!</h2><p>Hi <strong>${fullName}</strong>,</p><p>You&apos;re officially registered for:</p><div class="event-details"><h3 style="color:#b08d21;margin-top:0">📅 ${eventTitle}</h3><p><strong>Date:</strong> ${eventDate}</p><p><strong>Venue:</strong> ${eventVenue}</p></div><p>We&apos;ll send more details closer to the date.</p><div style="text-align:center"><a href="${appUrl}" class="button">Visit Website</a></div><div class="footer"><p>&copy; ${new Date().getFullYear()} NextWave Global</p></div></div></body></html>`;
  }

  private generateAdminHTML(data: ResendEmailData): string {
    const { fullName, email, eventTitle, eventDate, eventVenue, phone } = data;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f5f5f5}.container{background:#fff;border-radius:12px;padding:40px}.badge{display:inline-block;background:#10b981;color:#fff;padding:4px 16px;border-radius:20px;font-size:12px}.details{background:#f8f9fa;border-radius:8px;padding:20px;margin:20px 0}</style></head><body><div class="container"><h2>🆕 New Registration</h2><div class="badge">New</div><div class="details"><p><strong>Name:</strong> ${fullName}</p><p><strong>Email:</strong> ${email}</p>${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}<p><strong>Event:</strong> ${eventTitle}</p><p><strong>Date:</strong> ${eventDate}</p><p><strong>Venue:</strong> ${eventVenue}</p></div><p style="text-align:center"><a href="${appUrl}/admin" style="display:inline-block;background:#b08d21;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600">View Dashboard →</a></p></div></body></html>`;
  }
}

let emailServiceInstance: ResendEmailService | null = null;

export function getEmailService(): ResendEmailService {
  if (!emailServiceInstance) emailServiceInstance = new ResendEmailService();
  return emailServiceInstance;
}
