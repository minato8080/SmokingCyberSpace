# データベース設計

## テーブル構造と最大サイズ
サービス名 MongoDB@Atlas
容量上限 512MB
合計容量 20.983MB

### リクエストリストテーブル (requestlist)
-- 1 record byte = 83 bytes
-- Maximum number of records = 1,000
-- Maximum bytes = 83,000 bytes = 0.083MB

CREATE TABLE requestlist (
date CHAR(8) NOT NULL, -- 8 バイト
ip VARCHAR(45) NOT NULL, -- 最大 45 バイト + 1 バイト
user_id CHAR(6) NOT NULL, -- 固定長 6 バイト
name CHAR(12) NOT NULL, -- 固定長 12 バイト
videoid CHAR(11) NOT NULL -- 固定長 11 バイト
);

### 入退室ログテーブル
-- 1 record byte = 86 bytes
-- Maximum number of records = 100,000
-- Maximum bytes = 8,600,000 bytes = 8.6MB

CREATE TABLE roomlogs (
time CHAR(19) NOT NULL, -- 19 バイト
ip VARCHAR(45) NOT NULL, -- 最大 45 バイト + 1 バイト
user_id CHAR(6) NOT NULL, -- 固定長 6 バイト
name CHAR(12) NOT NULL, -- 固定長 12 バイト
state CHAR(3) NOT NULL CHECK (state IN ('IN', 'OUT')) -- 3 バイト
);

### チャットログテーブル
-- 1 record byte = 246 bytes
-- Maximum number of records = 50,000
-- Maximum bytes = 12,300,000 bytes = 12.3MB

CREATE TABLE chatlogs (
time CHAR(19) NOT NULL, -- 19 バイト
ip VARCHAR(45) NOT NULL, -- 最大 45 バイト + 1 バイト
user_id CHAR(6) NOT NULL, -- 固定長 6 バイト
name CHAR(12) NOT NULL, -- 固定長 12 バイト
message VARCHAR(162) NOT NULL -- 最大 162 バイト + 1 バイト
);
