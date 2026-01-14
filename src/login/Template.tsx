import { useEffect } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";

import type { TemplateProps } from "keycloakify/login/TemplateProps";
import type { KcContext } from "./KcContext";
import type { I18n } from "./i18n";

import heroUrl from "./assets/bg-NQrust.mp4";
import logoUrl from "./assets/logo.svg";
import nqrustLogoUrl from "./assets/nqrust.png";

import "./index.css";

export default function Template(props: TemplateProps<KcContext, I18n>) {
    const {
        displayInfo = false,
        displayMessage = true,
        displayRequiredFields = false,
        headerNode,
        socialProvidersNode = null,
        infoNode = null,
        documentTitle,
        bodyClassName,
        kcContext,
        i18n,
        doUseDefaultCss,
        classes,
        children
    } = props;

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    const { msg, msgStr, currentLanguage, enabledLanguages } = i18n;
    const { realm, auth, url, message, isAppInitiatedAction } = kcContext;

    useEffect(() => {
        document.title = documentTitle ?? msgStr("loginTitle", realm.displayName);
    }, []);

    // Apply placeholders to default Keycloakify pages that still render labels above inputs (e.g. register/reset pages).
    // This keeps the style consistent with the custom login page where labels are removed.
    useEffect(() => {
        const apply = () => {
            const setIfEmpty = (selector: string, placeholder: string, groupClassName?: string) => {
                const el = document.querySelector<HTMLInputElement>(selector);
                if (!el) {
                    return;
                }
                if (!el.getAttribute("placeholder")) {
                    el.setAttribute("placeholder", placeholder);
                }
                if (groupClassName) {
                    el.closest(".kcFormGroupClass")?.classList.add(groupClassName);
                }
            };

            setIfEmpty("#username, input[name=\"username\"]", msgStr("username"), "nqr-field--username");
            setIfEmpty("#password, input[name=\"password\"]", msgStr("password"), "nqr-field--password");
            setIfEmpty(
                "#password-confirm, input[name=\"password-confirm\"]",
                msgStr("passwordConfirm"),
                "nqr-field--passwordConfirm"
            );
        };

        const t = window.setTimeout(apply, 0);
        return () => window.clearTimeout(t);
    }, [msgStr]);

    useSetClassName({
        qualifiedName: "html",
        className: kcClsx("kcHtmlClass")
    });

    useSetClassName({
        qualifiedName: "body",
        className: bodyClassName ?? kcClsx("kcBodyClass")
    });

    const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });

    if (!isReadyToRender) {
        return null;
    }

    const isHeroVideo = /\.(mp4|webm|ogg)$/i.test(heroUrl);

    return (
        <div className={clsx(kcClsx("kcLoginClass"), "nqr-kc-login")}>
            <div className="nqr-kc-split">
                <aside
                    className="nqr-kc-hero"
                    style={isHeroVideo ? undefined : { backgroundImage: `url(${heroUrl})` }}
                >
                    {isHeroVideo && (
                        <video
                            className="nqr-kc-heroVideo"
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="auto"
                        >
                            <source src={heroUrl} type="video/mp4" />
                        </video>
                    )}
                    <div className="nqr-kc-heroBrand">
                        <img className="nqr-kc-heroLogo" src={logoUrl} alt="Logo" />
                    </div>
                </aside>

                <main className="nqr-kc-main">
                    <div className={clsx(kcClsx("kcFormCardClass"), "nqr-kc-card")}>
                        <header className={kcClsx("kcFormHeaderClass")}>
                            <div className="nqr-kc-brandRow nqr-kc-brandRow--center">
                                <img className="nqr-kc-brandLogo" src={nqrustLogoUrl} alt="Logo" />
                            </div>

                            {enabledLanguages.length > 1 && (
                                <div className={kcClsx("kcLocaleMainClass")} id="kc-locale">
                                    <div id="kc-locale-wrapper" className={kcClsx("kcLocaleWrapperClass")}>
                                        <div
                                            id="kc-locale-dropdown"
                                            className={clsx("menu-button-links", kcClsx("kcLocaleDropDownClass"))}
                                        >
                                            <button
                                                tabIndex={1}
                                                id="kc-current-locale-link"
                                                aria-label={msgStr("languages")}
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                                aria-controls="language-switch1"
                                            >
                                                {currentLanguage.label}
                                            </button>
                                            <ul
                                                role="menu"
                                                tabIndex={-1}
                                                aria-labelledby="kc-current-locale-link"
                                                aria-activedescendant=""
                                                id="language-switch1"
                                                className={kcClsx("kcLocaleListClass")}
                                            >
                                                {enabledLanguages.map(({ languageTag, label, href }, i) => (
                                                    <li
                                                        key={languageTag}
                                                        className={kcClsx("kcLocaleListItemClass")}
                                                        role="none"
                                                    >
                                                        <a
                                                            role="menuitem"
                                                            id={`language-${i + 1}`}
                                                            className={kcClsx("kcLocaleItemClass")}
                                                            href={href}
                                                        >
                                                            {label}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {(() => {
                                const node =
                                    !(auth !== undefined && auth.showUsername && !auth.showResetCredentials) ? (
                                        <h1 id="kc-page-title">{headerNode}</h1>
                                    ) : (
                                        <div id="kc-username" className={kcClsx("kcFormGroupClass")}>
                                            <label id="kc-attempted-username">{auth.attemptedUsername}</label>
                                            <a
                                                id="reset-login"
                                                href={url.loginRestartFlowUrl}
                                                aria-label={msgStr("restartLoginTooltip")}
                                            >
                                                <div className="kc-login-tooltip">
                                                    <i className={kcClsx("kcResetFlowIcon")} />
                                                    <span className="kc-tooltip-text">
                                                        {msg("restartLoginTooltip")}
                                                    </span>
                                                </div>
                                            </a>
                                        </div>
                                    );

                                if (displayRequiredFields) {
                                    return (
                                        <div className={kcClsx("kcContentWrapperClass")}>
                                            <div className={clsx(kcClsx("kcLabelWrapperClass"), "subtitle")}>
                                                <span className="subtitle">
                                                    <span className="required">*</span>
                                                    {msg("requiredFields")}
                                                </span>
                                            </div>
                                            <div className="col-md-10">{node}</div>
                                        </div>
                                    );
                                }

                                return node;
                            })()}
                        </header>

                        <div id="kc-content">
                            <div id="kc-content-wrapper">
                                {displayMessage &&
                                    message !== undefined &&
                                    (message.type !== "warning" || !isAppInitiatedAction) && (
                                        <div
                                            className={clsx(
                                                `alert-${message.type}`,
                                                kcClsx("kcAlertClass"),
                                                `pf-m-${message?.type === "error" ? "danger" : message.type}`
                                            )}
                                        >
                                            <div className="pf-c-alert__icon">
                                                {message.type === "success" && (
                                                    <span className={kcClsx("kcFeedbackSuccessIcon")} />
                                                )}
                                                {message.type === "warning" && (
                                                    <span className={kcClsx("kcFeedbackWarningIcon")} />
                                                )}
                                                {message.type === "error" && (
                                                    <span className={kcClsx("kcFeedbackErrorIcon")} />
                                                )}
                                                {message.type === "info" && (
                                                    <span className={kcClsx("kcFeedbackInfoIcon")} />
                                                )}
                                            </div>
                                            <span
                                                className={kcClsx("kcAlertTitleClass")}
                                                dangerouslySetInnerHTML={{
                                                    __html: kcSanitize(message.summary)
                                                }}
                                            />
                                        </div>
                                    )}

                                {children}

                                {auth !== undefined && auth.showTryAnotherWayLink && (
                                    <form id="kc-select-try-another-way-form" action={url.loginAction} method="post">
                                        <div className={kcClsx("kcFormGroupClass")}>
                                            <input type="hidden" name="tryAnotherWay" value="on" />
                                            <a
                                                href="#"
                                                id="try-another-way"
                                                onClick={() => {
                                                    (
                                                        document.getElementById(
                                                            "kc-select-try-another-way-form"
                                                        ) as HTMLFormElement | null
                                                    )?.requestSubmit();
                                                    return false;
                                                }}
                                            >
                                                {msg("doTryAnotherWay")}
                                            </a>
                                        </div>
                                    </form>
                                )}

                                {socialProvidersNode}

                                {displayInfo && (
                                    <div id="kc-info" className={kcClsx("kcSignUpClass")}>
                                        <div id="kc-info-wrapper" className={kcClsx("kcInfoAreaWrapperClass")}>
                                            {infoNode}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}


