import nodemailer from "nodemailer";

interface ReservationEmailData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  propertyTitle: string;
  message?: string;
}

export async function sendReservationEmail(data: ReservationEmailData) {
  const { clientName, clientEmail, clientPhone, propertyTitle, message } = data;

  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPass = process.env.EMAIL_PASS?.trim();

  console.log("Constructing email transporter with user:", emailUser);

  // Use explicit SMTP settings for Gmail to ensure compatibility and IPv4 support
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: emailUser,
      pass: emailPass,
    },
    // Fix for ENETUNREACH in some environments
    family: 4
  } as any);

  const mailOptions = {
    from: `"RentGermany Platform" <${emailUser}>`,
    to: emailUser, // Sending notification TO the admin email
    subject: `New Reservation Request: ${propertyTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #333; border-bottom: 2px solid #000; padding-bottom: 10px;">New Reservation Request</h2>
        <p style="font-size: 16px; color: #555;">A user has just made a reservation request after paying the mediation fee.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <h3 style="margin-top: 0; color: #000;">Client Details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 120px;">Name:</td>
              <td style="padding: 8px 0;">${clientName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Email:</td>
              <td style="padding: 8px 0;">${clientEmail}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
              <td style="padding: 8px 0;">${clientPhone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Property:</td>
              <td style="padding: 8px 0;">${propertyTitle}</td>
            </tr>
            ${message ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Message:</td>
              <td style="padding: 8px 0; white-space: pre-wrap;">${message}</td>
            </tr>
            ` : ''}
          </table>
        </div>
        
        <p style="font-size: 12px; color: #999; margin-top: 30px; text-align: center;">
          This is an automated notification from your RentGermany Platform.
        </p>
      </div>
    `,
  };

  try {
    console.log("Sending email to:", emailUser);
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully: " + info.response);
    return { success: true, info };
  } catch (error: any) {
    console.error("Error sending email details:", error);
    return { success: false, error: error.message };
  }
}
