CREATE TABLE IF NOT EXISTS `users`
(
    id          int(11)      NOT NULL AUTO_INCREMENT,
    username    varchar(255) NOT NULL UNIQUE,
    password    text         NOT NULL,
    email       varchar(255) NOT NULL DEFAULT '',
    firstname   varchar(255) NOT NULL DEFAULT '',
    lastname    varchar(255) NOT NULL DEFAULT '',
    notes       text         NOT NULL,
    hidden      text         NOT NULL,
    role_id     int(11)      NULL,
    created_at  datetime     NOT NULL DEFAULT NOW(),
    modified_at datetime     NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    PRIMARY KEY (`id`),
    CONSTRAINT `user_role_ibfk_1` FOREIGN KEY (role_id) REFERENCES `roles` (id) ON DELETE SET NULL ON UPDATE CASCADE
)
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8
    COLLATE = utf8_general_ci;