CREATE TABLE IF NOT EXISTS `tokens`
(
    id            int(11)  NOT NULL AUTO_INCREMENT,
    user_id       int(11)  NOT NULL,
    token         text     NOT NULL,
    refresh_token text     NOT NULL,
    created_at    datetime NOT NULL DEFAULT NOW(),
    modified_at   datetime NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    PRIMARY KEY (id),
    UNIQUE KEY token (token),
    CONSTRAINT tokens_ibfk_1 FOREIGN KEY (user_id) REFERENCES accounts (id) ON DELETE CASCADE ON UPDATE CASCADE

) ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8
  COLLATE = utf8_general_ci;