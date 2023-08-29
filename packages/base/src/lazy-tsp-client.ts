/* eslint-disable @typescript-eslint/no-explicit-any */

import { ITspClient } from 'tsp-typescript-client';
import { HttpTspClient } from 'tsp-typescript-client/lib/protocol/http-tsp-client';

/**
 * Hack!
 * The `LazyTspClient` replaces _every_ method with an asynchronous one.
 * Only keep methods, discard properties.
 */
export type LazyTspClient = {
    [K in keyof ITspClient]: ITspClient[K] extends (...args: infer A) => infer R | Promise<infer R>
        ? (...args: A) => Promise<R>
        : never; // Discard property.
};

export type LazyTspClientFactory = typeof LazyTspClientFactory;
export function LazyTspClientFactory(url: Promise<string>): ITspClient {
    // All methods from the `HttpTspClient` are asynchronous. The `LazyTspClient`
    // will just delay each call to its methods by first awaiting for the
    // asynchronous `baseUrl` resolution to then get a valid `HttpTspClient`.
    const tspClientPromise = url.then(baseUrl => new HttpTspClient(baseUrl));
    // eslint-disable-next-line no-null/no-null
    return new Proxy(Object.create(null), {
        get(target, property, _receiver) {
            let method = target[property];
            if (!method) {
                target[property] = method = async (...args: any[]) => {
                    const tspClient = (await tspClientPromise) as any;
                    return tspClient[property](...args);
                };
            }
            return method;
        }
    }) as LazyTspClient as ITspClient;
}
