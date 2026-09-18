-- Better Auth 1.7.5 no longer writes account.issuer (removed after the 1.7.0-1.7.2 window that
-- introduced it); relax the NOT NULL constraint so new account inserts stop failing.
-- See https://www.better-auth.com/docs/guides/1-7-upgrade-guide

CREATE TABLE account_next (
  id TEXT PRIMARY KEY NOT NULL,
  issuer TEXT,
  providerAccountId TEXT NOT NULL,
  providerId TEXT NOT NULL,
  userId TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  accessToken TEXT,
  refreshToken TEXT,
  idToken TEXT,
  accessTokenExpiresAt TEXT,
  refreshTokenExpiresAt TEXT,
  scope TEXT,
  password TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

INSERT INTO account_next (
  id,
  issuer,
  providerAccountId,
  providerId,
  userId,
  accessToken,
  refreshToken,
  idToken,
  accessTokenExpiresAt,
  refreshTokenExpiresAt,
  scope,
  password,
  createdAt,
  updatedAt
)
SELECT
  id,
  issuer,
  providerAccountId,
  providerId,
  userId,
  accessToken,
  refreshToken,
  idToken,
  accessTokenExpiresAt,
  refreshTokenExpiresAt,
  scope,
  password,
  createdAt,
  updatedAt
FROM account;

DROP TABLE account;
ALTER TABLE account_next RENAME TO account;

CREATE UNIQUE INDEX account_issuer_providerAccountId_uidx
ON account(issuer, providerAccountId);
CREATE INDEX account_userId_idx ON account(userId);
