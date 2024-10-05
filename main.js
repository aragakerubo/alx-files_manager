import redisClient from "./utils/redis";

(async () => {
    console.log("Redis is alive:", redisClient.isAlive());

    try {
        console.log("Fetching key 'myKey':", await redisClient.get("myKey"));

        await redisClient.set("myKey", 12, 5);
        console.log("Set key 'myKey' to 12 with 5-second expiration.");

        console.log(
            "Fetching key 'myKey' after setting:",
            await redisClient.get("myKey")
        );

        setTimeout(async () => {
            console.log(
                "Fetching key 'myKey' after 10 seconds (should be expired):",
                await redisClient.get("myKey")
            );
        }, 1000 * 10);
    } catch (error) {
        console.error("Redis error:", error.message);
    }
})();
