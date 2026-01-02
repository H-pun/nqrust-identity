/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260305.0.1.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/root/PageNav.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useEnvironment } from "../../shared/keycloak-ui-shared";
import {
    Nav,
    NavExpandable,
    NavItem,
    NavList,
    PageSidebar,
    PageSidebarBody,
    Spinner
} from "../../shared/@patternfly/react-core";
import {
    ApplicationsIcon,
    BullseyeIcon,
    KeyIcon,
    LockIcon,
    ObjectGroupIcon,
    ResourcesAlmostFullIcon,
    ShieldAltIcon,
    UsersIcon,
    UserIcon
} from "../../shared/@patternfly/react-icons";
import {
    PropsWithChildren,
    MouseEvent as ReactMouseEvent,
    Suspense,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { matchPath, useHref, useLinkClickHandler, useLocation } from "react-router-dom";

import fetchContentJson from "../content/fetchContent";
import { environment, type Environment, type Feature } from "../environment";
import { TFuncKey } from "../i18n";
import { usePromise } from "../utils/usePromise";

import "./page-nav.css";

type RootMenuItem = {
    id?: string;
    label: TFuncKey;
    path: string;
    isVisible?: keyof Feature;
    modulePath?: string;
};

type MenuItemWithChildren = {
    label: TFuncKey;
    children: MenuItem[];
    isVisible?: keyof Feature;
};

export type MenuItem = RootMenuItem | MenuItemWithChildren;

export const PageNav = () => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>();
    const context = useEnvironment<Environment>();

    usePromise(signal => fetchContentJson({ signal, context }), setMenuItems);
    return (
        <PageSidebar className="kc-account-page-nav">
            <PageSidebarBody>
                <Nav>
                    <NavList>
                        <Suspense fallback={<Spinner />}>
                            {menuItems
                                ?.filter(menuItem =>
                                    menuItem.isVisible
                                        ? context.environment.features[menuItem.isVisible]
                                        : true
                                )
                                .map(menuItem => (
                                    <NavMenuItem
                                        key={menuItem.label as string}
                                        menuItem={menuItem}
                                    />
                                ))}
                        </Suspense>
                    </NavList>
                </Nav>
            </PageSidebarBody>
        </PageSidebar>
    );
};

type NavMenuItemProps = {
    menuItem: MenuItem;
};

function NavMenuItem({ menuItem }: NavMenuItemProps) {
    const { t } = useTranslation();
    const {
        environment: { features }
    } = useEnvironment<Environment>();
    const { pathname } = useLocation();
    const isActive = useMemo(
        () => matchMenuItem(pathname, menuItem),
        [pathname, menuItem]
    );

    if ("path" in menuItem) {
        const label = t(menuItem.label);
        return (
            <NavLink
                path={menuItem.path}
                label={label}
                icon={getIcon(menuItem)}
                isActive={isActive}
            >
                {label}
            </NavLink>
        );
    }

    return (
        <NavExpandable
            data-testid={menuItem.label}
            title={
                <span className="kc-nav-link-content">
                    <span className="kc-nav-icon" aria-hidden="true">
                        {getIcon(menuItem)}
                    </span>
                    <span className="kc-nav-label">{t(menuItem.label)}</span>
                </span>
            }
            isActive={isActive}
            isExpanded={isActive}
        >
            {menuItem.children
                .filter(menuItem =>
                    menuItem.isVisible ? features[menuItem.isVisible] : true
                )
                .map(child => (
                    <NavMenuItem key={child.label as string} menuItem={child} />
                ))}
        </NavExpandable>
    );
}

function getFullUrl(path: string) {
    return `${new URL(environment.baseUrl).pathname}${path}`;
}

function matchMenuItem(currentPath: string, menuItem: MenuItem): boolean {
    if ("path" in menuItem) {
        return !!matchPath(getFullUrl(menuItem.path), currentPath);
    }

    return menuItem.children.some(child => matchMenuItem(currentPath, child));
}

type NavLinkProps = {
    path: string;
    isActive: boolean;
    label: string;
    icon: JSX.Element;
};

export const NavLink = ({
    path,
    isActive,
    label,
    icon,
    children
}: PropsWithChildren<NavLinkProps>) => {
    const menuItemPath = getFullUrl(path) + location.search;
    const href = useHref(menuItemPath);
    const handleClick = useLinkClickHandler(menuItemPath);

    return (
        <NavItem
            data-testid={path}
            to={href}
            isActive={isActive}
            aria-label={label}
            onClick={event =>
                // PatternFly does not have the correct type for this event, so we need to cast it.
                handleClick(event as unknown as ReactMouseEvent<HTMLAnchorElement>)
            }
        >
            <span className="kc-nav-link-content">
                <span className="kc-nav-icon" aria-hidden="true">
                    {icon}
                </span>
                <span className="kc-nav-label">{children}</span>
            </span>
        </NavItem>
    );
};

const iconByPath: Record<string, JSX.Element> = {
    "": <UserIcon />,
    "account-security/signing-in": <ShieldAltIcon />,
    "account-security/device-activity": <LockIcon />,
    "account-security/linked-accounts": <KeyIcon />,
    applications: <ApplicationsIcon />,
    groups: <UsersIcon />,
    organizations: <ObjectGroupIcon />,
    resources: <ResourcesAlmostFullIcon />,
    oid4vci: <BullseyeIcon />
};

const iconByLabel: Partial<Record<TFuncKey, JSX.Element>> = {
    accountSecurity: <ShieldAltIcon />, // dropdown parent
    applications: <ApplicationsIcon />,
    groups: <UsersIcon />,
    organizations: <ObjectGroupIcon />,
    resources: <ResourcesAlmostFullIcon />,
    personalInfo: <UserIcon />
};

function getIcon(menuItem: MenuItem) {
    if ("path" in menuItem) {
        return iconByPath[menuItem.path] ?? iconByLabel[menuItem.label] ?? (
            <ApplicationsIcon />
        );
    }
    return iconByLabel[menuItem.label] ?? <ApplicationsIcon />;
}
