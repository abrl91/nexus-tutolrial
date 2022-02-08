import { server } from "./server";

server.listen()
.then(({ url }) => {
    console.log(`🚀 server is running at ${url}`)
});