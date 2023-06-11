CREATE TABLE IF NOT EXISTS `weblinks`
(
    id          int(11)      NOT NULL AUTO_INCREMENT,
    name        varchar(255) NOT NULL,
    uri         varchar(255) NOT NULL,
    description text         NOT NULL,
    device_id   int(11)  DEFAULT NULL,
    sorting     int(11)  DEFAULT 0,
    created_at  datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT `fk_device_id` FOREIGN KEY (device_id) REFERENCES devices (id) ON DELETE CASCADE ON UPDATE CASCADE
)
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8
    COLLATE = utf8_general_ci;