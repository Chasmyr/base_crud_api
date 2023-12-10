import buildServer from "./server";

const server = buildServer()

async function main() {
    try {
        await server.listen({port: 4002, host: '0.0.0.0'})
        console.log('serve rdy at http://localhost:4002')
    }catch(e) {
        console.error(e)
        process.exit(1)
    }
}
main()