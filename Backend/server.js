require('dotenv').config()
const express =require("express")
const app = express()
const { createClient } = require("redis")

const PORT = process.env.PORT
const Message = "hi"

const redis = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
})

redis.connect().catch(err => console.log("Redis connection failed at startup:", err.message));

app.get("/api", async (req, res)=>{
    try {
        const hits = await redis.incr("hits");
        res.json({
            message: Message,
            hits,
            time: new Date().toISOString()
        });
    } catch (err) {
    console.error("Redis error:", err);
    res.status(500).json({ error: "Redis error", details: err.message });
  }
})

app.get("/health", async (req, res) => {
  try {
    await redis.ping()
    res.send("OK")
  } catch (err) {
    console.error("Redis health error:", err)
    res.status(500).send("Redis not reachable")
  }
})

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`)
})

