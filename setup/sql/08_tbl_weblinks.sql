CREATE TABLE IF NOT EXISTS `weblinks`
(
    id          int(11)      NOT NULL AUTO_INCREMENT,
    name        varchar(255) NOT NULL,
    url         varchar(255) NOT NULL,
    description text         NOT NULL,
    date        datetime DEFAULT NOW(),
    device_id   int(11)  DEFAULT NULL,
    PRIMARY KEY (id),
    CONSTRAINT `fk_device_id` FOREIGN KEY (device_id) REFERENCES devices (id) ON DELETE SET NULL ON UPDATE CASCADE
)
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8
    COLLATE = utf8_general_ci;