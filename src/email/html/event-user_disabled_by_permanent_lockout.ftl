<#--
  This file has been claimed for ownership from @keycloakify/email-native version 260007.0.0.
  To relinquish ownership and restore this file to its original content, run the following command:
  
  $ npx keycloakify own --path "email/html/event-user_disabled_by_permanent_lockout.ftl" --revert
-->

<#import "template.ftl" as layout>
<@layout.emailLayout>
${kcSanitize(msg("eventUserDisabledByPermanentLockoutHtml", event.date))?no_esc}
</@layout.emailLayout>
