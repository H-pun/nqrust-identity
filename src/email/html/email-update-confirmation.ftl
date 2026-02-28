<#--
  This file has been claimed for ownership from @keycloakify/email-native version 260007.0.0.
  To relinquish ownership and restore this file to its original content, run the following command:
  
  $ npx keycloakify own --path "email/html/email-update-confirmation.ftl" --revert
-->

<#import "template.ftl" as layout>
<@layout.emailLayout>
${kcSanitize(msg("emailUpdateConfirmationBodyHtml",link, newEmail, realmName, linkExpirationFormatter(linkExpiration)))?no_esc}
</@layout.emailLayout>
