CREATE TABLE IF NOT EXISTS `guides`
(
    id          int(11)      NOT NULL AUTO_INCREMENT,
    name        varchar(255) NOT NULL,
    description text         NOT NULL,
    sorting     int(11)      NOT NULL DEFAULT 0,
    created_at  timestamp    NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id)
)
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8
    COLLATE = utf8_general_ci;