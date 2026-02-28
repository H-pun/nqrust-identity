<#--
  This file has been claimed for ownership from @keycloakify/email-native version 260007.0.0.
  To relinquish ownership and restore this file to its original content, run the following command:
  
  $ npx keycloakify own --path "email/html/org-invite.ftl" --revert
-->

<#import "template.ftl" as layout>
<@layout.emailLayout>
<#if firstName?? && lastName??>
    ${kcSanitize(msg("orgInviteBodyPersonalizedHtml", link, linkExpiration, realmName, organization.name, linkExpirationFormatter(linkExpiration), firstName, lastName))?no_esc}
<#else>
    ${kcSanitize(msg("orgInviteBodyHtml", link, linkExpiration, realmName, organization.name, linkExpirationFormatter(linkExpiration)))?no_esc}
</#if>
</@layout.emailLayout>
