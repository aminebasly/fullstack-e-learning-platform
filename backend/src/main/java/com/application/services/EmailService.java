package com.application.services;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendResetEmail(String to, String token) throws MessagingException {
        String resetLink = "https://englishstar-online.com/reset-password?token=" + token;


        String logoUrl = "https://res.cloudinary.com/dm7qvbgav/image/upload/v1766606652/drilldown_em8ly2.png"; // Replace with your logo URL

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8"); // Added UTF-8

        helper.setTo(to);
        helper.setFrom("English Star <noreply@englishstar-online.com>");
        helper.setSubject("🔐 Reset Your Password");

        String emailContent = "<!DOCTYPE html>\n" +
                "<html lang=\"en\">\n" +
                "<head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                "    <title>Password Reset</title>\n" +
                "    <style>\n" +
                "        body {\n" +
                "            font-family: Arial, sans-serif;\n" +
                "            margin: 0;\n" +
                "            padding: 20px;\n" +
                "            line-height: 1.6;\n" +
                "            color: #333;\n" +
                "        }\n" +
                "        .container {\n" +
                "            max-width: 600px;\n" +
                "            margin: 0 auto;\n" +
                "            border: 1px solid #ddd;\n" +
                "            padding: 20px;\n" +
                "            border-radius: 8px;\n" +
                "        }\n" +
                "        .logo {\n" +
                "            display: block;\n" +
                "            margin: 0 auto 20px;\n" +
                "            text-align: center;\n" +
                "        }\n" +
                "        .logo img {\n" +
                "            max-width: 120px;\n" +
                "            height: auto;\n" +
                "        }\n" +
                "        h2 {\n" +
                "            color: #007bff;\n" +
                "            text-align: center;\n" +
                "        }\n" +
                "        .button {\n" +
                "            display: inline-block;\n" +
                "            background-color: #007bff;\n" +
                "            color: white;\n" +
                "            padding: 12px 24px;\n" +
                "            text-decoration: none;\n" +
                "            border-radius: 5px;\n" +
                "            margin: 20px auto;\n" +
                "            text-align: center;\n" +
                "        }\n" +
                "        .footer {\n" +
                "            margin-top: 30px;\n" +
                "            text-align: center;\n" +
                "            color: #777;\n" +
                "            border-top: 1px solid #eee;\n" +
                "            padding-top: 20px;\n" +
                "        }\n" +
                "        p {\n" +
                "          margin-bottom: 15px;\n" +
                "        }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <div class=\"container\">\n" +
                "        <div class=\"logo\">\n" +
                "            <img src=\"" + logoUrl + "\" alt=\"Your Company Logo\">\n" +
                "        </div>\n" +
                "        <h2>Password Reset Request</h2>\n" +
                "        <p>Hello,</p>\n" +
                "        <p>Click the button below to reset your password:</p>\n" +
                "        <div style=\"text-align: center;\">\n" +
                "            <a href=\"" + resetLink + "\" class=\"button\">Reset Password</a>\n" +
                "        </div>\n" +
                "        <p>If you didn’t request this, please ignore this email.</p>\n" +
                "        <div class=\"footer\">\n" +
                "            <p>English Star</p>\n" +
                "        </div>\n" +
                "    </div>\n" +
                "</body>\n" +
                "</html>";

        helper.setText(emailContent, true);
        mailSender.send(message);
    }
}
