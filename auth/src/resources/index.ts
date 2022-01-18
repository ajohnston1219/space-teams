import { Response, NextFunction } from "express";
import { Request } from "../routes/Route";
// Resource format
// {
//    resource [required if not wrapper] : object -> The resource itself,
//
//    init [optional] : string | function -> Either the name of a method on 'resource'
//                                           or a function. Will be called in the finally block
//
//    wrap [optional] : function -> A function that takes a function as an argument. The function
//                                  argument should be the resource itself. This wrapper function will
//                                  be wrapped around the handler, passing the argument as the resource.
//
//    catch [optional] : string | function -> Either the name of a method on 'resource'
//                                           or a function. Will be called in the catch block
//
//    finally [optional] string | function -> Either the name of a method on 'resource'
//                                            or a function. Will be called in the finally block
// }

// Manages resources by calling associated disconnect/close
// function in a try/catch/finally block. Also catches unhandled
// errors.
const withResources = (resources: any, fn: any): (req: Request, res: Response, next: NextFunction) => Promise<void> =>
    async (req: Request, res: Response, next: NextFunction) => {
        const checkedResources: any = {};
        try {
            // Validate input
            if (typeof resources !== "object" || resources === null) {
                const err = {
                    tag: "With Resources",
                    message: "First argument of 'withResources' should be an object of resources"
                };
                return next(err);
            }

            // NOTE: Can only have one wrapper
            let wrapper: any = null;
            let wrappedResourceKey: any = null;

            // Check resources and create object to pass into fn
            Object.keys(resources).forEach((key: string) => {
                const r = resources[key];
                let isWrapper = false;
                // Check if it's a wrapper
                if (r.hasOwnProperty("wrapper")) {
                    // TODO(adam): Warn and skip if not a function
                    if (wrapper) {
                        console.warn("Multiple wrappers found in 'withResources' call, skipping second one");
                    } else {
                        wrapper = r.wrapper;
                        wrappedResourceKey = key;
                        isWrapper = true;
                    }
                }

                if (!isWrapper) {
                    // Check for required (if not wrapper) resource field
                    if (!r.hasOwnProperty("resource")) {
                        console.error("Resource '" + key + "' missing required 'resource' field." +
                            " Skipping, which will probably cause problems later.");
                        return;
                    }
                }

                // Check for optional init field
                if (!r.hasOwnProperty("init")) {
                    // Add no-op as placeholder
                    r.init = () => {};
                } else if (typeof r.init === "string") {
                    r.init = r.resource[r.init];
                } // If not, assume it's a function

                // Check for optional catch field
                if (!r.hasOwnProperty("catch")) {
                    // Add no-op as placeholder
                    r.catch = () => {};
                } else if (typeof r.catch === "string") {
                    r.catch = r.resource[r.catch];
                } // If not, assume it's a function

                // Check for optional finally field
                if (!r.hasOwnProperty("finally")) {
                    // Add no-op as placeholder
                    r.finally = () => {};
                } else if (typeof r.finally === "string") {
                    r.finally = r.resource[r.finally];
                } // If not, assume it's a function

                // Add to resources
                checkedResources[key] = r;
            });

            // Initialize resources
            const initializedResources: any = {};

            try {
                await Promise.all(Object.keys(checkedResources).map(async (k: string) => {
                    try {
                        await checkedResources[k].init();
                        if (!checkedResources[k].isWrapper) {
                            initializedResources[k] = checkedResources[k].resource;
                        }
                    } catch (err: any) {
                        console.error("Error calling 'init' callback in 'withResources' wrapped function" +
                            " for resource '" + k + "'");
                        if (err.stack)
                            console.error(err.stack);
                        throw err;
                    }
                }));
            } catch (err: any) {
                return next(err);
            }

            // Call fn with generated and initialized resources
            try {
                if (wrapper) {
                    await wrapper(async (wrappedResource: any) => {
                        try {
                            initializedResources[wrappedResourceKey] = wrappedResource;
                            await fn(req, res, next, initializedResources);
                        } catch (err: any) {
                            console.error("Error inside wrapper function in 'withResources'");
                            throw err;
                        }
                    });
                } else {
                    await fn(req, res, next, initializedResources);
                }

            // Call catch callbacks on errors
            } catch (err: any) {
                await Promise.all(Object.keys(checkedResources).map(async (k: string) => {
                    try {
                        await checkedResources[k].catch(err);
                    } catch (err: any) {
                        console.error("Error calling 'catch' callback in 'withResources' wrapped function" +
                            " for resource '" + k + "'");
                    }
                }));

                return next(err);

            // Cleanup resources
            } finally {
                try {
                    await Promise.all(Object.keys(checkedResources).map(async (k: string) => {
                        try {
                            await checkedResources[k].finally();
                        } catch (err: any) {
                            console.error("Error calling 'finally' callback in 'withResources' wrapped function" +
                                " for resource '" + k + "'");
                            if (err.stack)
                                console.error(err.stack);
                            throw err;
                        }
                    }));
                } catch (err: any) {
                    return next(err);
                }
            };

        } catch (err: any) {
            console.error("Error generating 'withResources' wrapped function");
            console.error(err.message || "Unknown error");
            if (err.stack)
                console.error(err.stack);
            return next(err);
        }
    };

export default withResources;
