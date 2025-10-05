/**
 * Defines the structure for the naming conventions required by the generator.
 */
interface NamingConvention {
    User_3_000___: string
}

/**
 * Defines the structure of the input JSON configuration.
 */
interface InputConfig {
    namingConvention: NamingConvention
}

/**
 * Generates the summary route.ts file content as a string.
 *
 * This function creates a simple GET endpoint that handles rate limiting
 * and calls the dynamically named summary function from the controller.
 *
 * @param {string} inputJsonString - A JSON string containing the naming conventions.
 * @returns {string} The complete, formatted summary route.ts file as a string.
 */
export function generateSummaryRoute(inputJsonString: string): string {
    // Parse the JSON to access naming conventions.
    const config: InputConfig = JSON.parse(inputJsonString)
    const { namingConvention } = config

    // e.g., "Post"
    const singularName = namingConvention.User_3_000___

    // e.g., "getPostSummary"
    const getSummaryFunction = `get${singularName}Summary`

    // Use a template literal to construct the final file content.
    const routeTemplate = `
import { handleRateLimit } from '@/app/api/utils/rate-limit';
import { ${getSummaryFunction} } from './controller';
import {
    formatResponse,
    //    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET ${singularName} Summary
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

    //    const tokenResponse = handleTokenVerify(req);
    //    if (tokenResponse) return tokenResponse;

    const result: IResponse = await ${getSummaryFunction}(req);
    return formatResponse(result.data, result.message, result.status);
}
`
    return routeTemplate.trim()
}
