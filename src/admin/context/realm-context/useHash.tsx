/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260305.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/context/realm-context/useHash.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useEffect, useState } from "react";

export const useHash = () => {
    const [hash, setHash] = useState(() => window.location.hash.substring(1));

    useEffect(() => {
        const orgPushState = window.history.pushState;
        window.history.pushState = new Proxy(window.history.pushState, {
            apply: (func, target, args) => {
                const url = new URL(args[2], window.location.origin);
                setHash(url.hash.substring(1));
                return Reflect.apply(func, target, args);
            }
        });
        return () => {
            window.history.pushState = orgPushState;
        };
    }, []);
    return decodeURIComponent(hash);
};

// @TODO: original code
// export const useHash = () => {
//     const [hash, setHash] = useState(location.hash);

//     useEffect(() => {
//         const orgPushState = window.history.pushState;
//         window.history.pushState = new Proxy(window.history.pushState, {
//             apply: (func, target, args) => {
//                 setHash(args[2].substring(1));
//                 return Reflect.apply(func, target, args);
//             }
//         });
//         return () => {
//             window.history.pushState = orgPushState;
//         };
//     }, []);
//     return decodeURIComponent(hash);
// };
