let config;
let db = process.env.DB_CONN || `mongodb://cirdandb:${encodeURIComponent('/g6+{ZM?Jg>/S[$S')}@35.178.220.201:27017/ETNmanagement`;
if (!process.env.DB_CONN) {
  console.log("Using default DB Connection String.");
}
config = {
  bodyLimit: "100kb",
  corsHeaders: ["Link"]
};

export default {
  config,
  db
};
