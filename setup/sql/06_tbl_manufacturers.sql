CREATE TABLE IF NOT EXISTS `manufacturers`
(
    id          int(11)   NOT NULL AUTO_INCREMENT,
    name        varchar(255)       DEFAULT NULL,
    image       varchar(255)       DEFAULT NULL,
    notes       text      NOT NULL,
    hidden      text      NOT NULL,
    created_at  timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FULLTEXT(name) -- Volltextsuch-Index auf der Spalte "name"
)
    ENGINE = InnoDB
    DEFAULT CHARSET = utf8
    COLLATE = utf8_general_ci