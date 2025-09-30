/**
 * Defines the structure for the naming and schema configuration.
 */
interface InputConfig {
    schema: Record<string, string>
    namingConvention: {
        User_3_000___: string
    }
}

/**
 * A helper function to capitalize the first letter of a string.
 * e.g., "amount" -> "Amount"
 */
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/**
 * Generates the summary controller.ts file content as a string.
 *
 * This function dynamically constructs a controller that:
 * 1. Identifies fields marked as "INTNUMBER" or "FLOATNUMBER" from the schema.
 * 2. Builds a MongoDB aggregation pipeline to sum these numeric fields, grouped by month.
 * 3. Calculates total records and records in the last 24 hours.
 * 4. Implements pagination for the monthly summary table.
 * 5. Calculates a grand total across all months for the numeric fields.
 *
 * @param {string} inputJsonString - A JSON string containing the schema and naming conventions.
 * @returns {string} The complete, formatted summary controller.ts file as a string.
 */
export function generateSummaryController(inputJsonString: string): string {
    const config: InputConfig = JSON.parse(inputJsonString)
    const { namingConvention, schema } = config

    const singularName = namingConvention.User_3_000___ // e.g., "Post"
    const getSummaryFunction = `get${singularName}Summary` // e.g., "getPostSummary"

    // Find all fields that are numeric to build the aggregation.
    const numericFields = Object.keys(schema).filter(
        (key) => schema[key] === 'INTNUMBER' || schema[key] === 'FLOATNUMBER'
    )

    // If there are no numeric fields, we generate a simpler controller.
    if (numericFields.length === 0) {
        return `
import { withDB } from '@/app/api/utils/db';
import ${singularName} from '../model';

interface IResponse {
    data: unknown
    message: string
    status: number
}

// Helper to format responses
const formatResponse = (data: unknown, message: string, status: number): IResponse => ({
    data,
    message,
    status,
})

export async function ${getSummaryFunction}(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const [totalDocs, last24HoursDocs] = await Promise.all([
            ${singularName}.countDocuments({}),
            ${singularName}.countDocuments({ createdAt: { $gte: twentyFourHoursAgo } }),
        ]);

        return formatResponse(
            {
                overall: {
                    totalRecords: totalDocs,
                    recordsLast24Hours: last24HoursDocs,
                },
                monthlyTable: [], // No numeric fields to aggregate
                tableSummary: { totalMonths: 0 },
                pagination: { currentPage: 1, limit: 10, totalMonths: 0, totalPages: 0 },
            },
            'Summary fetched successfully',
            200
        );
    });
}
        `.trim()
    }

    // Dynamically generate parts of the controller code
    const aggregationResultInterface = numericFields
        .map((field) => `    total${capitalize(field)}: number;`)
        .join('\n')

    const groupStageSums = numericFields
        .map(
            (field) =>
                `                        total${capitalize(field)}: { $sum: '$${field}' },`
        )
        .join('\n')

    const monthlyTableProperties = numericFields
        .map(
            (field) =>
                `                total${capitalize(field)}: stat.total${capitalize(field)} || 0,`
        )
        .join('\n')

    const initialAccumulator = numericFields
        .map((field) => `grandTotal${capitalize(field)}: 0,`)
        .join(' ')

    const reduceLogic = numericFields
        .map(
            (field) =>
                `            acc.grandTotal${capitalize(field)} += curr.total${capitalize(field)};`
        )
        .join('\n')

    // Assemble the final controller string using a template
    const controllerTemplate = `
import { withDB } from '@/app/api/utils/db';
import ${singularName} from '../model';

interface IResponse {
    data: unknown;
    message: string;
    status: number;
}

const formatResponse = (data: unknown, message: string, status: number): IResponse => ({
    data,
    message,
    status,
});

interface AggregationResult {
    _id: {
        month: number;
        year: number;
    };
${aggregationResultInterface}
}

export async function ${getSummaryFunction}(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const url = new URL(req.url);
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const limit = parseInt(url.searchParams.get('limit') || '10', 10);

        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const [totalDocs, last24HoursDocs, monthlyStatsRaw] = await Promise.all([
            ${singularName}.countDocuments({}),
            ${singularName}.countDocuments({ createdAt: { $gte: twentyFourHoursAgo } }),
            ${singularName}.aggregate<AggregationResult>([
                {
                    $group: {
                        _id: {
                            month: { $month: '$createdAt' },
                            year: { $year: '$createdAt' },
                        },
${groupStageSums}
                    },
                },
                {
                    $sort: { '_id.year': -1, '_id.month': -1 },
                },
            ]),
        ]);

        const fullMonthlyTable = monthlyStatsRaw.map((stat) => {
            const date = new Date();
            date.setMonth(stat._id.month - 1);
            const monthName = date.toLocaleString('default', { month: 'long' });

            return {
                month: \`\${monthName} \${stat._id.year}\`,
${monthlyTableProperties}
            };
        });

        const tableSummary = fullMonthlyTable.reduce(
            (acc, curr) => {
                acc.totalMonths += 1;
${reduceLogic}
                return acc;
            },
            { totalMonths: 0, ${initialAccumulator} }
        );

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedMonthlyTable = fullMonthlyTable.slice(startIndex, endIndex);

        return formatResponse(
            {
                overall: {
                    totalRecords: totalDocs,
                    recordsLast24Hours: last24HoursDocs,
                },
                monthlyTable: paginatedMonthlyTable,
                tableSummary,
                pagination: {
                    currentPage: page,
                    limit,
                    totalMonths: fullMonthlyTable.length,
                    totalPages: Math.ceil(fullMonthlyTable.length / limit),
                },
            },
            'Summary fetched successfully',
            200
        );
    });
}
`
    return controllerTemplate.trim()
}
