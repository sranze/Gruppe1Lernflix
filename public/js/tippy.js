D:\LaslesVPN-main>npm start

> lernflix@0.0.1 start D:\LaslesVPN-main
> node index.js

(node:15300) Warning: Accessing non-existent property 'MongoError' of module exports inside circular dependency
(Use `node --trace-warnings ...` to show where the warning was created)
Listening on 2000
Executing (default): SELECT 1+1 AS result
Executing (default): CREATE TABLE IF NOT EXISTS "idtokens" ("id"   SERIAL , "iss" TEXT, "platformId" TEXT, "clientId" TEXT, "deploymentId" TEXT, "user" TEXT, "userInfo" JSON, "platformInfo" JSON, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, PRIMARY KEY ("id"));
Executing (default): SELECT i.relname AS name, ix.indisprimary AS primary, ix.indisunique AS unique, ix.indkey AS indkey, array_agg(a.attnum) as column_indexes, array_agg(a.attname) AS column_names, pg_get_indexdef(ix.indexrelid) AS definition FROM pg_class t, pg_class i, pg_index ix, pg_attribute a WHERE t.oid = ix.indrelid AND i.oid = ix.indexrelid AND a.attrelid = t.oid AND t.relkind = 'r' and t.relname = 'idtokens' GROUP BY i.relname, ix.indexrelid, ix.indisprimary, ix.indisunique, ix.indkey ORDER BY i.relname;
Executing (default): CREATE INDEX "idtokens_iss_client_id_deployment_id_user" ON "idtokens" ("iss", "clientId", "deploymentId", "user")
Executing (default): CREATE INDEX "idtokens_created_at" ON "idtokens" ("createdAt")
Executing (default): CREATE TABLE IF NOT EXISTS "contexttokens" ("id"   SERIAL , "contextId" TEXT, "path" TEXT, "user" TEXT, "roles" TEXT[], "targetLinkUri" TEXT, "context" JSON, "resource" JSON, "custom" JSON, "endpoint" JSON, "namesRoles" JSON, "lis" JSON, "launchPresentation" JSON, "messageType" TEXT, "version" TEXT, "deepLinkingSettings" JSON, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, PRIMARY KEY ("id"));
Executing (default): SELECT i.relname AS name, ix.indisprimary AS primary, ix.indisunique AS unique, ix.indkey AS indkey, array_agg(a.attnum) as column_indexes, array_agg(a.attname) AS column_names, pg_get_indexdef(ix.indexrelid) AS definition FROM pg_class t, pg_class i, pg_index ix, pg_attribute a WHERE t.oid = ix.indrelid AND i.oid = ix.indexrelid AND a.attrelid = t.oid AND t.relkind = 'r' and t.relname = 'contexttokens' GROUP BY i.relname, ix.indexrelid, ix.indisprimary, ix.indisunique, ix.indkey ORDER BY i.relname;
Executing (default): CREATE INDEX "contexttokens_context_id_user" ON "contexttokens" ("contextId", "user")
Executing (default): CREATE INDEX "contexttokens_created_at" ON "contexttokens" ("createdAt")
Executing (default): CREATE TABLE IF NOT EXISTS "platforms" ("id"   SERIAL , "platformName" TEXT, "platformUrl" TEXT, "clientId" TEXT, "authEndpoint" TEXT, "accesstokenEndpoint" TEXT, "kid" TEXT, "authConfig" JSON, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, PRIMARY KEY ("id"));
Executing (default): SELECT i.relname AS name, ix.indisprimary AS primary, ix.indisunique AS unique, ix.indkey AS indkey, array_agg(a.attnum) as column_indexes, array_agg(a.attname) AS column_names, pg_get_indexdef(ix.indexrelid) AS definition FROM pg_class t, pg_class i, pg_index ix, pg_attribute a WHERE t.oid = ix.indrelid AND i.oid = ix.indexrelid AND a.attrelid = t.oid AND t.relkind = 'r' and t.relname = 'platforms' GROUP BY i.relname, ix.indexrelid, ix.indisprimary, ix.indisunique, ix.indkey ORDER BY i.relname;
Executing (default): CREATE UNIQUE INDEX "platforms_platform_url_client_id" ON "platforms" ("platformUrl", "clientId")
Executing (default): CREATE INDEX "platforms_platform_url" ON "platforms" ("platformUrl")
Executing (default): CREATE UNIQUE INDEX "platforms_kid" ON "platforms" ("kid")
Executing (default): CREATE TABLE IF NOT EXISTS "platformStatuses" ("id" VARCHAR(255) , "active" BOOLEAN DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, PRIMARY KEY ("id"));
Executing (default): SELECT i.relname AS name, ix.indisprimary AS primary, ix.indisunique AS unique, ix.indkey AS indkey, array_agg(a.attnum) as column_indexes, array_agg(a.attname) AS column_names, pg_get_indexdef(ix.indexrelid) AS definition FROM pg_class t, pg_class i, pg_index ix, pg_attribute a WHERE t.oid = ix.indrelid AND i.oid = ix.indexrelid AND a.attrelid = t.oid AND t.relkind = 'r' and t.relname = 'platformStatuses' GROUP BY i.relname, ix.indexrelid, ix.indisprimary, ix.indisunique, ix.indkey ORDER BY i.relname;
Executing (default): CREATE UNIQUE INDEX "platform_statuses_id" ON "platformStatuses" ("id")
Executing (default): CREATE TABLE IF NOT EXISTS "publickeys" ("kid" VARCHAR(255) , "platformUrl" TEXT, "clientId" TEXT, "iv" TEXT, "data" TEXT, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, PRIMARY KEY ("kid"));
Executing (default): SELECT i.relname AS name, ix.indisprimary AS primary, ix.indisunique AS unique, ix.indkey AS indkey, array_agg(a.attnum) as column_indexes, array_agg(a.attname) AS column_names, pg_get_indexdef(ix.indexrelid) AS definition FROM pg_class t, pg_class i, pg_index ix, pg_attribute a WHERE t.oid = ix.indrelid AND i.oid = ix.indexrelid AND a.attrelid = t.oid AND t.relkind = 'r' and t.relname = 'publickeys' GROUP BY i.relname, ix.indexrelid, ix.indisprimary, ix.indisunique, ix.indkey ORDER BY i.relname;
Executing (default): CREATE UNIQUE INDEX "publickeys_kid" ON "publickeys" ("kid")
Executing (default): CREATE TABLE IF NOT EXISTS "privatekeys" ("kid" VARCHAR(255) , "platformUrl" TEXT, "clientId" TEXT, "iv" TEXT, "data" TEXT, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, PRIMARY KEY ("kid"));
Executing (default): SELECT i.relname AS name, ix.indisprimary AS primary, ix.indisunique AS unique, ix.indkey AS indkey, array_agg(a.attnum) as column_indexes, array_agg(a.attname) AS column_names, pg_get_indexdef(ix.indexrelid) AS definition FROM pg_class t, pg_class i, pg_index ix, pg_attribute a WHERE t.oid = ix.indrelid AND i.oid = ix.indexrelid AND a.attrelid = t.oid AND t.relkind = 'r' and t.relname = 'privatekeys' GROUP BY i.relname, ix.indexrelid, ix.indisprimary, ix.indisunique, ix.indkey ORDER BY i.relname;
Executing (default): CREATE UNIQUE INDEX "privatekeys_kid" ON "privatekeys" ("kid")
Executing (default): CREATE TABLE IF NOT EXISTS "accesstokens" ("id"   SERIAL , "platformUrl" TEXT, "clientId" TEXT, "scopes" TEXT, "iv" TEXT, "data" TEXT, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, PRIMARY KEY ("id"));
Executing (default): SELECT i.relname AS name, ix.indisprimary AS primary, ix.indisunique AS unique, ix.indkey AS indkey, array_agg(a.attnum) as column_indexes, array_agg(a.attname) AS column_names, pg_get_indexdef(ix.indexrelid) AS definition FROM pg_class t, pg_class i, pg_index ix, pg_attribute a WHERE t.oid = ix.indrelid AND i.oid = ix.indexrelid AND a.attrelid = t.oid AND t.relkind = 'r' and t.relname = 'accesstokens' GROUP BY i.relname, ix.indexrelid, ix.indisprimary, ix.indisunique, ix.indkey ORDER BY i.relname;
Executing (default): CREATE UNIQUE INDEX "accesstokens_platform_url_client_id_scopes" ON "accesstokens" ("platformUrl", "clientId", "scopes")
Executing (default): CREATE INDEX "accesstokens_created_at" ON "accesstokens" ("createdAt")
Executing (default): CREATE TABLE IF NOT EXISTS "nonces" ("nonce" VARCHAR(255) , "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, PRIMARY KEY ("nonce"));
Executing (default): SELECT i.relname AS name, ix.indisprimary AS primary, ix.indisunique AS unique, ix.indkey AS indkey, array_agg(a.attnum) as column_indexes, array_agg(a.attname) AS column_names, pg_get_indexdef(ix.indexrelid) AS definition FROM pg_class t, pg_class i, pg_index ix, pg_attribute a WHERE t.oid = ix.indrelid AND i.oid = ix.indexrelid AND a.attrelid = t.oid AND t.relkind = 'r' and t.relname = 'nonces' GROUP BY i.relname, ix.indexrelid, ix.indisprimary, ix.indisunique, ix.indkey ORDER BY i.relname;
Executing (default): CREATE UNIQUE INDEX "nonces_nonce" ON "nonces" ("nonce")
Executing (default): CREATE INDEX "nonces_created_at" ON "nonces" ("createdAt")
Executing (default): CREATE TABLE IF NOT EXISTS "states" ("state" VARCHAR(255) , "query" JSON, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, PRIMARY KEY ("state"));
Executing (default): SELECT i.relname AS name, ix.indisprimary AS primary, ix.indisunique AS unique, ix.indkey AS indkey, array_agg(a.attnum) as column_indexes, array_agg(a.attname) AS column_names, pg_get_indexdef(ix.indexrelid) AS definition FROM pg_class t, pg_class i, pg_index ix, pg_attribute a WHERE t.oid = ix.indrelid AND i.oid = ix.indexrelid AND a.attrelid = t.oid AND t.relkind = 'r' and t.relname = 'states' GROUP BY i.relname, ix.indexrelid, ix.indisprimary, ix.indisunique, ix.indkey ORDER BY i.relname;
Executing (default): CREATE UNIQUE INDEX "states_state" ON "states" ("state")
Executing (default): CREATE INDEX "states_created_at" ON "states" ("createdAt")
Executing (default): DELETE FROM "idtokens" WHERE "createdAt" <= '2021-02-25 09:18:28.033 +00:00'
Executing (default): DELETE FROM "contexttokens" WHERE "createdAt" <= '2021-02-25 09:18:28.183 +00:00'
Executing (default): DELETE FROM "accesstokens" WHERE "createdAt" <= '2021-02-26 08:18:28.302 +00:00'
Executing (default): DELETE FROM "nonces" WHERE "createdAt" <= '2021-02-26 09:18:18.423 +00:00'
Executing (default): DELETE FROM "states" WHERE "createdAt" <= '2021-02-26 09:08:28.544 +00:00'
  _   _______ _____      _  _____
 | | |__   __|_   _|    | |/ ____|
 | |    | |    | |      | | (___
 | |    | |    | |  _   | |\___ \
 | |____| |   _| |_| |__| |____) |
 |______|_|  |_____|\____/|_____/

 LTI Provider is listening on port 3000!

 LTI provider config:
 >App Route: /
 >Initiate Login Route: /login
 >Keyset Route: /keys
 >Dynamic Registration Route: /register
Executing (default): SELECT "id", "platformName", "platformUrl", "clientId", "authEndpoint", "accesstokenEndpoint", "kid", "authConfig", "createdAt", "updatedAt" FROM "platforms" AS "platform" WHERE "platform"."platformUrl" = 'https://platform.url' AND "platform"."clientId" = 'TOOLCLIENTID';
Executing (default): SELECT "kid", "platformUrl", "clientId", "iv", "data", "createdAt", "updatedAt" FROM "publickeys" AS "publickey" WHERE "publickey"."kid" = '6927aa16c512960865150352c4e7a7ed';
Executing (default): DELETE FROM "publickeys" WHERE "platformUrl" = 'https://platform.url' AND "clientId" = 'TOOLCLIENTID'
Executing (default): INSERT INTO "publickeys" ("kid","platformUrl","clientId","iv","data","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING "kid","platformUrl","clientId","iv","data","createdAt","updatedAt";
Executing (default): DELETE FROM "privatekeys" WHERE "platformUrl" = 'https://platform.url' AND "clientId" = 'TOOLCLIENTID'
Executing (default): INSERT INTO "privatekeys" ("kid","platformUrl","clientId","iv","data","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING "kid","platformUrl","clientId","iv","data","createdAt","updatedAt";
Executing (default): DELETE FROM "platforms" WHERE "platformUrl" = 'https://platform.url' AND "clientId" = 'TOOLCLIENTID'
Executing (default): INSERT INTO "platforms" ("id","platformName","platformUrl","clientId","authEndpoint","accesstokenEndpoint","kid","authConfig","createdAt","updatedAt") VALUES (DEFAULT,$1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING "id","platformName","platformUrl","clientId","authEndpoint","accesstokenEndpoint","kid","authConfig","createdAt","updatedAt";


