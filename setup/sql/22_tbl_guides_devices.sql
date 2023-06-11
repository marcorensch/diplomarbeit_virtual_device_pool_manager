CREATE TABLE IF NOT EXISTS `guides_devices`
(
    id        int(11) NOT NULL AUTO_INCREMENT,
    device_id int(11) NOT NULL,
    guide_id  int(11) NOT NULL,
    created_at   datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT `fk_gd_guide_id` FOREIGN KEY (guide_id) REFERENCES guides (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_gd_device_id` FOREIGN KEY (device_id) REFERENCES devices (id) ON DELETE CASCADE ON UPDATE CASCADE
)
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8
    COLLATE = utf8_general_ci;