import { Resend } from "resend";

export interface ResendEmailData {
  email: string;
  fullName: string;
  eventTitle: string;
  eventDate: string;
  eventVenue: string;
  phone?: string;
}

export interface AcademyWaitlistEmailData {
  email: string;
  fullName: string;
  phone: string;
  interest: string;
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
    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to: data.email,
        subject: `Registration Confirmed: ${data.eventTitle} 🎉`,
        html: this.confirmationHTML(data),
      });
      console.log(`✅ Confirmation email sent to ${data.email}`);
    } catch (error) {
      console.error("❌ Failed to send confirmation email:", error);
      throw error;
    }
  }

  async sendAdminNotification(data: ResendEmailData): Promise<void> {
    const adminEmails = (
      process.env.ADMIN_EMAILS || "nextwaveglobalinfo@gmail.com"
    )
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      await Promise.all(
        adminEmails.map((admin) =>
          this.resend.emails.send({
            from: this.fromEmail,
            to: admin,
            subject: `New Registration: ${data.fullName} — ${data.eventTitle}`,
            html: this.adminHTML(data),
          }),
        ),
      );
      console.log(`✅ Admin notifications sent to ${adminEmails.length}`);
    } catch (error) {
      console.error("❌ Failed to send admin notifications:", error);
      throw error;
    }
  }

  async sendAcademyWaitlistEmail(data: AcademyWaitlistEmailData): Promise<void> {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to: data.email,
        subject: "🎓 You're on the NextWave Academy waitlist!",
        html: this.academyHTML(data, appUrl),
      });
      console.log(`✅ Academy waitlist email sent to ${data.email}`);
    } catch (error) {
      console.error("❌ Failed to send academy waitlist email:", error);
      throw error;
    }
  }

  private shell(inner: string): string {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>
      body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;line-height:1.6;color:#1a1a1a;max-width:600px;margin:0 auto;padding:20px;background:#f5f5f5}
      .container{background:#fff;border-radius:12px;padding:40px}
      .header{text-align:center;border-bottom:3px solid #b08d21;padding-bottom:20px;margin-bottom:30px}
      .logo{font-size:28px;font-weight:bold;color:#1a1a1a}
      .logo span{color:#b08d21}
      .badge{display:inline-block;background:#b08d21;color:#fff;padding:6px 16px;border-radius:20px;font-size:12px;font-weight:600;letter-spacing:0.5px}
      .box{background:#f8f9fa;border-radius:8px;padding:20px;margin:20px 0;border-left:4px solid #b08d21}
      .box h3{margin:0 0 12px;color:#b08d21;font-size:16px}
      .row{display:flex;padding:6px 0;border-bottom:1px solid #e5e5e5}
      .row:last-child{border-bottom:none}
      .label{font-weight:600;color:#4b5563;min-width:90px;font-size:14px}
      .value{color:#1a1a1a;font-size:14px}
      .btn{display:inline-block;background:#b08d21;color:#fff!important;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600}
      .footer{margin-top:30px;padding-top:20px;border-top:1px solid #e5e5e5;text-align:center;color:#6b7280;font-size:12px}
      @media (max-width:480px){.container{padding:20px}.row{flex-direction:column}}
    </style></head><body><div class="container">
      <div class="header"><div class="logo">Nextwave <span>Global</span></div></div>
      ${inner}
      <div class="footer"><p>&copy; ${new Date().getFullYear()} NextWave Global</p></div>
    </div></body></html>`;
  }

  private confirmationHTML(d: ResendEmailData): string {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return this.shell(`
      <div style="text-align:center"><span class="badge">REGISTRATION CONFIRMED</span></div>
      <h2 style="text-align:center;margin-top:20px">🎉 You're in!</h2>
      <p>Hi <strong>${d.fullName}</strong>,</p>
      <p>You're officially registered for:</p>
      <div class="box">
        <h3>📅 ${d.eventTitle}</h3>
        <div class="row"><span class="label">Date</span><span class="value">${d.eventDate}</span></div>
        <div class="row"><span class="label">Venue</span><span class="value">${d.eventVenue}</span></div>
        <div class="row"><span class="label">Status</span><span class="value">✅ Confirmed</span></div>
      </div>
      <p><strong>What's next?</strong> We'll send reminders and access links closer to the date.</p>
      <div style="text-align:center;margin:30px 0"><a href="${appUrl}" class="btn">Visit Website</a></div>
    `);
  }

  private adminHTML(d: ResendEmailData): string {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return this.shell(`
      <div style="text-align:center"><span class="badge">NEW REGISTRATION</span></div>
      <h2 style="margin-top:20px">🆕 ${d.fullName} just registered</h2>
      <div class="box">
        <h3>Participant</h3>
        <div class="row"><span class="label">Name</span><span class="value"><strong>${d.fullName}</strong></span></div>
        <div class="row"><span class="label">Email</span><span class="value">${d.email}</span></div>
        ${d.phone ? `<div class="row"><span class="label">Phone</span><span class="value">${d.phone}</span></div>` : ""}
        <div class="row"><span class="label">Event</span><span class="value"><strong>${d.eventTitle}</strong></span></div>
        <div class="row"><span class="label">Date</span><span class="value">${d.eventDate}</span></div>
        <div class="row"><span class="label">Venue</span><span class="value">${d.eventVenue}</span></div>
      </div>
      <div style="text-align:center;margin:30px 0"><a href="${appUrl}/admin" class="btn">View Dashboard →</a></div>
    `);
  }

  private academyHTML(d: AcademyWaitlistEmailData, appUrl: string): string {
    return this.shell(`
      <div style="text-align:center"><span class="badge">WAITLIST CONFIRMED</span></div>
      <h2 style="text-align:center;margin-top:20px">You're on the list! 🎓</h2>
      <p>Hi <strong>${d.fullName}</strong>,</p>
      <p>Thanks for your interest in <strong>NextWave Academy</strong>. You're officially on the waitlist and will be among the first to know when doors open.</p>
      <div class="box">
        <h3>Your Details</h3>
        <div class="row"><span class="label">Interest</span><span class="value">${d.interest}</span></div>
        <div class="row"><span class="label">WhatsApp</span><span class="value">${d.phone}</span></div>
      </div>
      <p><strong>What's next?</strong> We'll reach out via email and WhatsApp with early access details before the public launch.</p>
      <div style="text-align:center;margin:30px 0"><a href="${appUrl}/academy" class="btn">Visit Academy Page</a></div>
    `);
  }
}

let emailServiceInstance: ResendEmailService | null = null;

export function getEmailService(): ResendEmailService {
  if (!emailServiceInstance) emailServiceInstance = new ResendEmailService();
  return emailServiceInstance;
}
