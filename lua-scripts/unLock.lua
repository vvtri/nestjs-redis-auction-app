local lockKey = KEYS[1]
local token = ARGV[1]

if (redis.call("GET", lockKey) == token) then
  redis.call("DEL", lockKey)
end