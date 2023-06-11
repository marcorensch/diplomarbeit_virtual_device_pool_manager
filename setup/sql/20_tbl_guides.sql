CREATE TABLE IF NOT EXISTS `guides`
(
    id          int(11)      NOT NULL AUTO_INCREMENT,
    name        varchar(255) NOT NULL,
    description text         NOT NULL,
    sorting     int(11)      NOT NULL DEFAULT 0,
    visible     tinyint(1)   NOT NULL DEFAULT 0,
    modified_at timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at  timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
)
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8
    COLLATE = utf8_general_ci;