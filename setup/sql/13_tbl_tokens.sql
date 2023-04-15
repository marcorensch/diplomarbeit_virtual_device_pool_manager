CREATE TABLE IF NOT EXISTS `tokens`
(
    id            int(11)   NOT NULL AUTO_INCREMENT,
    token         text      NOT NULL,
    refresh_token text      NOT NULL,
    user_id       int(11)   NOT NULL,
    created_at    timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8
  COLLATE = utf8_general_ci;