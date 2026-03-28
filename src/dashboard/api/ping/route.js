export async function GET() {
    return Response.json({
        status: 'ok',
        source: 'template-addon',
        message: 'This response comes from src/dashboard/api/ping/route.js'
    });
}
