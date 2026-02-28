<#--
  This file has been claimed for ownership from @keycloakify/email-native version 260007.0.0.
  To relinquish ownership and restore this file to its original content, run the following command:
  
  $ npx keycloakify own --path "email/html/email-test.ftl" --revert
-->

<#import "template.ftl" as layout>
<@layout.emailLayout>
    <!-- Email Title -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
            <td style="padding-bottom: 10px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #FF6B35; letter-spacing: 0.3px;">
                    Email Test
                </h1>
            </td>
        </tr>
    </table>

    <!-- Welcome Message -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
            <td style="padding-bottom: 30px; text-align: center;">
                <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #333333;">
                    Welcome! This is a test email to verify your email configuration.
                </p>
            </td>
        </tr>
    </table>

    <!-- Main Content -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
            <td style="padding-bottom: 30px;">
                <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #333333;">
                    ${kcSanitize(msg("emailTestBodyHtml",realmName))?no_esc}
                </p>
            </td>
        </tr>
    </table>

    <!-- Info Box -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 30px;">
        <tr>
            <td style="padding: 20px; background-color: #f7f8f8; border-left: 4px solid #FF6B35; border-radius: 4px;">
                <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #333333;">
                    ℹ️ Test Information
                </p>
                <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #72767b;">
                    <#if realmName??>
                        <strong style="color: #333333;">Realm:</strong> ${realmName}<br><br>
                    </#if>
                    If you received this email, your email configuration is working correctly. This confirms that your SMTP settings are properly configured and emails can be sent successfully.
                </p>
            </td>
        </tr>
    </table>

    <!-- Success Indicator -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 40px;">
        <tr>
            <td align="center" style="padding: 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                    <tr>
                        <td style="padding: 14px 32px; background-color: #FF6B35; border-radius: 6px; text-align: center;">
                            <p style="margin: 0; font-size: 14px; font-weight: 600; color: #ffffff; letter-spacing: 0.5px;">
                                ✓ Email Test Successful
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</@layout.emailLayout>
