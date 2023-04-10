CREATE TABLE IF NOT EXISTS `manufacturers`
(
    id     int(11)      NOT NULL AUTO_INCREMENT,
    name   varchar(255) NOT NULL,
    image  varchar(255) NOT NULL,
    notes  text         NOT NULL,
    hidden text         NOT NULL,
    PRIMARY KEY (id)
)
    ENGINE = InnoDB
    DEFAULT CHARSET = utf8
    COLLATE = utf8_general_ci